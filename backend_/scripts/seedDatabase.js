require('dotenv').config();
const mongoose = require('mongoose');
const CricketTeam = require('../models/CricketTeam');
const CricketMatch = require('../models/CricketMatch');
const SuperAdmin = require('../models/SuperAdmin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cricket_command_center';

// Sample teams data (will add createdBy after creating SuperAdmin)
const teamsData = [
  {
    name: 'Mumbai Indians',
    shortName: 'MI',
    captain: 'Rohit Sharma',
    coach: 'Mark Boucher',
    established: '2008',
    homeGround: 'Wankhede Stadium',
    contactEmail: 'info@mumbaiindians.com',
    contactPhone: '+91-22-12345678',
    logo: '🏏',
    players: [
      { name: 'Rohit Sharma', role: 'Captain/Batsman', jerseyNumber: 45, age: 36, experience: '15 years', matches: 250, runs: 6500, average: 31.5, strikeRate: 130.5 },
      { name: 'Jasprit Bumrah', role: 'Fast Bowler', jerseyNumber: 93, age: 30, experience: '9 years', matches: 150, wickets: 180, economy: 7.2 },
      { name: 'Suryakumar Yadav', role: 'Middle Order Batsman', jerseyNumber: 63, age: 33, experience: '10 years', matches: 180, runs: 4200, average: 28.5, strikeRate: 145.2 },
      { name: 'Ishan Kishan', role: 'Wicket Keeper', jerseyNumber: 32, age: 25, experience: '6 years', matches: 100, runs: 2500, catches: 45, stumps: 12 },
      { name: 'Hardik Pandya', role: 'All-rounder', jerseyNumber: 33, age: 30, experience: '9 years', matches: 160, runs: 3200, wickets: 85 }
    ]
  },
  {
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    captain: 'MS Dhoni',
    coach: 'Stephen Fleming',
    established: '2008',
    homeGround: 'M. A. Chidambaram Stadium',
    contactEmail: 'info@chennaisk.com',
    contactPhone: '+91-44-12345678',
    logo: '🏏',
    players: [
      { name: 'MS Dhoni', role: 'Captain/Wicket Keeper', jerseyNumber: 7, age: 42, experience: '20 years', matches: 300, runs: 7500, catches: 180, stumps: 65 },
      { name: 'Ravindra Jadeja', role: 'All-rounder', jerseyNumber: 8, age: 35, experience: '14 years', matches: 250, runs: 4500, wickets: 150 },
      { name: 'Ruturaj Gaikwad', role: 'Opening Batsman', jerseyNumber: 31, age: 27, experience: '5 years', matches: 80, runs: 2200, average: 32.5 },
      { name: 'Deepak Chahar', role: 'Fast Bowler', jerseyNumber: 90, age: 31, experience: '8 years', matches: 120, wickets: 140, economy: 7.8 },
      { name: 'Moeen Ali', role: 'All-rounder', jerseyNumber: 18, age: 36, experience: '12 years', matches: 100, runs: 1800, wickets: 45 }
    ]
  },
  {
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    captain: 'Faf du Plessis',
    coach: 'Andy Flower',
    established: '2008',
    homeGround: 'M. Chinnaswamy Stadium',
    contactEmail: 'info@royalchallengers.com',
    contactPhone: '+91-80-12345678',
    logo: '🏏',
    players: [
      { name: 'Virat Kohli', role: 'Batsman', jerseyNumber: 18, age: 35, experience: '16 years', matches: 280, runs: 8000, average: 38.5, strikeRate: 135.2 },
      { name: 'Faf du Plessis', role: 'Captain/Batsman', jerseyNumber: 19, age: 39, experience: '15 years', matches: 200, runs: 5200, average: 34.2 },
      { name: 'Glenn Maxwell', role: 'All-rounder', jerseyNumber: 32, age: 35, experience: '12 years', matches: 180, runs: 3800, wickets: 65 },
      { name: 'Mohammed Siraj', role: 'Fast Bowler', jerseyNumber: 13, age: 30, experience: '8 years', matches: 130, wickets: 155, economy: 8.1 },
      { name: 'Dinesh Karthik', role: 'Wicket Keeper', jerseyNumber: 7, age: 38, experience: '18 years', matches: 280, runs: 5500, catches: 120 }
    ]
  },
  {
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    captain: 'Shreyas Iyer',
    coach: 'Chandrakant Pandit',
    established: '2008',
    homeGround: 'Eden Gardens',
    contactEmail: 'info@kkr.in',
    contactPhone: '+91-33-12345678',
    logo: '🏏',
    players: [
      { name: 'Shreyas Iyer', role: 'Captain/Batsman', jerseyNumber: 41, age: 29, experience: '10 years', matches: 150, runs: 3800, average: 30.5 },
      { name: 'Andre Russell', role: 'All-rounder', jerseyNumber: 12, age: 36, experience: '14 years', matches: 200, runs: 4200, wickets: 95, strikeRate: 175.5 },
      { name: 'Sunil Narine', role: 'All-rounder', jerseyNumber: 74, age: 35, experience: '13 years', matches: 220, runs: 2800, wickets: 180 },
      { name: 'Varun Chakravarthy', role: 'Spin Bowler', jerseyNumber: 29, age: 32, experience: '5 years', matches: 70, wickets: 85, economy: 7.5 },
      { name: 'Rinku Singh', role: 'Finisher', jerseyNumber: 28, age: 26, experience: '4 years', matches: 60, runs: 1200, strikeRate: 140.5 }
    ]
  },
  {
    name: 'Delhi Capitals',
    shortName: 'DC',
    captain: 'David Warner',
    coach: 'Ricky Ponting',
    established: '2008',
    homeGround: 'Arun Jaitley Stadium',
    contactEmail: 'info@delhicapitals.in',
    contactPhone: '+91-11-12345678',
    logo: '🏏',
    players: [
      { name: 'David Warner', role: 'Captain/Batsman', jerseyNumber: 31, age: 37, experience: '15 years', matches: 250, runs: 7200, average: 42.5, strikeRate: 142.8 },
      { name: 'Rishabh Pant', role: 'Wicket Keeper', jerseyNumber: 17, age: 26, experience: '7 years', matches: 120, runs: 3200, catches: 85, stumps: 22 },
      { name: 'Axar Patel', role: 'All-rounder', jerseyNumber: 20, age: 30, experience: '9 years', matches: 140, runs: 1800, wickets: 120 },
      { name: 'Kuldeep Yadav', role: 'Spin Bowler', jerseyNumber: 23, age: 29, experience: '8 years', matches: 110, wickets: 135, economy: 7.9 },
      { name: 'Prithvi Shaw', role: 'Opening Batsman', jerseyNumber: 38, age: 24, experience: '6 years', matches: 90, runs: 2400, strikeRate: 148.2 }
    ]
  },
  {
    name: 'Punjab Kings',
    shortName: 'PBKS',
    captain: 'Shikhar Dhawan',
    coach: 'Trevor Bayliss',
    established: '2008',
    homeGround: 'Punjab Cricket Association Stadium',
    contactEmail: 'info@punjabkings.in',
    contactPhone: '+91-161-12345678',
    logo: '🏏',
    players: [
      { name: 'Shikhar Dhawan', role: 'Captain/Batsman', jerseyNumber: 25, age: 38, experience: '16 years', matches: 260, runs: 6800, average: 35.2 },
      { name: 'Kagiso Rabada', role: 'Fast Bowler', jerseyNumber: 44, age: 29, experience: '9 years', matches: 100, wickets: 125, economy: 8.2 },
      { name: 'Liam Livingstone', role: 'All-rounder', jerseyNumber: 32, age: 30, experience: '8 years', matches: 90, runs: 1900, wickets: 35 },
      { name: 'Arshdeep Singh', role: 'Fast Bowler', jerseyNumber: 2, age: 25, experience: '4 years', matches: 70, wickets: 80, economy: 8.5 },
      { name: 'Jitesh Sharma', role: 'Wicket Keeper', jerseyNumber: 9, age: 30, experience: '3 years', matches: 50, runs: 1100, catches: 35 }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('\nClearing existing data...');
    await CricketTeam.deleteMany({});
    await CricketMatch.deleteMany({});
    console.log('Existing data cleared');

    // Create or get SuperAdmin
    console.log('\nCreating SuperAdmin...');
    let superAdmin = await SuperAdmin.findOne({ email: 'admin@playverse.com' });
    if (!superAdmin) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      superAdmin = await SuperAdmin.create({
        superadminName: 'System Admin',
        email: 'admin@playverse.com',
        passwordHash: hashedPassword
      });
      console.log('✓ SuperAdmin created (email: admin@playverse.com, password: admin123)');
    } else {
      console.log('✓ SuperAdmin already exists');
    }

    // Add createdBy to all teams
    const teamsWithCreator = teamsData.map(team => ({
      ...team,
      createdBy: superAdmin._id
    }));

    // Insert teams
    console.log('\nInserting teams...');
    const teams = await CricketTeam.insertMany(teamsWithCreator);
    console.log(`✓ Inserted ${teams.length} teams`);

    // Create matches
    console.log('\nCreating matches...');
    const matches = [];

    // Live match 1
    matches.push({
      teamA: teams[0]._id, // Mumbai Indians
      teamB: teams[1]._id, // Chennai Super Kings
      date: new Date(),
      venue: 'Wankhede Stadium, Mumbai',
      matchType: 'T20',
      overs: 20,
      status: 'live',
      score: {
        teamA: { runs: 185, wickets: 6 },
        teamB: { runs: 142, wickets: 5 },
        overs: '15.3'
      },
      result: '',
      createdBy: superAdmin._id
    });

    // Live match 2
    matches.push({
      teamA: teams[2]._id, // RCB
      teamB: teams[3]._id, // KKR
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      matchType: 'T20',
      overs: 20,
      status: 'live',
      score: {
        teamA: { runs: 178, wickets: 8 },
        teamB: { runs: 95, wickets: 3 },
        overs: '10.2'
      },
      result: '',
      createdBy: superAdmin._id
    });

    // Completed match 1
    matches.push({
      teamA: teams[4]._id, // Delhi Capitals
      teamB: teams[5]._id, // Punjab Kings
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      venue: 'Arun Jaitley Stadium, Delhi',
      matchType: 'T20',
      overs: 20,
      status: 'completed',
      score: {
        teamA: { runs: 195, wickets: 5 },
        teamB: { runs: 187, wickets: 9 },
        overs: '20.0'
      },
      result: 'Delhi Capitals won by 8 runs',
      createdBy: superAdmin._id
    });

    // Completed match 2
    matches.push({
      teamA: teams[0]._id, // Mumbai Indians
      teamB: teams[3]._id, // KKR
      date: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      venue: 'Eden Gardens, Kolkata',
      matchType: 'T20',
      overs: 20,
      status: 'completed',
      score: {
        teamA: { runs: 168, wickets: 7 },
        teamB: { runs: 172, wickets: 4 },
        overs: '19.2'
      },
      result: 'Kolkata Knight Riders won by 6 wickets',
      createdBy: superAdmin._id
    });

    // Completed match 3
    matches.push({
      teamA: teams[1]._id, // CSK
      teamB: teams[2]._id, // RCB
      date: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
      venue: 'M. A. Chidambaram Stadium, Chennai',
      matchType: 'T20',
      overs: 20,
      status: 'completed',
      score: {
        teamA: { runs: 210, wickets: 4 },
        teamB: { runs: 198, wickets: 8 },
        overs: '20.0'
      },
      result: 'Chennai Super Kings won by 12 runs',
      createdBy: superAdmin._id
    });

    // Upcoming match 1
    matches.push({
      teamA: teams[5]._id, // Punjab Kings
      teamB: teams[0]._id, // Mumbai Indians
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      venue: 'Punjab Cricket Association Stadium, Mohali',
      matchType: 'T20',
      overs: 20,
      status: 'scheduled',
      score: {
        teamA: { runs: 0, wickets: 0 },
        teamB: { runs: 0, wickets: 0 },
        overs: '0.0'
      },
      result: '',
      createdBy: superAdmin._id
    });

    // Upcoming match 2
    matches.push({
      teamA: teams[3]._id, // KKR
      teamB: teams[4]._id, // Delhi Capitals
      date: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
      venue: 'Eden Gardens, Kolkata',
      matchType: 'T20',
      overs: 20,
      status: 'scheduled',
      score: {
        teamA: { runs: 0, wickets: 0 },
        teamB: { runs: 0, wickets: 0 },
        overs: '0.0'
      },
      result: '',
      createdBy: superAdmin._id
    });

    // Upcoming match 3
    matches.push({
      teamA: teams[2]._id, // RCB
      teamB: teams[1]._id, // CSK
      date: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      matchType: 'T20',
      overs: 20,
      status: 'scheduled',
      score: {
        teamA: { runs: 0, wickets: 0 },
        teamB: { runs: 0, wickets: 0 },
        overs: '0.0'
      },
      result: '',
      createdBy: superAdmin._id
    });

    const insertedMatches = await CricketMatch.insertMany(matches);
    console.log(`✓ Inserted ${insertedMatches.length} matches`);

    // Summary
    console.log('\n=== Database Seeding Complete ===');
    console.log(`Teams: ${teams.length}`);
    console.log(`Matches: ${insertedMatches.length}`);
    console.log(`  - Live: ${insertedMatches.filter(m => m.status === 'live').length}`);
    console.log(`  - Completed: ${insertedMatches.filter(m => m.status === 'completed').length}`);
    console.log(`  - Scheduled: ${insertedMatches.filter(m => m.status === 'scheduled').length}`);
    console.log('\nYou can now test the application with real data!');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
