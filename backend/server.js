require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');
const path        = require('path');
const connectDB   = require('./config/db');

const app = express();

connectDB();

// ── Security & performance ─────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

// ── CORS ───────────────────────────────────────────────────────────────────
const ALLOWED = [
  'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
  'https://neon-gelato-82bea6.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: ALLOWED, credentials: true }));
app.use(express.json({ limit: '10kb' }));

// ── Rate limiting ──────────────────────────────────────────────────────────
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.use('/api/enquiry', rateLimit({ windowMs: 60 * 1000, max: 5, message: { error: 'Too many submissions. Please wait a minute.' } }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/enquiry',    require('./routes/enquiries'));
app.use('/api/enquiries',  require('./routes/enquiries'));
app.use('/api/packages',   require('./routes/packages'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/analytics',  require('./routes/analytics'));

// ── Admin dashboard (static) ───────────────────────────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV || 'development' })
);

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ KESARi Inbound API  →  http://localhost:${PORT}`);
  console.log(`   Admin dashboard     →  http://localhost:${PORT}/admin\n`);
});
