import express from 'express';

const router = express.Router();

// Mock signup (no database)
router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Signup attempt:', { email });
  
  res.status(201).json({
    message: 'User created successfully',
    user: { email },
  });
});

// Mock login (no database)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email });
  
  res.json({
    message: 'Login successful',
    user: { email },
  });
});

export default router;