const mongoose = require('mongoose');

const LANGS = ['en','es','fr','hi','de','ja','pt','it','zh','ar','ko','ml','pl'];

// Build a sub-schema with one field per language
function multilingualField(required = false) {
  const def = {};
  LANGS.forEach(l => { def[l] = { type: String, default: '' }; });
  if (required) def.en.required = true;
  return def;
}

const PackageSchema = new mongoose.Schema({
  code:    { type: String, required: true, unique: true },
  names:   multilingualField(true),   // translated tour names
  days:    { type: Number, required: true },
  nights:  { type: Number, required: true },
  theme:   { type: String, required: true },
  places:  { type: String, required: true }, // itinerary cities (always English proper nouns)
  tags:    { type: String, default: '' },
  img:     { type: String, default: '' },
  active:  { type: Boolean, default: true },
}, { timestamps: true });

PackageSchema.index({ code: 1 });
PackageSchema.index({ theme: 1 });
PackageSchema.index({ active: 1 });

module.exports = mongoose.model('Package', PackageSchema);
