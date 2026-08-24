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

// --------------------------------------------------
// HEALTH
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Jal Jeevan Mission backend is running",
  });
});

// --------------------------------------------------
// CREATE COMPLAINT
// --------------------------------------------------

app.post("/api/complaints", async (req, res) => {
  try {
    const {
      villageId,
      category,
      description,
      latitude,
      longitude,
      priority,
    } = req.body;

    const validCategories = [
      "NO_WATER",
      "LOW_PRESSURE",
      "WATER_QUALITY",
      "PIPELINE_DAMAGE",
      "INFRASTRUCTURE",
      "OTHER",
    ];

    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    if (!villageId || !category || !description) {
      return res.status(400).json({
        status: "error",
        message: "villageId, category, and description are required",
      });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid complaint category",
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid complaint priority",
      });
    }

    const village = await prisma.village.findUnique({
      where: {
        id: villageId,
      },
      select: {
        id: true,
      },
    });

    if (!village) {
      return res.status(404).json({
        status: "error",
        message: "Village not found",
      });
    }

    const complaintNumber = `JAL-${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 10
    )}`;

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber,
        villageId,
        category,
        description,
        latitude:
          latitude !== undefined && latitude !== null
            ? Number(latitude)
            : null,
        longitude:
          longitude !== undefined && longitude !== null
            ? Number(longitude)
            : null,
        priority: priority || "MEDIUM",
        status: "SUBMITTED",
      },
    });

    return res.status(201).json(complaint);
  } catch (error) {
    console.error("Failed to create complaint:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create complaint",
    });
  }
});

// --------------------------------------------------
// UPDATE COMPLAINT STATUS
// --------------------------------------------------

app.patch("/api/complaints/:complaintNumber/status", async (req, res) => {
  try {
    const { complaintNumber } = req.params;
    const { status } = req.body || {};
    const validStatuses = [
      "ASSIGNED",
      "INVESTIGATION",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid complaint status",
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: {
        complaintNumber,
      },
    });

    if (!complaint) {
      return res.status(404).json({
        status: "error",
        message: "Complaint not found",
      });
    }

    const updateData = {
      status,
    };

    if (status === "RESOLVED" || status === "CLOSED") {
      updateData.resolvedAt = new Date();
    }

    const updatedComplaint = await prisma.complaint.update({
      where: {
        complaintNumber,
      },
      data: updateData,
    });

    return res.json(updatedComplaint);
  } catch (error) {
    console.error("Failed to update complaint status:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to update complaint status",
    });
  }
});

// --------------------------------------------------
// COMPLAINT DETAIL
// --------------------------------------------------

app.get("/api/complaints/:complaintNumber", async (req, res) => {
  try {
    const { complaintNumber } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: {
        complaintNumber,
      },
      include: {
        village: {
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
        },
      },
    });

    if (!complaint) {
      return res.status(404).json({
        status: "error",
        message: "Complaint not found",
      });
    }

    return res.json(complaint);
  } catch (error) {
    console.error("Failed to fetch complaint:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch complaint",
    });
  }
});

// --------------------------------------------------
// STATES
// --------------------------------------------------

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

// --------------------------------------------------
// DISTRICTS
// --------------------------------------------------

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

// --------------------------------------------------
// BLOCKS BY DISTRICT
// --------------------------------------------------

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

// --------------------------------------------------
// VILLAGES BY BLOCK
// --------------------------------------------------

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

// --------------------------------------------------
// VILLAGE WATER HEALTH
// --------------------------------------------------

