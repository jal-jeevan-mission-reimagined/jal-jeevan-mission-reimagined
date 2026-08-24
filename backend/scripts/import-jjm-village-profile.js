require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const sourceFileName = "Village Profile.csv";
const sourceFilePath = path.resolve(
  __dirname,
  "..",
  "data",
  "jjm",
  "raw",
  sourceFileName
);

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (inQuotes && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && csv[index + 1] === "\n") {
        index += 1;
      }

      row.push(field.trim());
      if (row.some((value) => value !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field.trim());
    if (row.some((value) => value !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function extractHabitationId(habitationName) {
  const match = habitationName.match(
    /habitation\s*id\s*[:#-]?\s*([0-9]+)/i
  );

  return match ? match[1] : null;
}

function parseInteger(value) {
  const normalized = value.replace(/,/g, "").trim();

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
}

function cleanDataRow(cells) {
  if (cells.length < 10 || !/^\d+$/.test(cells[0])) {
    return { kind: "skipped" };
  }

  const habitationName = cells[1].trim();
  const habitationId = extractHabitationId(habitationName);

  if (!habitationName || !habitationId) {
    return { kind: "invalidHabitationId" };
  }

  const numericValues = [2, 3, 4, 5, 7, 8, 9].map((index) =>
    parseInteger(cells[index] || "")
  );

  if (numericValues.some((value) => value === null)) {
    return { kind: "skipped" };
  }

  return {
    kind: "importable",
    record: {
      sourceRowNumber: Number(cells[0]),
      habitationId,
      habitationName,
      ruralPopulation: numericValues[0],
      scPopulation: numericValues[1],
      stPopulation: numericValues[2],
      generalPopulation: numericValues[3],
      waterQualityStatus: cells[6] || null,
      households: numericValues[4],
      tapConnections: numericValues[5],
      balanceHouseholds: numericValues[6],
    },
  };
}

function hashRecord(record) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(record))
    .digest("hex");
}

async function getOrCreateBatch() {
  const existingBatch = await prisma.importBatch.findFirst({
    where: {
      sourceSystem: "JJM",
      sourceDataset: "VILLAGE_PROFILE",
      sourceFileName,
      sourceReportDate: null,
      sourcePeriod: null,
    },
  });

  if (existingBatch) {
    console.log(
      `[VILLAGE_PROFILE] batch created/reused: reused ${existingBatch.id}`
    );
    return existingBatch;
  }

  const batch = await prisma.importBatch.create({
    data: {
      sourceSystem: "JJM",
      sourceDataset: "VILLAGE_PROFILE",
      sourceFileName,
      sourceUrl: null,
      sourceReportDate: null,
      sourcePeriod: null,
    },
  });

  console.log(
    `[VILLAGE_PROFILE] batch created/reused: created ${batch.id}`
  );
  return batch;
}

async function main() {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(
      `Village Profile source file was not found: ${sourceFilePath}`
    );
  }

  const csv = fs.readFileSync(sourceFilePath, "utf8");
  const rows = parseCsv(csv);
  const cleanedRows = [];
  let skippedRows = 0;
  let missingOrInvalidHabitationIds = 0;

  for (const row of rows) {
    const cleaned = cleanDataRow(row);

    if (cleaned.kind === "importable") {
      cleanedRows.push(cleaned.record);
    } else {
      skippedRows += 1;
      if (cleaned.kind === "invalidHabitationId") {
        missingOrInvalidHabitationIds += 1;
      }
    }
  }

  const batch = await getOrCreateBatch();

  for (const record of cleanedRows) {
    const rawRecordHash = hashRecord(record);

    await prisma.importRecord.upsert({
      where: {
        importBatchId_rowNumber: {
          importBatchId: batch.id,
          rowNumber: record.sourceRowNumber,
        },
      },
      update: {
        externalId: record.habitationId,
        rawRecordHash,
        rawData: record,
      },
      create: {
        importBatchId: batch.id,
        rowNumber: record.sourceRowNumber,
        externalId: record.habitationId,
        rawRecordHash,
        rawData: record,
      },
    });
  }

  console.log(`[VILLAGE_PROFILE] rows read: ${rows.length}`);
  console.log(`[VILLAGE_PROFILE] rows imported: ${cleanedRows.length}`);
  console.log(`[VILLAGE_PROFILE] rows skipped: ${skippedRows}`);
  console.log(
    `[VILLAGE_PROFILE] rows with missing/invalid HabitationId: ${missingOrInvalidHabitationIds}`
  );
}

main()
  .catch((error) => {
    console.error("[VILLAGE_PROFILE] import failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
