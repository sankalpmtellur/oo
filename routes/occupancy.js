const express = require('express');
const router = express.Router();

// POST - Update occupancy data from ESP8266
router.post('/update', async (req, res) => {
  try {
    const prisma = req.prisma;
    const { roomId, peopleCount } = req.body;

    // Validate input
    if (!roomId || peopleCount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: roomId, peopleCount'
      });
    }

    if (peopleCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'peopleCount cannot be negative'
      });
    }

    // Find classroom by roomId
    const classroom = await prisma.classroom.findUnique({
      where: { roomId }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: `Classroom with roomId '${roomId}' not found`
      });
    }

    // Create occupancy record
    const occupancy = await prisma.occupancy.create({
      data: {
        classroomId: classroom.id,
        peopleCount: peopleCount
      }
    });

    res.json({
      success: true,
      message: 'Occupancy data saved successfully',
      data: occupancy
    });
  } catch (error) {
    console.error('Error updating occupancy:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET - Get current occupancy for a classroom
router.get('/classroom/:roomId', async (req, res) => {
  try {
    const prisma = req.prisma;
    const { roomId } = req.params;

    const classroom = await prisma.classroom.findUnique({
      where: { roomId },
      include: {
        occupancy: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: `Classroom with roomId '${roomId}' not found`
      });
    }

    const currentOccupancy = classroom.occupancy[0] || null;

    res.json({
      success: true,
      data: {
        classroom: {
          id: classroom.id,
          name: classroom.name,
          roomId: classroom.roomId,
          capacity: classroom.capacity
        },
        currentOccupancy: currentOccupancy
      }
    });
  } catch (error) {
    console.error('Error fetching occupancy:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET - Get occupancy history for a classroom
router.get('/classroom/:roomId/history', async (req, res) => {
  try {
    const prisma = req.prisma;
    const { roomId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const classroom = await prisma.classroom.findUnique({
      where: { roomId }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: `Classroom with roomId '${roomId}' not found`
      });
    }

    const occupancyHistory = await prisma.occupancy.findMany({
      where: { classroomId: classroom.id },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        classroom: {
          id: classroom.id,
          name: classroom.name,
          roomId: classroom.roomId,
          capacity: classroom.capacity
        },
        history: occupancyHistory
      }
    });
  } catch (error) {
    console.error('Error fetching occupancy history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET - Get all classrooms with current occupancy
router.get('/all', async (req, res) => {
  try {
    const prisma = req.prisma;
    const classrooms = await prisma.classroom.findMany({
      include: {
        occupancy: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    const data = classrooms.map(classroom => ({
      id: classroom.id,
      name: classroom.name,
      roomId: classroom.roomId,
      capacity: classroom.capacity,
      currentOccupancy: classroom.occupancy[0] || null
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching all classrooms:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
