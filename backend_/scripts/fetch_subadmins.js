const path = require('path');
const dotenv = require('dotenv');

// Load env from project root .env if present
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { connectDB } = require('../config/database');
const SubAdmin = require('../models/SubAdmin');

async function fetchSubAdmins(filter = { sport: 'cricket' }) {
  try {
    await connectDB();

    console.log(`Querying SubAdmin with filter: ${JSON.stringify(filter)}`);
    const docs = await SubAdmin.find(filter).lean().limit(200).exec();

    console.log(`Found ${docs.length} documents`);
    docs.forEach((d, i) => {
      // avoid printing password unless explicitly allowed
      if (d.password && process.env.ALLOW_PRINT_PASSWORDS !== 'true') d.password = '***hidden***';
      console.log(`${i + 1}. ${d.name} <${d.email}> - ${d.status} - ${d.sport}`);
    });

    // print full JSON only when requested
    if (process.env.PRINT_FULL_JSON === 'true') {
      console.log(JSON.stringify(docs, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error('Error fetching sub-admins:', err.message || err);
    process.exit(2);
  }
}

const argSport = process.argv[2];
const filter = argSport ? { sport: argSport.toLowerCase() } : { sport: 'cricket' };
fetchSubAdmins(filter);
