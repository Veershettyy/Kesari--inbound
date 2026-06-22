const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const auth    = require('../middleware/auth');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, name: admin.name, role: admin.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/setup — create first admin (only works if no admin exists)
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'Admin already exists' });
    const admin = await Admin.create({ ...req.body, role: 'superadmin' });
    res.status(201).json({ success: true, email: admin.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/admin/me — verify token
router.get('/me', auth, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  res.json(admin);
});

module.exports = router;
