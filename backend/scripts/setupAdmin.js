/**
 * Creates the first admin account.
 * Run: node scripts/setupAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin    = require('../models/Admin');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

async function setup() {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await Admin.countDocuments();
  if (count > 0) {
    console.log('Admin already exists. Use the login page.');
    process.exit(0);
  }

  console.log('\n--- Create KESARi Inbound Admin Account ---\n');
  const name     = await ask('Name: ');
  const email    = await ask('Email: ');
  const password = await ask('Password (min 8 chars): ');
  rl.close();

  await Admin.create({ name, email, password, role: 'superadmin' });
  console.log(`\n✔ Admin created: ${email}`);
  console.log('  Login at: http://localhost:3001/admin\n');
  await mongoose.disconnect();
}

setup().catch(err => { console.error(err); process.exit(1); });
