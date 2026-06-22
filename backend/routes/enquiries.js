const express  = require('express');
const router   = express.Router();
const Enquiry  = require('../models/Enquiry');
const { sendEnquiryNotification } = require('../services/email');
const auth     = require('../middleware/auth');

// POST /api/enquiry — submit enquiry from website
router.post('/', async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    // Send email notification (non-blocking)
    sendEnquiryNotification(enquiry).catch(err =>
      console.error('Email failed:', err.message)
    );

    res.status(201).json({ success: true, id: enquiry._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/enquiries — admin: list all enquiries
router.get('/', auth, async (req, res) => {
  try {
    const { status, language, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (language) filter.language = language;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(+limit),
      Enquiry.countDocuments(filter),
    ]);

    res.json({ enquiries, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/enquiries/:id — admin: update status or notes
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/enquiries/stats — admin: dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [byStatus, byLanguage, recent] = await Promise.all([
      Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Enquiry.aggregate([{ $group: { _id: '$language', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ byStatus, byLanguage, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