app.get("/api/villages/:villageId/water-health", async (req, res) => {
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

    const [connectionStatuses, sourceStatuses, latestQualityTests, complaintStatuses] =
      await Promise.all([
        prisma.waterConnection.groupBy({
          by: ["status"],
          where: {
            villageId,
          },
          _count: {
            _all: true,
          },
        }),
        prisma.waterSource.groupBy({
          by: ["status"],
          where: {
            villageId,
          },
          _count: {
            _all: true,
          },
        }),
        prisma.waterQualityTest.findMany({
          where: {
            waterSource: {
              villageId,
            },
          },
          select: {
            waterSourceId: true,
            isSafe: true,
          },
          distinct: ["waterSourceId"],
          orderBy: {
            testedAt: "desc",
          },
        }),
        prisma.complaint.groupBy({
          by: ["status"],
          where: {
            villageId,
          },
          _count: {
            _all: true,
          },
        }),
      ]);

    const getStatusCount = (groups, status) => {
      const group = groups.find((item) => item.status === status);

      return group ? group._count._all : 0;
    };
    const roundScore = (score) => Math.round(score * 100) / 100;
    const totalConnections = connectionStatuses.reduce(
      (total, group) => total + group._count._all,
      0
    );
    const activeConnections = getStatusCount(connectionStatuses, "ACTIVE");
    const nonFunctionalConnections = getStatusCount(
      connectionStatuses,
      "NON_FUNCTIONAL"
    );
    const totalSources = sourceStatuses.reduce(
      (total, group) => total + group._count._all,
      0
    );
    const activeSources = getStatusCount(sourceStatuses, "ACTIVE");
    const safeQualityTests = latestQualityTests.filter(
      (test) => test.isSafe
    ).length;
    const submittedComplaints = getStatusCount(complaintStatuses, "SUBMITTED");
    const assignedComplaints = getStatusCount(complaintStatuses, "ASSIGNED");
    const investigationComplaints = getStatusCount(
      complaintStatuses,
      "INVESTIGATION"
    );
    const inProgressComplaints = getStatusCount(
      complaintStatuses,
      "IN_PROGRESS"
    );

    const coverageScore =
      totalConnections > 0 ? (activeConnections / totalConnections) * 100 : 0;
    const functionalityDenominator = activeConnections + nonFunctionalConnections;
    const functionalityScore =
      functionalityDenominator > 0
        ? (activeConnections / functionalityDenominator) * 100
        : 0;
    const qualityScore =
      latestQualityTests.length > 0
        ? (safeQualityTests / latestQualityTests.length) * 100
        : null;
    const reliabilityScore =
      totalSources > 0 ? (activeSources / totalSources) * 100 : null;
    const complaintPenalty =
      submittedComplaints * 5 +
      assignedComplaints * 5 +
      investigationComplaints * 10 +
      inProgressComplaints * 10;
    const complaintScore = Math.max(0, 100 - complaintPenalty);
    const weightedComponents = [
      { name: "coverage", score: coverageScore, weight: 0.3 },
      { name: "functionality", score: functionalityScore, weight: 0.25 },
      { name: "quality", score: qualityScore, weight: 0.25 },
      { name: "reliability", score: reliabilityScore, weight: 0.1 },
      { name: "complaints", score: complaintScore, weight: 0.1 },
    ].filter((component) => component.score !== null);
    const totalWeight = weightedComponents.reduce(
      (total, component) => total + component.weight,
      0
    );
    const overallScore = roundScore(
      weightedComponents.reduce(
        (total, component) => total + component.score * component.weight,
        0
      ) / totalWeight
    );
    const healthStatus =
      overallScore >= 80
        ? "GOOD"
        : overallScore >= 60
          ? "ATTENTION"
          : "HIGH_RISK";
    const reasons = [];

    if (totalConnections === 0) {
      reasons.push(
        "No household water connections are recorded, so coverage and functionality scores are 0."
      );
    } else {
      reasons.push(
        `${activeConnections} of ${totalConnections} household water connections are active.`
      );
    }

    if (qualityScore === null) {
      reasons.push(
        "No water-quality tests are available, so quality is excluded from the overall score."
      );
    } else {
      reasons.push(
        `${safeQualityTests} of ${latestQualityTests.length} latest water-quality tests are safe.`
      );
    }

    if (reliabilityScore === null) {
      reasons.push(
        "No water sources are recorded, so reliability is excluded from the overall score."
      );
    } else {
      reasons.push(
        `${activeSources} of ${totalSources} water sources are active for reliability.`
      );
    }

    if (complaintPenalty > 0) {
      reasons.push(
        `Unresolved complaints reduced the complaint score by ${complaintPenalty} points.`
      );
    } else {
      reasons.push("There are no unresolved complaints affecting the score.");
    }

    return res.json({
      village,
      overallScore,
      status: healthStatus,
      components: {
        coverage: {
          score: roundScore(coverageScore),
          weight: 30,
          activeConnections,
          totalConnections,
        },
        functionality: {
          score: roundScore(functionalityScore),
          weight: 25,
          activeConnections,
          nonFunctionalConnections,
        },
        quality: {
          score: qualityScore === null ? null : roundScore(qualityScore),
          weight: 25,
          includedInOverall: qualityScore !== null,
          safeLatestTests: safeQualityTests,
          totalLatestTests: latestQualityTests.length,
        },
        reliability: {
          score: reliabilityScore === null ? null : roundScore(reliabilityScore),
          weight: 10,
          includedInOverall: reliabilityScore !== null,
          activeSources,
          totalSources,
        },
        complaints: {
          score: complaintScore,
          weight: 10,
          penalty: complaintPenalty,
          unresolved: {
            submitted: submittedComplaints,
            assigned: assignedComplaints,
            investigation: investigationComplaints,
            inProgress: inProgressComplaints,
          },
        },
      },
      reasons,
    });
  } catch (error) {
    console.error("Failed to fetch village water health:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch village water health",
    });
  }
});

// --------------------------------------------------
// VILLAGE DETAIL
// --------------------------------------------------

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

// --------------------------------------------------
// VILLAGE WATER QUALITY
// --------------------------------------------------

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

    const latestWaterQualityTests =
      await prisma.waterQualityTest.findMany({
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
    console.error(
      "Failed to fetch village water quality:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to fetch village water quality",
    });
  }
});

// --------------------------------------------------
// VILLAGE WATER OVERVIEW
// --------------------------------------------------

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
      totalHouseholdWaterConnections,
      activeHouseholdWaterConnections,
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
      totalHouseholdWaterConnections,
      activeHouseholdWaterConnections,
      nonFunctionalConnections,
      latestWaterQualityTest,
    });
  } catch (error) {
    console.error(
      "Failed to fetch village water overview:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to fetch village water overview",
    });
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
