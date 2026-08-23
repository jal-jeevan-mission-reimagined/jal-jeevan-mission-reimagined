const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Jal Jeevan Mission backend is running",
  });
});

app.get("/api/districts", async (req, res) => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        blocks: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(districts);
  } catch (error) {
    console.error("Failed to fetch districts:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch districts",
    });
  }
});

app.get("/api/states", async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      include: {
        districts: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(states);
  } catch (error) {
    console.error("Failed to fetch states:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch states",
    });
  }
});

app.get("/api/districts/:districtId/blocks", async (req, res) => {
  try {
    const { districtId } = req.params;

    const blocks = await prisma.block.findMany({
      where: {
        districtId,
      },
      include: {
        villages: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(blocks);
  } catch (error) {
    console.error("Failed to fetch blocks:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch blocks",
    });
  }
});

app.get("/api/blocks/:blockId/villages", async (req, res) => {
  try {
    const { blockId } = req.params;

    const villages = await prisma.village.findMany({
      where: {
        blockId,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(villages);
  } catch (error) {
    console.error("Failed to fetch villages:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch villages",
    });
  }
});

app.get("/api/villages/:villageId/water-quality", async (req, res) => {
  try {
    const { villageId } = req.params;

    const village = await prisma.village.findUnique({
      where: {
        id: villageId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!village) {
      return res.status(404).json({
        status: "error",
        message: "Village not found",
      });
    }

    const latestWaterQualityTests = await prisma.waterQualityTest.findMany({
      where: {
        waterSource: {
          villageId,
        },
      },
      select: {
        testedAt: true,
        ph: true,
        turbidity: true,
        isSafe: true,
        waterSource: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      distinct: ["waterSourceId"],
      orderBy: {
        testedAt: "desc",
      },
    });

    res.json({
      village,
      waterQualityTests: latestWaterQualityTests,
    });
  } catch (error) {
    console.error("Failed to fetch village water quality:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch village water quality",
    });
  }
});

app.get("/api/villages/:villageId/water-overview", async (req, res) => {
  try {
    const { villageId } = req.params;

    const village = await prisma.village.findUnique({
      where: {
        id: villageId,
      },
      include: {
        block: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
      },
    });

    if (!village) {
      return res.status(404).json({
        status: "error",
        message: "Village not found",
      });
    }

    const [
      totalWaterSources,
      activeWaterSources,
      totalWaterConnections,
      activeWaterConnections,
      nonFunctionalConnections,
      latestWaterQualityTest,
    ] = await Promise.all([
      prisma.waterSource.count({
        where: {
          villageId,
        },
      }),
      prisma.waterSource.count({
        where: {
          villageId,
          status: "ACTIVE",
        },
      }),
      prisma.waterConnection.count({
        where: {
          villageId,
        },
      }),
      prisma.waterConnection.count({
        where: {
          villageId,
          status: "ACTIVE",
        },
      }),
      prisma.waterConnection.count({
        where: {
          villageId,
          status: "NON_FUNCTIONAL",
        },
      }),
      prisma.waterQualityTest.findFirst({
        where: {
          waterSource: {
            villageId,
          },
        },
        include: {
          waterSource: true,
        },
        orderBy: {
          testedAt: "desc",
        },
      }),
    ]);

    res.json({
      village,
      totalWaterSources,
      activeWaterSources,
      totalHouseholdWaterConnections: totalWaterConnections,
      activeHouseholdWaterConnections: activeWaterConnections,
      nonFunctionalConnections,
      latestWaterQualityTest,
    });
  } catch (error) {
    console.error("Failed to fetch village water overview:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch village water overview",
    });
  }
});

app.get("/api/villages/:villageId", async (req, res) => {
  try {
    const { villageId } = req.params;

    const village = await prisma.village.findUnique({
      where: {
        id: villageId,
      },
      include: {
        block: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
        waterSources: true,
        waterConnections: true,
      },
    });

    if (!village) {
      return res.status(404).json({
        status: "error",
        message: "Village not found",
      });
    }

    res.json(village);
  } catch (error) {
    console.error("Failed to fetch village:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch village",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
