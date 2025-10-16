import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card';

const LiveStatistics = ({ match, recentBalls = [] }) => {
  const stats = useMemo(() => {
    if (!match || !match.innings) return null;

    const currentInnings = match.innings[match.currentInnings - 1] || {};
    const { score = {}, balls = [] } = currentInnings;
    
    // Calculate batting statistics
    const calculateBattingStats = () => {
      const strikerStats = {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0
      };
      
      const nonStrikerStats = { ...strikerStats };
      
      balls.forEach(ball => {
        if (ball.batsmanId === match.currentBatsmen?.striker?._id) {
          strikerStats.runs += ball.runs || 0;
          if (!ball.extras) strikerStats.balls++;
          if (ball.runs === 4) strikerStats.fours++;
          if (ball.runs === 6) strikerStats.sixes++;
        } else if (ball.batsmanId === match.currentBatsmen?.nonStriker?._id) {
          nonStrikerStats.runs += ball.runs || 0;
          if (!ball.extras) nonStrikerStats.balls++;
          if (ball.runs === 4) nonStrikerStats.fours++;
          if (ball.runs === 6) nonStrikerStats.sixes++;
        }
      });
      
      strikerStats.strikeRate = strikerStats.balls > 0 ? 
        ((strikerStats.runs / strikerStats.balls) * 100).toFixed(1) : 0;
      nonStrikerStats.strikeRate = nonStrikerStats.balls > 0 ? 
        ((nonStrikerStats.runs / nonStrikerStats.balls) * 100).toFixed(1) : 0;
      
      return { strikerStats, nonStrikerStats };
    };

    // Calculate bowling statistics
    const calculateBowlingStats = () => {
      const bowlerStats = {
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        economy: 0,
        maiden: false
      };
      
      let currentOverBalls = 0;
      let currentOverRuns = 0;
      
      balls.forEach(ball => {
        if (ball.bowlerId === match.currentBowler?._id) {
          bowlerStats.runs += ball.runs || 0;
          if (ball.extras) bowlerStats.runs += ball.extras;
          if (ball.wicket) bowlerStats.wickets++;
          
          if (!ball.extras) {
            bowlerStats.balls++;
            currentOverBalls++;
          }
          
          currentOverRuns += (ball.runs || 0) + (ball.extras || 0);
          
          if (currentOverBalls === 6) {
            bowlerStats.overs++;
            if (currentOverRuns === 0) bowlerStats.maiden = true;
            currentOverBalls = 0;
            currentOverRuns = 0;
          }
        }
      });
      
      const totalOvers = bowlerStats.overs + (currentOverBalls / 6);
      bowlerStats.economy = totalOvers > 0 ? 
        (bowlerStats.runs / totalOvers).toFixed(1) : 0;
      
      return bowlerStats;
    };

    // Calculate team statistics
    const calculateTeamStats = () => {
      const runRate = score.overs > 0 ? 
        (score.runs / (score.overs + (score.balls || 0) / 6)).toFixed(1) : 0;
      
      const boundaries = balls.filter(ball => ball.runs === 4 || ball.runs === 6).length;
      const dots = balls.filter(ball => (ball.runs || 0) === 0 && !ball.extras).length;
      
      // Calculate required run rate (assuming target exists)
      const requiredRunRate = match.target && match.remainingOvers > 0 ? 
        ((match.target - score.runs) / match.remainingOvers).toFixed(1) : null;
      
      return {
        runRate,
        boundaries,
        dots,
        requiredRunRate,
        extras: balls.filter(ball => ball.extras > 0).reduce((sum, ball) => sum + ball.extras, 0)
      };
    };

    // Calculate partnership
    const calculatePartnership = () => {
      const partnershipRuns = balls
        .filter(ball => 
          ball.batsmanId === match.currentBatsmen?.striker?._id || 
          ball.batsmanId === match.currentBatsmen?.nonStriker?._id
        )
        .reduce((sum, ball) => sum + (ball.runs || 0), 0);
      
      const partnershipBalls = balls
        .filter(ball => 
          (ball.batsmanId === match.currentBatsmen?.striker?._id || 
           ball.batsmanId === match.currentBatsmen?.nonStriker?._id) && !ball.extras
        ).length;
      
      return { runs: partnershipRuns, balls: partnershipBalls };
    };

    const { strikerStats, nonStrikerStats } = calculateBattingStats();
    const bowlerStats = calculateBowlingStats();
    const teamStats = calculateTeamStats();
    const partnership = calculatePartnership();

    return {
      batting: { strikerStats, nonStrikerStats },
      bowling: bowlerStats,
      team: teamStats,
      partnership
    };
  }, [match, recentBalls]);

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No statistics available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Partnership */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Partnership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.partnership.runs} runs
            </div>
            <div className="text-sm text-gray-600">
              {stats.partnership.balls} balls
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batting Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Batting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Striker */}
            <div className="bg-green-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-green-800">
                  {match.currentBatsmen?.striker?.name || 'Striker'} *
                </span>
                <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded">
                  On Strike
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.batting.strikerStats.runs}</div>
                  <div className="text-gray-600">Runs</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.batting.strikerStats.balls}</div>
                  <div className="text-gray-600">Balls</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.batting.strikerStats.strikeRate}</div>
                  <div className="text-gray-600">S/R</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {stats.batting.strikerStats.fours}/{stats.batting.strikerStats.sixes}
                  </div>
                  <div className="text-gray-600">4s/6s</div>
                </div>
              </div>
            </div>

            {/* Non-Striker */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">
                  {match.currentBatsmen?.nonStriker?.name || 'Non-Striker'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.batting.nonStrikerStats.runs}</div>
                  <div className="text-gray-600">Runs</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.batting.nonStrikerStats.balls}</div>
                  <div className="text-gray-600">Balls</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.batting.nonStrikerStats.strikeRate}</div>
                  <div className="text-gray-600">S/R</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {stats.batting.nonStrikerStats.fours}/{stats.batting.nonStrikerStats.sixes}
                  </div>
                  <div className="text-gray-600">4s/6s</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bowling Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Bowling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-blue-800">
                {match.currentBowler?.name || 'Current Bowler'}
              </span>
              {stats.bowling.maiden && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  Maiden
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">
                  {stats.bowling.overs}.{stats.bowling.balls}
                </div>
                <div className="text-gray-600">Overs</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{stats.bowling.runs}</div>
                <div className="text-gray-600">Runs</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{stats.bowling.wickets}</div>
                <div className="text-gray-600">Wickets</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{stats.bowling.economy}</div>
                <div className="text-gray-600">Economy</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Team Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{stats.team.runRate}</div>
              <div className="text-gray-600">Run Rate</div>
            </div>
            {stats.team.requiredRunRate && (
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-bold text-lg">{stats.team.requiredRunRate}</div>
                <div className="text-gray-600">Required RR</div>
              </div>
            )}
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{stats.team.boundaries}</div>
              <div className="text-gray-600">Boundaries</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{stats.team.dots}</div>
              <div className="text-gray-600">Dot Balls</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStatistics;