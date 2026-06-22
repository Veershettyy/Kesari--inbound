require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const connectDB  = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5173',
    'https://kesari-inbound.netlify.app',
    'https://www.kesariinbound.com',
  ],
  credentials: true,
}));
app.use(express.json());

// Rate limiting for public API
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Stricter limit for enquiry submissions
const enquiryLimit = rateLimit({ windowMs: 60 * 1000, max: 5, message: { error: 'Too many submissions' } });
app.use('/api/enquiry', enquiryLimit);

// Routes
app.use('/api/enquiry',   require('./routes/enquiries'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/packages',  require('./routes/packages'));
app.use('/api/admin',     require('./routes/admin'));

// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`\n🚀 KESARi Inbound API running on http://localhost:${PORT}\n   Admin dashboard: http://localhost:${PORT}/admin\n`));
