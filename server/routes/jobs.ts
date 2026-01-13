import express from 'express';

const router = express.Router();

// Mock get jobs for a sheet
router.get('/sheet/:sheetId', (req, res) => {
  const { sheetId } = req.params;
  res.json([
    {
      id: '1',
      company: 'Google',
      position: 'SWE Intern',
      status: 'Applied',
      appliedDate: new Date().toISOString(),
    },
    {
      id: '2',
      company: 'Meta',
      position: 'Frontend Engineer',
      status: 'Interview',
      appliedDate: new Date().toISOString(),
    },
  ]);
});

// Mock create job
router.post('/', (req, res) => {
  const { sheetId, company, position, status, notes } = req.body;
  res.status(201).json({
    id: Date.now().toString(),
    company,
    position,
    status: status || 'Applied',
    appliedDate: new Date().toISOString(),
    notes,
  });
});

// Mock delete job
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Job ${id} deleted` });
});

export default router;