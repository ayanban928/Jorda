import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all jobs for a specific sheet
router.get('/sheet/:sheetId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { sheetId } = req.params;

    // Verify sheet ownership
    const sheet = await prisma.sheet.findUnique({
      where: { id: sheetId }
    });

    if (!sheet || sheet.userId !== req.userId) {
      return res.status(404).json({ message: 'Sheet not found' });
    }

    const jobs = await prisma.job.findMany({
      where: { sheetId },
      orderBy: { appliedDate: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Create new job
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { company, position, status, appliedDate, notes, sheetId } = req.body;

    // Verify sheet ownership
    const sheet = await prisma.sheet.findUnique({
      where: { id: sheetId }
    });

    if (!sheet || sheet.userId !== req.userId) {
      return res.status(404).json({ message: 'Sheet not found' });
    }

    const job = await prisma.job.create({
      data: {
        company,
        position,
        status: status || 'Applied',
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        notes,
        sheetId
      }
    });

    res.json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

// Delete job
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership through sheet
    const job = await prisma.job.findUnique({
      where: { id },
      include: { sheet: true }
    });

    if (!job || job.sheet.userId !== req.userId) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await prisma.job.delete({
      where: { id }
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

export default router;