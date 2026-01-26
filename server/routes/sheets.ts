import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all sheets for logged-in user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sheets = await prisma.sheet.findMany({
      where: { userId: req.userId! },
      include: {
        _count: {
          select: { jobs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedSheets = sheets.map(sheet => ({
      id: sheet.id,
      name: sheet.name,
      jobCount: sheet._count.jobs
    }));

    res.json(formattedSheets);
  } catch (error) {
    console.error('Get sheets error:', error);
    res.status(500).json({ message: 'Failed to fetch sheets' });
  }
});

// Create new sheet
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;

    const sheet = await prisma.sheet.create({
      data: {
        name,
        userId: req.userId!
      }
    });

    res.json({ id: sheet.id, name: sheet.name, jobCount: 0 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Sheet name already exists' });
    } else {
      console.error('Create sheet error:', error);
      res.status(500).json({ message: 'Failed to create sheet' });
    }
  }
});

// Delete sheet
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const sheet = await prisma.sheet.findUnique({
      where: { id }
    });

    if (!sheet || sheet.userId !== req.userId) {
      return res.status(404).json({ message: 'Sheet not found' });
    }

    await prisma.sheet.delete({
      where: { id }
    });

    res.json({ message: 'Sheet deleted successfully' });
  } catch (error) {
    console.error('Delete sheet error:', error);
    res.status(500).json({ message: 'Failed to delete sheet' });
  }
});

export default router;