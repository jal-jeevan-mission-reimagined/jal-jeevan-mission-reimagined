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

const sourceFileName =
  "Format WQ1. PWS Infra and Delivery Point (Water Supply Scheme Source).xls";
const sourceFilePath = path.resolve(
  __dirname,
  "..",
  "data",
  "jjm",
  "raw",
  sourceFileName
);
// The report has no printed date; use its raw-file inventory date.
const sourceReportDate = new Date("2026-08-24T00:00:00.000Z");
const sourcePeriod = "2026-2027";

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
    /<table\b[^>]*id=["']example["'][^>]*>([\s\S]*?)<\/table>/i
  );

  if (!tableMatch) {
    throw new Error("WQ1 report table was not found");
  }

  const tbodyMatch = tableMatch[1].match(
    /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i
  );

  if (!tbodyMatch) {
    throw new Error("WQ1 report table body was not found");
  }

  return [...tbodyMatch[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(
    (rowMatch) =>
      [...rowMatch[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(
        (cellMatch) => cleanCell(cellMatch[1])
      )
  );
}

function parseNumber(value) {
  const normalized = value.replace(/,/g, "").trim();

  if (!normalized || !/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) {
    return null;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function cleanStateRow(cells) {
  if (cells.length < 25 || !/^\d+$/.test(cells[0]) || !cells[1]) {
    return null;
  }

  const values = cells.slice(2, 25).map(parseNumber);

  if (values.some((value) => value === null)) {
    return null;
  }

  return {
    rowNumber: Number(cells[0]),
    stateName: cells[1],
    numberOfSchemes: values[0],
    numberOfSources: values[1],
    groundWaterSourceCount: values[2],
    groundWaterAnnualPlan: values[3],
    groundWaterH1Achieved: values[4],
    groundWaterH1Percentage: values[5],
    groundWaterTotalAchieved: values[6],
    groundWaterTotalPercentage: values[7],
    groundWaterPreMonsoon: values[8],
    groundWaterPostMonsoon: values[9],
    surfaceWaterSourceCount: values[10],
    surfaceWaterAnnualPlan: values[11],
    surfaceWaterQ1Achieved: values[12],
    surfaceWaterQ1Percentage: values[13],
    surfaceWaterQ2Achieved: values[14],
    surfaceWaterQ2Percentage: values[15],
    surfaceWaterTotalAchieved: values[16],
    surfaceWaterTotalPercentage: values[17],
    surfaceWaterPreMonsoon: values[18],
    surfaceWaterPostMonsoon: values[19],
    overallTotalPlan: values[20],
    overallTotalAchieved: values[21],
    overallTotalPercentage: values[22],
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
      sourceDataset: "WQ1",
      sourceFileName,
      sourceReportDate,
      sourcePeriod,
    },
  });

  if (existingBatch) {
    console.log(`[WQ1] batch created/reused: reused ${existingBatch.id}`);
    return existingBatch;
  }

  const batch = await prisma.importBatch.create({
    data: {
      sourceSystem: "JJM",
      sourceDataset: "WQ1",
      sourceFileName,
      sourceUrl: null,
      sourceReportDate,
      sourcePeriod,
    },
  });

  console.log(`[WQ1] batch created/reused: created ${batch.id}`);
  return batch;
}

async function main() {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`WQ1 source file was not found: ${sourceFilePath}`);
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
        externalId: stateRow.stateName,
        rawRecordHash,
        rawData: stateRow,
      },
      create: {
        importBatchId: batch.id,
        rowNumber: stateRow.rowNumber,
        externalId: stateRow.stateName,
        rawRecordHash,
        rawData: stateRow,
      },
    });
  }

  console.log(`[WQ1] rows read: ${tableRows.length}`);
  console.log(`[WQ1] rows imported: ${stateRows.length}`);
  console.log(`[WQ1] rows skipped: ${skippedRows}`);
}

main()
  .catch((error) => {
    console.error("[WQ1] import failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
