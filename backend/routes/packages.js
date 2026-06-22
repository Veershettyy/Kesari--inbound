const express  = require('express');
const router   = express.Router();
const Package  = require('../models/Package');
const auth     = require('../middleware/auth');
const { translateAllLanguages } = require('../services/translator');

// GET /api/packages — public: get all active packages
router.get('/', async (req, res) => {
  try {
    const { lang = 'en', theme } = req.query;
    const filter = { active: true };
    if (theme && theme !== 'all') filter.theme = theme;

    const packages = await Package.find(filter).sort({ createdAt: -1 });

    // Return name in requested language, fallback to English
    const result = packages.map(p => ({
      code:   p.code,
      name:   p.names[lang] || p.names.en,
      days:   p.days,
      nights: p.nights,
      theme:  p.theme,
      places: p.places,
      tags:   p.tags,
      img:    p.img,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/packages/:code — public: get single package
router.get('/:code', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const pkg = await Package.findOne({ code: req.params.code, active: true });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });

    res.json({
      code:   pkg.code,
      name:   pkg.names[lang] || pkg.names.en,
      names:  pkg.names,
      days:   pkg.days,
      nights: pkg.nights,
      theme:  pkg.theme,
      places: pkg.places,
      tags:   pkg.tags,
      img:    pkg.img,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/packages — admin: create package + auto-translate name
router.post('/', auth, async (req, res) => {
  try {
    const { code, nameEn, days, nights, theme, places, tags, img } = req.body;

    // Auto-translate name to all 12 languages via Mistral
    console.log(`Translating "${nameEn}" to all languages...`);
    const names = await translateAllLanguages(nameEn);

    const pkg = await Package.create({ code, names, days, nights, theme, places, tags, img });
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/packages/:code — admin: update package
router.put('/:code', auth, async (req, res) => {
  try {
    const { nameEn, ...rest } = req.body;
    const update = { ...rest };

    if (nameEn) {
      update.names = await translateAllLanguages(nameEn);
    }

    const pkg = await Package.findOneAndUpdate(
      { code: req.params.code }, update, { new: true }
    );
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/packages/:code — admin: soft delete
router.delete('/:code', auth, async (req, res) => {
  try {
    await Package.findOneAndUpdate({ code: req.params.code }, { active: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
