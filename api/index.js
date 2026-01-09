require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Lazy load Prisma to avoid connection issues during import
let prismaClient;

const getPrismaClient = () => {
  if (!prismaClient) {
    const { PrismaClient } = require('@prisma/client');
    prismaClient = new PrismaClient();
  }
  return prismaClient;
};

// Import routes
const occupancyRoutes = require('../routes/occupancy');

// Health check endpoint (no database required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString()
  });
});

// Favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Middleware to inject Prisma client
app.use('/api/occupancy', (req, res, next) => {
  req.prisma = getPrismaClient();
  next();
});

// Routes
app.use('/api/occupancy', occupancyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
