import React, { useState } from "react";

export default function CricketScoring() {
  const [score, setScore] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [batsmen, setBatsmen] = useState([
    { name: "A. Shah (C)", runs: 0, balls: 0, fours: 0, sixes: 0, striker: true },
    { name: "R. Joshi", runs: 0, balls: 0, fours: 0, sixes: 0, striker: false },
  ]);

  const handleRun = (runs) => {
    setScore((prev) => {
      let newBalls = prev.balls + 1;
      let newOvers = prev.overs;
      if (newBalls === 6) {
        newBalls = 0;
        newOvers += 1;
      }

      // Update striker batsman runs
      const updatedBatsmen = [...batsmen];
      const strikerIndex = updatedBatsmen.findIndex((b) => b.striker);
      updatedBatsmen[strikerIndex].runs += runs;
      updatedBatsmen[strikerIndex].balls += 1;
      if (runs === 4) updatedBatsmen[strikerIndex].fours += 1;
      if (runs === 6) updatedBatsmen[strikerIndex].sixes += 1;

      // Change strike if runs are odd
      if (runs % 2 !== 0) {
        updatedBatsmen.forEach((b) => (b.striker = !b.striker));
      }

      setBatsmen(updatedBatsmen);

      return { ...prev, runs: prev.runs + runs, balls: newBalls, overs: newOvers };
    });
  };

  const handleWicket = () => {
    setScore((prev) => ({ ...prev, wickets: prev.wickets + 1, balls: prev.balls + 1 }));
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Spoural — Live Scoring</h1>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border shadow rounded-xl">
          <h2 className="text-lg font-semibold">CE Titans</h2>
          <p className="text-3xl">{score.runs}/{score.wickets}</p>
          <p>{score.overs}.{score.balls} ov</p>
        </div>

        <div className="p-4 border shadow rounded-xl">
          <h2 className="text-lg font-semibold">IT Falcons</h2>
          <p className="text-3xl">0/0</p>
          <p>0.0 ov</p>
        </div>
      </div>

      {/* Over Progress */}
      <div className="p-4 mb-6 border shadow rounded-xl">
        <h2 className="mb-2 font-semibold">Over Progress</h2>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center border rounded-lg ${
                i < score.balls ? "bg-green-200" : "bg-gray-100"
              }`}
            >
              {i < score.balls ? "✔" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Batting Table */}
      <div className="p-4 mb-6 border shadow rounded-xl">
        <h2 className="mb-2 font-semibold">Batting — CE Titans</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            {batsmen.map((b, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{b.name} {b.striker && <span className="text-green-600">(Striker)</span>}</td>
                <td>{b.runs}</td>
                <td>{b.balls}</td>
                <td>{b.fours}</td>
                <td>{b.sixes}</td>
                <td>{b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 6].map((r) => (
          <button
            key={r}
            onClick={() => handleRun(r)}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            {r}
          </button>
        ))}
        <button
          onClick={handleWicket}
          className="px-4 py-2 text-white bg-red-500 rounded-lg"
        >
          Wicket
        </button>
      </div>
    </div>
  );
}
