import express from 'express';

const router = express.Router();

// Mock get all sheets
router.get('/', (req, res) => {
  res.json([
    { id: '1', name: 'Summer 2025', jobCount: 5 },
    { id: '2', name: 'Fall 2025', jobCount: 3 },
  ]);
});

// Mock create sheet
router.post('/', (req, res) => {
  const { name } = req.body;
  res.status(201).json({
    id: Date.now().toString(),
    name,
    jobCount: 0,
  });
});

// Mock delete sheet
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Sheet ${id} deleted` });
});

export default router;