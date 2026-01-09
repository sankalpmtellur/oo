require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();

// Initialize Prisma with connection pooling for serverless
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const occupancyRoutes = require('../routes/occupancy');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Occupancy routes
app.use('/api/occupancy', occupancyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✓ Database connected successfully');
      console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    } catch (error) {
      console.error('✗ Database connection failed:', error);
      process.exit(1);
    }
  });

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
  });
}

// Export for Vercel serverless
module.exports = app;
