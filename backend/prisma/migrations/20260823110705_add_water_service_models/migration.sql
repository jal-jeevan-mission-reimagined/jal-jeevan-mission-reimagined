-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'NON_FUNCTIONAL', 'UNDER_REPAIR');

-- CreateEnum
CREATE TYPE "WaterSourceType" AS ENUM ('GROUNDWATER', 'SURFACE_WATER', 'TAP', 'OTHER');

-- CreateTable
CREATE TABLE "WaterSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WaterSourceType" NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "villageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterConnection" (
    "id" TEXT NOT NULL,
    "connectionNo" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "connectedAt" TIMESTAMP(3),
    "villageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterQualityTest" (
    "id" TEXT NOT NULL,
    "testedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ph" DOUBLE PRECISION,
    "turbidity" DOUBLE PRECISION,
    "isSafe" BOOLEAN NOT NULL,
    "waterSourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterQualityTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WaterSource_villageId_idx" ON "WaterSource"("villageId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterConnection_connectionNo_key" ON "WaterConnection"("connectionNo");

-- CreateIndex
CREATE INDEX "WaterConnection_villageId_idx" ON "WaterConnection"("villageId");

-- CreateIndex
CREATE INDEX "WaterQualityTest_waterSourceId_idx" ON "WaterQualityTest"("waterSourceId");

-- AddForeignKey
ALTER TABLE "WaterSource" ADD CONSTRAINT "WaterSource_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterConnection" ADD CONSTRAINT "WaterConnection_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterQualityTest" ADD CONSTRAINT "WaterQualityTest_waterSourceId_fkey" FOREIGN KEY ("waterSourceId") REFERENCES "WaterSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
