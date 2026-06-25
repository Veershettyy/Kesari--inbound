const express  = require('express');
const router   = express.Router();
const Enquiry  = require('../models/Enquiry');
const { sendEnquiryNotification, sendAutoReply } = require('../services/email');
const auth     = require('../middleware/auth');
const { validate, enquiryRules } = require('../middleware/validate');

// POST /api/enquiry — public: submit enquiry from website
router.post('/', validate(enquiryRules), async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    // Fire-and-forget emails
    sendEnquiryNotification(enquiry).catch(e => console.error('Notification email failed:', e.message));
    sendAutoReply(enquiry).catch(e => console.error('Auto-reply email failed:', e.message));

    res.status(201).json({ success: true, id: enquiry._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/enquiries — admin: list with filters, search, pagination
router.get('/', auth, async (req, res) => {
  try {
    const { status, language, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const filter = {};

    if (status)   filter.status   = status;
    if (language) filter.language = language;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ fullName: re }, { email: re }, { phone: re }, { packageName: re }];
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort(sort).skip((page - 1) * limit).limit(+limit),
      Enquiry.countDocuments(filter),
    ]);

    res.json({ enquiries, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/enquiries/stats — admin: dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [byStatus, byLanguage, byPackage, daily, total, thisMonth] = await Promise.all([
      Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Enquiry.aggregate([{ $group: { _id: '$language', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Enquiry.aggregate([
        { $match: { packageCode: { $ne: '' } } },
        { $group: { _id: '$packageCode', name: { $first: '$packageName' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 5 },
      ]),
      Enquiry.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    const converted = (byStatus.find(s => s._id === 'converted') || {}).count || 0;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

    res.json({ byStatus, byLanguage, byPackage, daily, total, thisMonth, conversionRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/enquiries/export — admin: download CSV
router.get('/export', auth, async (req, res) => {
  try {
    const { status, language } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (language) filter.language = language;

    const enquiries = await Enquiry.find(filter).sort('-createdAt').limit(5000);

    const headers = ['Date', 'Name', 'Email', 'Phone', 'Nationality', 'Package', 'Travel Date', 'Travellers', 'Language', 'Status', 'Message'];
    const rows = enquiries.map(e => [
      new Date(e.createdAt).toLocaleDateString('en-IN'),
      e.fullName, e.email, e.phone, e.nationality,
      e.packageName || e.packageCode, e.travelDate,
      e.travellers, e.language, e.status,
      (e.message || '').replace(/,/g, ';').replace(/\n/g, ' '),
    ]);

    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="enquiries-${Date.now()}.csv"`);
    res.send(csv);
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

// PATCH /api/enquiries/bulk — admin: bulk status update
router.patch('/bulk/status', auth, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids?.length || !status) return res.status(400).json({ error: 'ids and status required' });
    const result = await Enquiry.updateMany({ _id: { $in: ids } }, { status });
    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/enquiries/:id — admin: delete enquiry
router.delete('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
