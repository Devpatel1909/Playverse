import React from 'react';
import GenericSportsManagement from '../../common/components/GenericSportsManagement';

const TennisManagement = () => {
  const initialTeams = [
    {
      id: 1,
      name: 'Ace Players',
      shortName: 'AP',
      logo: null,
      players: [
        { id: 1, name: 'Vikash Sharma', position: 'Singles', jerseyNumber: 1, age: 25, ranking: 'ATP 150' },
        { id: 2, name: 'Ravi Kumar', position: 'Doubles', jerseyNumber: 2, age: 27, ranking: 'ATP 200' }
      ]
    },
    {
      id: 2,
      name: 'Court Kings',
      shortName: 'CK',
      logo: null,
      players: [
        { id: 3, name: 'Anita Patel', position: 'Singles', jerseyNumber: 3, age: 23, ranking: 'WTA 180' },
        { id: 4, name: 'Priya Singh', position: 'Doubles', jerseyNumber: 4, age: 24, ranking: 'WTA 220' }
      ]
    }
  ];

  const positions = ['Singles', 'Doubles', 'Mixed Doubles'];
  const playerFields = ['name', 'position', 'jerseyNumber', 'age', 'ranking'];

  return (
    <GenericSportsManagement
      sportName="Tennis"
      sportIcon="🎾"
      sportColor="from-pink-950 via-rose-950 to-pink-950"
      initialTeams={initialTeams}
      playerFields={playerFields}
      positions={positions}
    />
  );
};

export default TennisManagement;