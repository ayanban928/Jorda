import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all jobs for a sheet
router.get('/:sheetId', authenticateToken, async (req, res) => {
  try {
    const { sheetId } = req.params;
    
    const jobs = await prisma.job.findMany({
      where: { sheetId },
      orderBy: { dateApplied: 'desc' }
    });
    
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create a new job
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { company, position, status, dateApplied, notes, sheetId } = req.body;
    
    // Validate required fields
    if (!company || !position || !sheetId) {
      return res.status(400).json({ error: 'Company, position, and sheetId are required' });
    }
    
    const job = await prisma.job.create({
      data: {
        company,
        position,
        status: status || 'Applied',
        dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
        notes: notes || null,
        sheetId
      }
    });
    
    res.json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Delete a job
router.delete('/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    await prisma.job.delete({
      where: { id: jobId }
    });
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;