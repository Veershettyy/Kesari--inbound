const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const LANG_NAMES = {
  en:'English', es:'Spanish', fr:'French', hi:'Hindi', de:'German',
  ja:'Japanese', pt:'Portuguese', it:'Italian', zh:'Chinese', ar:'Arabic',
  ko:'Korean', ml:'Malayalam', pl:'Polish',
};

async function sendEnquiryNotification(enquiry) {
  const langName = LANG_NAMES[enquiry.language] || enquiry.language.toUpperCase();

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1a1a4e;padding:20px;text-align:center">
        <h2 style="color:#fff;margin:0">New Enquiry — KESARi Inbound</h2>
      </div>
      <div style="padding:24px;border:1px solid #e8e8e8">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;color:#888;width:140px">Language</td>
              <td style="padding:8px;font-weight:bold">${langName} 🌐</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Package</td>
              <td style="padding:8px">${enquiry.packageName || 'General Enquiry'}</td></tr>
          <tr><td style="padding:8px;color:#888">Name</td>
              <td style="padding:8px">${enquiry.fullName}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Email</td>
              <td style="padding:8px"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
          <tr><td style="padding:8px;color:#888">Phone</td>
              <td style="padding:8px">${enquiry.phone}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Nationality</td>
              <td style="padding:8px">${enquiry.nationality || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888">Travel Date</td>
              <td style="padding:8px">${enquiry.travelDate || '—'}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Travellers</td>
              <td style="padding:8px">${enquiry.travellers || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888">Duration</td>
              <td style="padding:8px">${enquiry.duration || '—'}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Budget</td>
              <td style="padding:8px">${enquiry.budget || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888">Message</td>
              <td style="padding:8px">${enquiry.message || '—'}</td></tr>
        </table>
      </div>
      <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#888">
        Received ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"KESARi Inbound" <${process.env.EMAIL_USER}>`,
    to:   process.env.EMAIL_TO,
    subject: `New ${langName} Enquiry — ${enquiry.fullName} | ${enquiry.packageName || 'General'}`,
    html,
  });
}

module.exports = { sendEnquiryNotification };
