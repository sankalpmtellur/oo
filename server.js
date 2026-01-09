require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Import routes
const occupancyRoutes = require('./routes/occupancy');

// Middleware
app.use(cors());
app.use(express.json());

// Pass Prisma instance to routes via middleware
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Occupancy routes
app.use('/api/occupancy', occupancyRoutes);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connected successfully');
    console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`✓ Access from other devices: http://10.7.16.209:${PORT}`);
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }
});

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
