import React from 'react';
import GenericSportsManagement from '../../common/components/GenericSportsManagement';

const VolleyballManagement = () => {
  const initialTeams = [
    {
      id: 1,
      name: 'Beach Volley',
      shortName: 'BV',
      logo: null,
      players: [
        { id: 1, name: 'Arjun Mehta', position: 'Spiker', jerseyNumber: 7, age: 26, height: '6\'1"' },
        { id: 2, name: 'Neha Gupta', position: 'Setter', jerseyNumber: 3, age: 24, height: '5\'8"' }
      ]
    },
    {
      id: 2,
      name: 'Net Warriors',
      shortName: 'NW',
      logo: null,
      players: [
        { id: 3, name: 'Rohit Jain', position: 'Blocker', jerseyNumber: 12, age: 28, height: '6\'3"' },
        { id: 4, name: 'Priya Nair', position: 'Libero', jerseyNumber: 5, age: 22, height: '5\'6"' }
      ]
    }
  ];

  const positions = ['Spiker', 'Setter', 'Blocker', 'Libero', 'Server'];
  const playerFields = ['name', 'position', 'jerseyNumber', 'age', 'height'];

  return (
    <GenericSportsManagement
      sportName="Volleyball"
      sportIcon="🏐"
      sportColor="from-yellow-950 via-orange-950 to-yellow-950"
      initialTeams={initialTeams}
      playerFields={playerFields}
      positions={positions}
    />
  );
};

export default VolleyballManagement;