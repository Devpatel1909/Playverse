/* Quick dev script: check SuperAdmin documents for a given email
   Usage: node scripts/inspect_superadmin.js <email>
*/
const { connectDB } = require('../config/database');
const mongoose = require('mongoose');
const SuperAdmin = require('../models/SuperAdmin');

async function run() {
  await connectDB();
  const email = process.argv[2] || 'cricket.admin@sports.com';
  const doc = await SuperAdmin.findOne({ email: email.toLowerCase() }).lean();
  if (!doc) {
    console.log('No SuperAdmin found for email:', email);
  } else {
    console.log('Found SuperAdmin:');
    // hide passwordHash length but show if present
    const out = { ...doc };
    if (out.passwordHash) {
      out.passwordHash = `***hash(length:${out.passwordHash.length})***`;
    }
    console.log(JSON.stringify(out, null, 2));
  }
  mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
