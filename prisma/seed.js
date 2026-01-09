require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.occupancy.deleteMany({});
  await prisma.classroom.deleteMany({});
  await prisma.user.deleteMany({});

  // Create classrooms
  const classroom1 = await prisma.classroom.create({
    data: {
      name: 'Classroom 101',
      roomId: 'classroom-101',
      capacity: 10
    }
  });

  const classroom2 = await prisma.classroom.create({
    data: {
      name: 'Classroom 102',
      roomId: 'classroom-102',
      capacity: 15
    }
  });

  const classroom3 = await prisma.classroom.create({
    data: {
      name: 'Classroom 103',
      roomId: 'classroom-103',
      capacity: 20
    }
  });

  console.log('✓ Classrooms created:');
  console.log(`  - ${classroom1.name} (${classroom1.roomId})`);
  console.log(`  - ${classroom2.name} (${classroom2.roomId})`);
  console.log(`  - ${classroom3.name} (${classroom3.roomId})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✓ Database seeded successfully');
  })
  .catch(async (e) => {
    console.error('✗ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
