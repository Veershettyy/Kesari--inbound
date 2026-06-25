const { body, validationResult } = require('express-validator');

// Run validators and return 400 if any fail
const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map(rule => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

const enquiryRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required').isLength({ max: 20 }),
  body('packageCode').optional().trim().isLength({ max: 50 }),
  body('message').optional().trim().isLength({ max: 2000 }),
  body('travellers').optional().trim().isLength({ max: 20 }),
];

module.exports = { validate, enquiryRules };
