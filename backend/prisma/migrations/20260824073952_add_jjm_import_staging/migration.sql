-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "sourceSystem" TEXT NOT NULL,
    "sourceDataset" TEXT NOT NULL,
    "sourceFileName" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceReportDate" TIMESTAMP(3),
    "sourcePeriod" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRecord" (
    "id" TEXT NOT NULL,
    "importBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "externalId" TEXT,
    "rawRecordHash" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,

    CONSTRAINT "ImportRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportBatch_sourceDataset_sourceReportDate_idx" ON "ImportBatch"("sourceDataset", "sourceReportDate");

-- CreateIndex
CREATE UNIQUE INDEX "ImportBatch_sourceSystem_sourceDataset_sourceFileName_sourc_key" ON "ImportBatch"("sourceSystem", "sourceDataset", "sourceFileName", "sourceReportDate", "sourcePeriod");

-- CreateIndex
CREATE INDEX "ImportRecord_externalId_idx" ON "ImportRecord"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ImportRecord_importBatchId_rowNumber_key" ON "ImportRecord"("importBatchId", "rowNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ImportRecord_importBatchId_rawRecordHash_key" ON "ImportRecord"("importBatchId", "rawRecordHash");

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
