const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  // Which package & language the user was on
  packageCode: { type: String, default: '' },
  packageName: { type: String, default: '' },
  language:    { type: String, default: 'en' },

  // Contact details
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  nationality: { type: String, default: '' },

  // Trip preferences
  travelDate:  { type: String, default: '' },
  travellers:  { type: String, default: '' },
  duration:    { type: String, default: '' },
  budget:      { type: String, default: '' },
  message:     { type: String, default: '' },

  // CRM status
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new',
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

EnquirySchema.index({ status: 1 });
EnquirySchema.index({ language: 1 });
EnquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', EnquirySchema);
