import React from 'react';
import GenericSportsManagement from '../../common/components/GenericSportsManagement';

const BadmintonManagement = () => {
  const initialTeams = [
    {
      id: 1,
      name: 'Shuttlers Club',
      shortName: 'SC',
      logo: null,
      players: [
        { id: 1, name: 'Priya Sharma', position: 'Singles', jerseyNumber: 1, age: 22, ranking: 'A' },
        { id: 2, name: 'Raj Patel', position: 'Doubles', jerseyNumber: 2, age: 24, ranking: 'B' }
      ]
    },
    {
      id: 2,
      name: 'Racket Masters',
      shortName: 'RM',
      logo: null,
      players: [
        { id: 3, name: 'Anita Singh', position: 'Singles', jerseyNumber: 3, age: 23, ranking: 'A' },
        { id: 4, name: 'Kiran Kumar', position: 'Mixed Doubles', jerseyNumber: 4, age: 25, ranking: 'B' }
      ]
    }
  ];

  const positions = ['Singles', 'Doubles', 'Mixed Doubles'];
  const playerFields = ['name', 'position', 'jerseyNumber', 'age', 'ranking'];

  return (
    <GenericSportsManagement
      sportName="Badminton"
      sportIcon="🏸"
      sportColor="from-purple-950 via-violet-950 to-purple-950"
      initialTeams={initialTeams}
      playerFields={playerFields}
      positions={positions}
    />
  );
};

export default BadmintonManagement;