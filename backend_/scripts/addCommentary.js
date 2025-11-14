const mongoose = require('mongoose');
const CricketMatch = require('../models/CricketMatch');
require('dotenv').config();

const addSampleCommentary = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the first match
    const match = await CricketMatch.findOne({ status: 'completed' });
    
    if (!match) {
      console.log('No completed match found');
      return;
    }

    console.log(`Adding commentary to match: ${match._id}`);

    // Sample commentary data
    const commentary = [
      { ballNumber: '19.6', over: 19, ball: 6, batsman: 'Jasprit Bumrah', bowler: 'Ravindra Jadeja', runs: 4, overDetail: 'or yelaga chakka' },
      { ballNumber: '19.5', over: 19, ball: 5, batsman: 'Rohit Sharma', bowler: 'Ravindra Jadeja', runs: 5, overDetail: 'or yelaga chakka' },
      { ballNumber: '19.4', over: 19, ball: 4, batsman: 'Rohit Sharma', bowler: 'Ravindra Jadeja', runs: 6, overDetail: '' },
      { ballNumber: '19.3', over: 19, ball: 3, batsman: 'Jasprit Bumrah', bowler: 'MS Dhoni', runs: 6, overDetail: '' },
      { ballNumber: '19.2', over: 19, ball: 2, batsman: 'Rohit Sharma', bowler: 'MS Dhoni', runs: 3, overDetail: '' },
      { ballNumber: '19.1', over: 19, ball: 1, batsman: 'Jasprit Bumrah', bowler: 'MS Dhoni', runs: 1, overDetail: '' },
      { ballNumber: '18.6', over: 18, ball: 6, batsman: 'Jasprit Bumrah', bowler: 'MS Dhoni', runs: 2, overDetail: '' },
      { ballNumber: '18.5', over: 18, ball: 5, batsman: 'Jasprit Bumrah', bowler: 'MS Dhoni', runs: 4, overDetail: '' },
      { ballNumber: '18.4', over: 18, ball: 4, batsman: 'Rohit Sharma', bowler: 'MS Dhoni', runs: 5, overDetail: '' },
      { ballNumber: '18.3', over: 18, ball: 3, batsman: 'Rohit Sharma', bowler: 'MS Dhoni', runs: 1, overDetail: '' },
      { ballNumber: '18.2', over: 18, ball: 2, batsman: 'Jasprit Bumrah', bowler: 'MS Dhoni', runs: 0, overDetail: 'dot ball' },
      { ballNumber: '18.1', over: 18, ball: 1, batsman: 'Rohit Sharma', bowler: 'MS Dhoni', runs: 2, overDetail: '' },
    ];

    match.commentary = commentary;
    await match.save();

    console.log('Commentary added successfully!');
    console.log(`Match ID: ${match._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addSampleCommentary();
