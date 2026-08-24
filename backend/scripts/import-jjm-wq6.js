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
  "Format WQ6. Contaminant wise details of villages where in water samples were found contaminated(PWS Sources test from Lab).xls";
const sourceFilePath = path.resolve(
  __dirname,
  "..",
  "data",
  "jjm",
  "raw",
  sourceFileName
);
// The report was printed on 24/08/2026; its selected state is Tamil Nadu.
const sourceReportDate = new Date("2026-08-24T00:00:00.000Z");
const sourcePeriod = "2026-2027";
const reportStateName = "Tamil Nadu";

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
    throw new Error("WQ6 report table was not found");
  }

  const tbodyMatch = tableMatch[1].match(
    /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i
  );
  const tableBody = tbodyMatch ? tbodyMatch[1] : tableMatch[1];

  return [...tableBody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(
    (rowMatch) =>
      [...rowMatch[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(
        (cellMatch) => cleanCell(cellMatch[1])
      )
  );
}

function parseNumber(value) {
  const normalized = value.replace(/,/g, "").trim();

  if (!normalized || !/^\d+$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
}

function cleanDistrictRow(cells) {
  if (cells.length < 18 || !/^\d+$/.test(cells[0]) || !cells[1]) {
    return null;
  }

  const values = cells.slice(2, 18).map(parseNumber);

  if (values.some((value) => value === null)) {
    return null;
  }

  return {
    rowNumber: Number(cells[0]),
    districtName: cells[1],
    ph: values[0],
    tds: values[1],
    turbidity: values[2],
    chloride: values[3],
    totalAlkalinity: values[4],
    totalHardness: values[5],
    sulphate: values[6],
    iron: values[7],
    totalArsenic: values[8],
    fluoride: values[9],
    nitrate: values[10],
    residualChlorine: values[11],
    chemicalOthers: values[12],
    eColi: values[13],
    totalColiform: values[14],
    bacteriologicalOthers: values[15],
    reportContext: {
      stateName: reportStateName,
      sourcePeriod,
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
      sourceDataset: "WQ6",
      sourceFileName,
      sourceReportDate,
      sourcePeriod,
    },
  });

  if (existingBatch) {
    console.log(`[WQ6] batch created/reused: reused ${existingBatch.id}`);
    return existingBatch;
  }

  const batch = await prisma.importBatch.create({
    data: {
      sourceSystem: "JJM",
      sourceDataset: "WQ6",
      sourceFileName,
      sourceUrl: null,
      sourceReportDate,
      sourcePeriod,
    },
  });

  console.log(`[WQ6] batch created/reused: created ${batch.id}`);
  return batch;
}

async function main() {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`WQ6 source file was not found: ${sourceFilePath}`);
  }

  const html = fs.readFileSync(sourceFilePath, "utf8");
  const tableRows = parseRows(html);
  const districtRows = tableRows.map(cleanDistrictRow).filter(Boolean);
  const skippedRows = tableRows.length - districtRows.length;
  const batch = await getOrCreateBatch();

  for (const districtRow of districtRows) {
    const rawRecordHash = hashRecord(districtRow);

    await prisma.importRecord.upsert({
      where: {
        importBatchId_rowNumber: {
          importBatchId: batch.id,
          rowNumber: districtRow.rowNumber,
        },
      },
      update: {
        externalId: districtRow.districtName,
        rawRecordHash,
        rawData: districtRow,
      },
      create: {
        importBatchId: batch.id,
        rowNumber: districtRow.rowNumber,
        externalId: districtRow.districtName,
        rawRecordHash,
        rawData: districtRow,
      },
    });
  }

  console.log(`[WQ6] rows read: ${tableRows.length}`);
  console.log(`[WQ6] rows imported: ${districtRows.length}`);
  console.log(`[WQ6] rows skipped: ${skippedRows}`);
}

main()
  .catch((error) => {
    console.error("[WQ6] import failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
