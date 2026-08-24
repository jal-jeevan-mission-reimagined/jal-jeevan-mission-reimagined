require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const tamilNadu = await prisma.state.upsert({
    where: {
      code: "TN",
    },
    update: {},
    create: {
      name: "Tamil Nadu",
      code: "TN",
    },
  });

  let salem = await prisma.district.findFirst({
    where: {
      name: "Salem",
      stateId: tamilNadu.id,
    },
  });

  if (!salem) {
    salem = await prisma.district.create({
      data: {
        name: "Salem",
        stateId: tamilNadu.id,
      },
    });
  }

  let block = await prisma.block.findFirst({
    where: {
      name: "Salem Block",
      districtId: salem.id,
    },
  });

  if (!block) {
    block = await prisma.block.create({
      data: {
        name: "Salem Block",
        districtId: salem.id,
      },
    });
  }

  let demoVillage = await prisma.village.findFirst({
    where: {
      name: "Demo Village",
      blockId: block.id,
    },
  });

  if (!demoVillage) {
    demoVillage = await prisma.village.create({
      data: {
        name: "Demo Village",
        blockId: block.id,
      },
    });
  }

  // DEMONSTRATION DATA: clearly synthetic records for the Demo Village dashboard.
  let demoBorewell = await prisma.waterSource.findFirst({
    where: {
      name: "DEMO Borewell Source",
      villageId: demoVillage.id,
    },
  });

  if (!demoBorewell) {
    demoBorewell = await prisma.waterSource.create({
      data: {
        name: "DEMO Borewell Source",
        type: "GROUNDWATER",
        status: "ACTIVE",
        villageId: demoVillage.id,
      },
    });
  }

  let demoSurfaceIntake = await prisma.waterSource.findFirst({
    where: {
      name: "DEMO Surface Water Intake",
      villageId: demoVillage.id,
    },
  });

  if (!demoSurfaceIntake) {
    demoSurfaceIntake = await prisma.waterSource.create({
      data: {
        name: "DEMO Surface Water Intake",
        type: "SURFACE_WATER",
        status: "ACTIVE",
        villageId: demoVillage.id,
      },
    });
  } else {
    demoSurfaceIntake = await prisma.waterSource.update({
      where: {
        id: demoSurfaceIntake.id,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  const demoConnections = [
    { connectionNo: "DEMO-HH-001", status: "ACTIVE" },
    { connectionNo: "DEMO-HH-002", status: "ACTIVE" },
    { connectionNo: "DEMO-HH-003", status: "ACTIVE" },
    { connectionNo: "DEMO-HH-004", status: "NON_FUNCTIONAL" },
    { connectionNo: "DEMO-HH-005", status: "NON_FUNCTIONAL" },
  ];

  await Promise.all(
    demoConnections.map((connection) =>
      prisma.waterConnection.upsert({
        where: {
          connectionNo: connection.connectionNo,
        },
        update: {
          status: connection.status,
          villageId: demoVillage.id,
        },
        create: {
          ...connection,
          villageId: demoVillage.id,
        },
      })
    )
  );

  const demoQualityTests = [
    {
      waterSourceId: demoBorewell.id,
      testedAt: new Date("2026-08-20T09:00:00.000Z"),
      ph: 7.2,
      turbidity: 0.6,
      isSafe: true,
    },
    {
      waterSourceId: demoSurfaceIntake.id,
      testedAt: new Date("2026-08-18T09:00:00.000Z"),
      ph: 6.1,
      turbidity: 4.8,
      isSafe: false,
    },
  ];

  for (const qualityTest of demoQualityTests) {
    const existingQualityTest = await prisma.waterQualityTest.findFirst({
      where: {
        waterSourceId: qualityTest.waterSourceId,
        testedAt: qualityTest.testedAt,
      },
    });

    if (!existingQualityTest) {
      await prisma.waterQualityTest.create({
        data: qualityTest,
      });
    }
  }

  // DEMONSTRATION DATA: an unresolved complaint to exercise the Water Health score.
  await prisma.complaint.upsert({
    where: {
      complaintNumber: "DEMO-CMP-001",
    },
    update: {
      villageId: demoVillage.id,
      category: "LOW_PRESSURE",
      description: "DEMO: Intermittent low pressure reported near the village school.",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      resolvedAt: null,
    },
    create: {
      complaintNumber: "DEMO-CMP-001",
      villageId: demoVillage.id,
      category: "LOW_PRESSURE",
      description: "DEMO: Intermittent low pressure reported near the village school.",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
    },
  });

  console.log("DEMONSTRATION water seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
