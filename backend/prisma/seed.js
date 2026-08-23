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

  const salem = await prisma.district.create({
    data: {
      name: "Salem",
      stateId: tamilNadu.id,
    },
  });

  const block = await prisma.block.create({
    data: {
      name: "Salem Block",
      districtId: salem.id,
    },
  });

  await prisma.village.create({
    data: {
      name: "Demo Village",
      blockId: block.id,
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });