const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

function istTime(date = new Date()) {
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
}

function row(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:8px 12px;color:#666;font-size:13px;border-bottom:1px solid #f0f0f0;white-space:nowrap">${label}</td><td style="padding:8px 12px;font-size:13px;font-weight:600;border-bottom:1px solid #f0f0f0">${value}</td></tr>`;
}

// ── Email to KESARi team ────────────────────────────────────────────────────
async function sendEnquiryNotification(enquiry) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_TO) return;

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
    <div style="background:linear-gradient(135deg,#1a2d5a,#c0392b);padding:24px;border-radius:10px 10px 0 0;text-align:center">
      <h2 style="color:#fff;margin:0;font-size:22px">New Enquiry Received</h2>
      <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:13px">${istTime(enquiry.createdAt)}</p>
    </div>
    <div style="background:#fff;border-radius:0 0 10px 10px;overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        ${row('Name',        enquiry.fullName)}
        ${row('Email',       enquiry.email)}
        ${row('Phone',       enquiry.phone)}
        ${row('Nationality', enquiry.nationality)}
        ${row('Package',     enquiry.packageName || enquiry.packageCode)}
        ${row('Travel Date', enquiry.travelDate)}
        ${row('Travellers',  enquiry.travellers)}
        ${row('Duration',    enquiry.duration)}
        ${row('Budget',      enquiry.budget)}
        ${row('Language',    enquiry.language?.toUpperCase())}
        ${row('Message',     enquiry.message)}
      </table>
      <div style="padding:16px 20px;background:#f8f9fa;border-top:2px solid #e9ecef">
        <a href="${process.env.BACKEND_URL || 'http://localhost:3001'}/admin"
           style="background:#1a2d5a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600">
          View in Admin Dashboard
        </a>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from:    `"KESARi Inbound" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO,
    subject: `New Enquiry: ${enquiry.fullName} — ${enquiry.packageName || 'General'}`,
    html,
  });
}

// ── Auto-reply to the visitor ───────────────────────────────────────────────
async function sendAutoReply(enquiry) {
  if (!process.env.EMAIL_USER || !enquiry.email) return;

  const firstName = enquiry.fullName.split(' ')[0];

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:linear-gradient(135deg,#1a2d5a,#c0392b);padding:32px 24px;text-align:center;border-radius:10px 10px 0 0">
      <h1 style="color:#fff;margin:0;font-size:24px">Thank You, ${firstName}!</h1>
      <p style="color:rgba(255,255,255,.85);margin:8px 0 0;font-size:14px">We have received your enquiry</p>
    </div>
    <div style="background:#fff;padding:28px 24px;border-radius:0 0 10px 10px;border:1px solid #e8e8e8;border-top:none">
      <p style="color:#333;font-size:15px;line-height:1.7">
        Dear <strong>${enquiry.fullName}</strong>,<br/><br/>
        Thank you for your interest in
        ${enquiry.packageName ? `our <strong>${enquiry.packageName}</strong> tour` : 'KESARi Inbound tours'}.
        Our travel expert will get back to you within <strong>24 hours</strong>.
      </p>

      ${enquiry.packageName ? `
      <div style="background:#f8f9fa;border-left:4px solid #c0392b;padding:14px 16px;border-radius:4px;margin:20px 0">
        <p style="margin:0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Package Enquired</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1a2d5a">${enquiry.packageName}</p>
      </div>` : ''}

      <div style="background:#f0f4ff;border-radius:8px;padding:16px;margin:20px 0">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1a2d5a;text-transform:uppercase;letter-spacing:1px">Your Enquiry Summary</p>
        <table style="width:100%;font-size:13px;color:#555">
          ${enquiry.travelDate  ? `<tr><td style="padding:4px 0">Travel Date</td><td style="font-weight:600">${enquiry.travelDate}</td></tr>` : ''}
          ${enquiry.travellers  ? `<tr><td style="padding:4px 0">Travellers</td><td style="font-weight:600">${enquiry.travellers}</td></tr>` : ''}
          ${enquiry.nationality ? `<tr><td style="padding:4px 0">Nationality</td><td style="font-weight:600">${enquiry.nationality}</td></tr>` : ''}
        </table>
      </div>

      <p style="color:#555;font-size:14px;line-height:1.7">
        For urgent queries, reach us at:<br/>
        Phone: <a href="tel:+912266666666" style="color:#1a2d5a;font-weight:600">+91 22 6666 6666</a><br/>
        Email: <a href="mailto:inbound@kesari.com" style="color:#1a2d5a">inbound@kesari.com</a>
      </p>

      <div style="text-align:center;margin-top:24px">
        <a href="https://neon-gelato-82bea6.netlify.app/INT"
           style="background:#c0392b;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:700;display:inline-block">
          Explore More Tours
        </a>
      </div>

      <p style="color:#999;font-size:12px;text-align:center;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
        KESARi Inbound — Crafting Unforgettable India Experiences for 42+ Years<br/>
        This is an automated email. Please do not reply.
      </p>
    </div>
  </div>`;

  await transporter.sendMail({
    from:    `"KESARi Inbound" <${process.env.EMAIL_USER}>`,
    to:      enquiry.email,
    subject: `Your India Travel Enquiry — KESARi Inbound`,
    html,
  });
}

module.exports = { sendEnquiryNotification, sendAutoReply };
