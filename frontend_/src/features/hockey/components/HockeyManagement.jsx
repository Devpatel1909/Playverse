import React from 'react';
import GenericSportsManagement from '../../common/components/GenericSportsManagement';

const HockeyManagement = () => {
  const initialTeams = [
    {
      id: 1,
      name: 'Ice Breakers',
      shortName: 'IB',
      logo: null,
      players: [
        { id: 1, name: 'Arjun Singh', position: 'Forward', jerseyNumber: 9, age: 25, weight: '180 lbs' },
        { id: 2, name: 'Vikram Patel', position: 'Defenseman', jerseyNumber: 4, age: 27, weight: '190 lbs' }
      ]
    },
    {
      id: 2,
      name: 'Stick Warriors',
      shortName: 'SW',
      logo: null,
      players: [
        { id: 3, name: 'Rohit Kumar', position: 'Goaltender', jerseyNumber: 1, age: 26, weight: '185 lbs' },
        { id: 4, name: 'Amit Sharma', position: 'Forward', jerseyNumber: 11, age: 24, weight: '175 lbs' }
      ]
    }
  ];

  const positions = ['Forward', 'Defenseman', 'Goaltender'];
  const playerFields = ['name', 'position', 'jerseyNumber', 'age', 'weight'];

  return (
    <GenericSportsManagement
      sportName="Hockey"
      sportIcon="🏒"
      sportColor="from-teal-950 via-cyan-950 to-teal-950"
      initialTeams={initialTeams}
      playerFields={playerFields}
      positions={positions}
    />
  );
};

export default HockeyManagement;