const express  = require('express');
const router   = express.Router();
const Enquiry  = require('../models/Enquiry');
const auth     = require('../middleware/auth');

// GET /api/analytics/overview — full dashboard summary
router.get('/overview', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

    const [
      totalEnquiries, periodEnquiries, prevPeriodEnquiries,
      byStatus, byLanguage, byPackage,
      dailyTrend, hourlyDist,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ createdAt: { $gte: since } }),
      Enquiry.countDocuments({ createdAt: { $gte: prevSince, $lt: since } }),

      Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

      Enquiry.aggregate([
        { $group: { _id: '$language', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Enquiry.aggregate([
        { $match: { packageCode: { $ne: '' }, createdAt: { $gte: since } } },
        { $group: { _id: '$packageCode', name: { $first: '$packageName' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 8 },
      ]),

      Enquiry.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Enquiry.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const converted    = (byStatus.find(s => s._id === 'converted') || {}).count || 0;
    const periodGrowth = prevPeriodEnquiries > 0
      ? (((periodEnquiries - prevPeriodEnquiries) / prevPeriodEnquiries) * 100).toFixed(1)
      : null;

    res.json({
      totals: {
        all: totalEnquiries,
        period: periodEnquiries,
        growth: periodGrowth,
        conversionRate: totalEnquiries > 0 ? ((converted / totalEnquiries) * 100).toFixed(1) : 0,
      },
      byStatus, byLanguage, byPackage, dailyTrend, hourlyDist,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
