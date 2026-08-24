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

const sourceFileName = "Format L4. FTK testing data.xls";
const sourceFilePath = path.resolve(
  __dirname,
  "..",
  "data",
  "jjm",
  "raw",
  sourceFileName
);
const sourceReportDate = new Date("2026-08-24T00:00:00.000Z");
const sourcePeriod = "2025-2026";

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
    /<table\b[^>]*class=["']table["'][^>]*>([\s\S]*?)<\/table>/i
  );

  if (!tableMatch) {
    throw new Error("L4 report table was not found");
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

function cleanStateRow(cells) {
  if (cells.length < 9 || !/^\d+$/.test(cells[0]) || !cells[1]) {
    return null;
  }

  const values = cells.slice(2, 9).map(parseInteger);

  if (values.some((value) => value === null)) {
    return null;
  }

  return {
    rowNumber: Number(cells[0]),
    state: cells[1],
    totalVillages: values[0],
    ftkVillages: values[1],
    ftkSamplesTested: values[2],
    ftkChemicalContamination: values[3],
    labSamplesRetested: values[4],
    labSamplesSafe: values[5],
    labSamplesContaminated: values[6],
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
      sourceDataset: "L4",
      sourceFileName,
      sourceReportDate,
      sourcePeriod,
    },
  });

  if (existingBatch) {
    console.log(`[L4] batch created/reused: reused ${existingBatch.id}`);
    return existingBatch;
  }

  const batch = await prisma.importBatch.create({
    data: {
      sourceSystem: "JJM",
      sourceDataset: "L4",
      sourceFileName,
      sourceUrl: null,
      sourceReportDate,
      sourcePeriod,
    },
  });

  console.log(`[L4] batch created/reused: created ${batch.id}`);
  return batch;
}

async function main() {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`L4 source file was not found: ${sourceFilePath}`);
  }

  const html = fs.readFileSync(sourceFilePath, "utf8");
  const tableRows = parseRows(html);
  const stateRows = tableRows.map(cleanStateRow).filter(Boolean);
  const skippedRows = tableRows.length - stateRows.length;
  const batch = await getOrCreateBatch();

  for (const stateRow of stateRows) {
    const rawRecordHash = hashRecord(stateRow);

    await prisma.importRecord.upsert({
      where: {
        importBatchId_rowNumber: {
          importBatchId: batch.id,
          rowNumber: stateRow.rowNumber,
        },
      },
      update: {
        externalId: stateRow.state,
        rawRecordHash,
        rawData: stateRow,
      },
      create: {
        importBatchId: batch.id,
        rowNumber: stateRow.rowNumber,
        externalId: stateRow.state,
        rawRecordHash,
        rawData: stateRow,
      },
    });
  }

  console.log(`[L4] rows read: ${tableRows.length}`);
  console.log(`[L4] rows imported: ${stateRows.length}`);
  console.log(`[L4] rows skipped: ${skippedRows}`);
}

main()
  .catch((error) => {
    console.error("[L4] import failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
