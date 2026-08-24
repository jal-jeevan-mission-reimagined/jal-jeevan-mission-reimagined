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

const sourceFileName = "Format E5- Tested Sources.xls";
const sourceFilePath = path.resolve(
  __dirname,
  "..",
  "data",
  "jjm",
  "raw",
  sourceFileName
);
const sourceReportDate = new Date("2026-08-23T00:00:00.000Z");
const sourcePeriod = "2026-08-23";

function cleanCell(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseRows(html) {
  const tableMatch = html.match(
    /<table[^>]*id=["']tableReportTable["'][^>]*>([\s\S]*?)<\/table>/i
  );

  if (!tableMatch) {
    throw new Error("E5 report table was not found");
  }

  return [...tableMatch[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(
    (rowMatch) =>
      [...rowMatch[1].matchAll(/<(th|td)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(
        (cellMatch) => cleanCell(cellMatch[2])
      )
  );
}

function parseInteger(value) {
  const normalized = value.replace(/,/g, "").trim();

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
}

function cleanSourceRow(cells) {
  if (cells.length < 6 || !/^\d+$/.test(cells[0]) || !cells[1]) {
    return null;
  }

  const values = [cells[2], cells[3], cells[4], cells[5]].map(parseInteger);

  if (values.some((value) => value === null)) {
    return null;
  }

  return {
    rowNumber: Number(cells[0]),
    state: cells[1],
    totalSources: values[0],
    sourcesTested: values[1],
    chemicalContamination: values[2],
    bacteriologicalContamination: values[3],
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
      sourceDataset: "E5",
      sourceFileName,
      sourceReportDate,
      sourcePeriod,
    },
  });

  if (existingBatch) {
    console.log(`[E5] batch created/reused: reused ${existingBatch.id}`);
    return existingBatch;
  }

  const batch = await prisma.importBatch.create({
    data: {
      sourceSystem: "JJM",
      sourceDataset: "E5",
      sourceFileName,
      sourceUrl: null,
      sourceReportDate,
      sourcePeriod,
    },
  });

  console.log(`[E5] batch created/reused: created ${batch.id}`);
  return batch;
}

async function main() {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`E5 source file was not found: ${sourceFilePath}`);
  }

  const html = fs.readFileSync(sourceFilePath, "utf8");
  const tableRows = parseRows(html);
  const sourceRows = tableRows.map(cleanSourceRow).filter(Boolean);
  const skippedRows = tableRows.length - sourceRows.length;
  const batch = await getOrCreateBatch();

  for (const sourceRow of sourceRows) {
    const rawRecordHash = hashRecord(sourceRow);

    await prisma.importRecord.upsert({
      where: {
        importBatchId_rowNumber: {
          importBatchId: batch.id,
          rowNumber: sourceRow.rowNumber,
        },
      },
      update: {
        externalId: sourceRow.state,
        rawRecordHash,
        rawData: sourceRow,
      },
      create: {
        importBatchId: batch.id,
        rowNumber: sourceRow.rowNumber,
        externalId: sourceRow.state,
        rawRecordHash,
        rawData: sourceRow,
      },
    });
  }

  console.log(`[E5] rows read: ${tableRows.length}`);
  console.log(`[E5] rows imported: ${sourceRows.length}`);
  console.log(`[E5] rows skipped: ${skippedRows}`);
}

main()
  .catch((error) => {
    console.error("[E5] import failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
