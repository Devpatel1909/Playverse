import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card';
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import cricketAPIService from '../../../services/cricketAPI';
import cricketScoringAPIService from '../../../services/cricketScoringAPI';
import { BatsmanSelector, BowlerSelector } from './PlayerSelector';
import ScoreBoard from './ScoreBoard';
import CommentarySystem from './CommentarySystem';
import LiveStatistics from './LiveStatistics';
import BallTimeline from './BallTimeline';
import ErrorRecoveryPanel from '../../../components/scoring/ErrorRecoveryPanel';

const ScoreUpdatePage = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentBalls, setRecentBalls] = useState([]);
  
  // Ball input form state
  const [ballData, setBallData] = useState({
    runs: 0,
    ballType: 'normal',
    isWicket: false,
    wicketType: '',
    extras: 0
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Modal states
  const [showBatsmanSelector, setShowBatsmanSelector] = useState(false);
  const [showBowlerSelector, setShowBowlerSelector] = useState(false);
  const [showErrorRecovery, setShowErrorRecovery] = useState(false);

  const loadMatch = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading match with ID:', matchId);
      const matchData = await cricketAPIService.getMatchById(matchId);
      const match = matchData?.data || matchData; // Handle different response formats
      console.log('Match data received:', match);
      setMatch(match);
      setError(null);
    } catch (err) {
      console.error('Error loading match:', err);
      setError(`Failed to load match data: ${err.message}`);
      // For development, create a mock match if backend is down
      if (err.message.includes('Route not found') || err.message.includes('fetch')) {
        console.log('Backend appears to be down, creating mock match data');
        const mockMatch = {
          _id: matchId,
          teamA: { _id: '1', name: 'Team A', shortName: 'TMA' },
          teamB: { _id: '2', name: 'Team B', shortName: 'TMB' },
          venue: 'Test Venue',
          date: new Date().toISOString(),
          status: 'live',
          score: {
            teamA: { runs: 0, wickets: 0 },
            teamB: { runs: 0, wickets: 0 },
            overs: '0.0'
          }
        };
        setMatch(mockMatch);
        setError('Backend server is not running. Using mock data for development.');
      }
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (matchId) {
      loadMatch();
    }
  }, [matchId, loadMatch]);

  const validateBallInput = () => {
    const errors = {};
    
    if (ballData.runs < 0 || ballData.runs > 6) {
      errors.runs = 'Runs must be between 0 and 6';
    }
    
    if (ballData.ballType === 'wide' || ballData.ballType === 'noball') {
      if (ballData.extras < 1) {
        errors.extras = 'Extras must be at least 1 for wides and no-balls';
      }
    }
    
    if (ballData.isWicket && !ballData.wicketType) {
      errors.wicketType = 'Wicket type is required when recording a wicket';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBallSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBallInput()) {
      return;
    }
    
    try {
      await cricketScoringAPIService.recordBall(matchId, ballData);
      
      // Add ball to recent balls for timeline
      const ballRecord = {
        ...ballData,
        timestamp: new Date().toISOString(),
        batsmanName: match?.currentBatsmen?.striker?.name,
        bowlerName: match?.currentBowler?.name,
        over: Math.floor(recentBalls.length / 6),
        ball: recentBalls.length % 6
      };
      setRecentBalls(prev => [...prev, ballRecord]);
      
      // Reset form
      setBallData({
        runs: 0,
        ballType: 'normal',
        isWicket: false,
        wicketType: '',
        extras: 0
      });
      
      // Reload match data
      await loadMatch();
    } catch (err) {
      setError('Failed to record ball');
      console.error('Error recording ball:', err);
    }
  };

  const handleQuickScore = async (runs) => {
    const quickBallData = {
      ...ballData,
      runs,
      ballType: 'normal'
    };
    
    try {
      await cricketScoringAPIService.recordBall(matchId, quickBallData);
      
      // Add ball to recent balls
      const ballRecord = {
        ...quickBallData,
        timestamp: new Date().toISOString(),
        batsmanName: match?.currentBatsmen?.striker?.name,
        bowlerName: match?.currentBowler?.name,
        over: Math.floor(recentBalls.length / 6),
        ball: recentBalls.length % 6
      };
      setRecentBalls(prev => [...prev, ballRecord]);
      
      await loadMatch();
      
      // Check if wicket fell and show batsman selector
      if (quickBallData.isWicket) {
        setShowBatsmanSelector(true);
      }
    } catch (err) {
      setError('Failed to record quick score');
      console.error('Error recording quick score:', err);
    }
  };

  const handleUndoBall = async (ballIndex) => {
    try {
      await cricketScoringAPIService.undoBall(matchId, ballIndex);
      
      // Remove ball from recent balls
      setRecentBalls(prev => prev.slice(0, ballIndex));
      
      await loadMatch();
    } catch (err) {
      setError('Failed to undo ball');
      console.error('Error undoing ball:', err);
    }
  };

  const handleEditBall = async (ballIndex) => {
    // This would open an edit dialog - for now just log
    console.log('Edit ball at index:', ballIndex);
    // TODO: Implement ball editing functionality
  };

  const handleBatsmanSelect = async (selectedBatsman) => {
    try {
      await cricketScoringAPIService.updateBatsmen(matchId, {
        newBatsman: selectedBatsman._id
      });
      await loadMatch();
    } catch (err) {
      setError('Failed to update batsman');
      console.error('Error updating batsman:', err);
    }
  };

  const handleBowlerSelect = async (selectedBowler) => {
    try {
      await cricketScoringAPIService.updateBowler(matchId, {
        newBowler: selectedBowler._id
      });
      await loadMatch();
    } catch (err) {
      setError('Failed to update bowler');
      console.error('Error updating bowler:', err);
    }
  };

  const handleSwitchBatsmen = async () => {
    try {
      await cricketScoringAPIService.updateBatsmen(matchId, {
        switchBatsmen: true
      });
      await loadMatch();
    } catch (err) {
      setError('Failed to switch batsmen');
      console.error('Error switching batsmen:', err);
    }
  };

  const handleCompleteOver = async () => {
    try {
      await cricketScoringAPIService.completeOver(matchId);
      await loadMatch();
    } catch (err) {
      setError('Failed to complete over');
      console.error('Error completing over:', err);
    }
  };

  const handleEndInnings = async () => {
    try {
      await cricketScoringAPIService.endInnings(matchId);
      await loadMatch();
    } catch (err) {
      setError('Failed to end innings');
      console.error('Error ending innings:', err);
    }
  };

  const handleEndMatch = async () => {
    if (confirm('Are you sure you want to end this match?')) {
      try {
        await cricketScoringAPIService.endMatch(matchId, {
          result: 'Match ended by scorer'
        });
        await loadMatch();
      } catch (err) {
        setError('Failed to end match');
        console.error('Error ending match:', err);
      }
    }
  };

  const getCurrentInnings = () => {
    if (!match || !match.innings || match.innings.length === 0) {
      return null;
    }
    return match.innings[match.currentInnings - 1];
  };

  const formatOvers = (overs, balls) => {
    return `${overs}.${balls}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-center">
          <div className="mb-2 text-lg">Loading match...</div>
          <div className="text-sm text-gray-400">Match ID: {matchId}</div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <Card className="bg-gray-800 border-gray-700 w-96">
          <CardContent className="p-6">
            <div className="space-y-4 text-center">
              <div className="text-lg font-semibold">Match Not Found</div>
              <div className="text-sm text-gray-400">Match ID: {matchId}</div>
              {error && (
                <div className="p-3 text-sm text-yellow-400 rounded bg-yellow-900/20">
                  {error}
                </div>
              )}
              <Button 
                onClick={loadMatch} 
                className="w-full"
              >
                Retry Loading Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentInnings = getCurrentInnings();

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {error && (
        <div className="max-w-6xl mx-auto mb-4">
          <div className="p-4 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            <div className="flex">
              <div className="flex-1">
                <p className="text-sm font-medium">Warning</p>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-yellow-500 hover:text-yellow-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Match Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {match.teams?.team1?.name || 'Team 1'} vs {match.teams?.team2?.name || 'Team 2'}
            </CardTitle>
            <div className="text-sm text-center text-gray-600">
              {match.venue} • {new Date(match.matchDate).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
              <div>
                <div className="text-2xl font-bold">
                  {currentInnings?.score?.runs || 0}/{currentInnings?.score?.wickets || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {formatOvers(currentInnings?.score?.overs || 0, currentInnings?.score?.balls || 0)} overs
                </div>
              </div>
              <div>
                <div className="text-lg">Innings {match.currentInnings || 1}</div>
                <div className="text-sm text-gray-600">
                  Status: {match.status || 'Live'}
                </div>
              </div>
              <div>
                <div className="text-sm">
                  <div>Striker: {match.currentBatsmen?.striker?.name || 'N/A'}</div>
                  <div>Non-Striker: {match.currentBatsmen?.nonStriker?.name || 'N/A'}</div>
                  <div>Bowler: {match.currentBowler?.name || 'N/A'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Left Column - Ball Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Record Ball</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBallSubmit} className="space-y-4">
                
                {/* Quick Score Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickScore(0)}
                    className="h-12"
                  >
                    0
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickScore(1)}
                    className="h-12"
                  >
                    1
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickScore(2)}
                    className="h-12"
                  >
                    2
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickScore(3)}
                    className="h-12"
                  >
                    3
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickScore(4)}
                    className="h-12 text-green-700 border-green-300 bg-green-50 hover:bg-green-100"
                  >
                    4
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickScore(6)}
                    className="h-12 text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100"
                  >
                    6
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setBallData({...ballData, ballType: 'wide', extras: 1})}
                    className="h-12 text-yellow-700 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                  >
                    Wd
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setBallData({...ballData, ballType: 'noball', extras: 1})}
                    className="h-12 text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100"
                  >
                    NB
                  </Button>
                </div>

                {/* Detailed Input */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Runs</label>
                    <Input
                      type="number"
                      min="0"
                      max="6"
                      value={ballData.runs}
                      onChange={(e) => setBallData({...ballData, runs: parseInt(e.target.value) || 0})}
                      className={formErrors.runs ? 'border-red-500' : ''}
                    />
                    {formErrors.runs && (
                      <div className="mt-1 text-xs text-red-500">{formErrors.runs}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Ball Type</label>
                    <select
                      value={ballData.ballType}
                      onChange={(e) => setBallData({...ballData, ballType: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="wide">Wide</option>
                      <option value="noball">No Ball</option>
                      <option value="bye">Bye</option>
                      <option value="legbye">Leg Bye</option>
                    </select>
                  </div>
                </div>

                {(ballData.ballType === 'wide' || ballData.ballType === 'noball') && (
                  <div>
                    <label className="block mb-1 text-sm font-medium">Extras</label>
                    <Input
                      type="number"
                      min="1"
                      value={ballData.extras}
                      onChange={(e) => setBallData({...ballData, extras: parseInt(e.target.value) || 1})}
                      className={formErrors.extras ? 'border-red-500' : ''}
                    />
                    {formErrors.extras && (
                      <div className="mt-1 text-xs text-red-500">{formErrors.extras}</div>
                    )}
                  </div>
                )}

                {/* Wicket Section */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={ballData.isWicket}
                      onChange={(e) => setBallData({...ballData, isWicket: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Wicket</span>
                  </label>
                  
                  {ballData.isWicket && (
                    <div>
                      <label className="block mb-1 text-sm font-medium">Wicket Type</label>
                      <select
                        value={ballData.wicketType}
                        onChange={(e) => setBallData({...ballData, wicketType: e.target.value})}
                        className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.wicketType ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select wicket type</option>
                        <option value="bowled">Bowled</option>
                        <option value="caught">Caught</option>
                        <option value="lbw">LBW</option>
                        <option value="runout">Run Out</option>
                        <option value="stumped">Stumped</option>
                        <option value="hitwicket">Hit Wicket</option>
                      </select>
                      {formErrors.wicketType && (
                        <div className="mt-1 text-xs text-red-500">{formErrors.wicketType}</div>
                      )}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Record Ball
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Match Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Match Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={handleSwitchBatsmen}
                >
                  Switch Batsmen
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => setShowBowlerSelector(true)}
                >
                  Change Bowler
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={handleCompleteOver}
                >
                  Complete Over
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={handleEndInnings}
                >
                  End Innings
                </Button>
              </div>
              
              <div className="pt-4 space-y-2 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowErrorRecovery(true)}
                >
                  Error Recovery & Corrections
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleEndMatch}
                >
                  End Match
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Middle Column - Live Statistics */}
          <div className="space-y-6">
            <LiveStatistics match={match} recentBalls={recentBalls} />
          </div>

          {/* Right Column - Commentary & Timeline */}
          <div className="space-y-6">
            <CommentarySystem 
              matchId={matchId} 
              match={match} 
              recentBalls={recentBalls} 
            />
            <BallTimeline 
              match={match}
              recentBalls={recentBalls}
              onUndoBall={handleUndoBall}
              onEditBall={handleEditBall}
            />
          </div>
        </div>

        {/* ScoreBoard Component - Full Width */}
        <div className="w-full">
          <ScoreBoard 
            matchId={matchId} 
            match={match} 
            onMatchUpdate={setMatch}
          />
        </div>

        {/* Player Selection Modals */}
        <BatsmanSelector
          isOpen={showBatsmanSelector}
          onClose={() => setShowBatsmanSelector(false)}
          onSelect={handleBatsmanSelect}
          match={match}
          excludePlayerIds={[
            match?.currentBatsmen?.striker?._id,
            match?.currentBatsmen?.nonStriker?._id
          ].filter(Boolean)}
        />

        <BowlerSelector
          isOpen={showBowlerSelector}
          onClose={() => setShowBowlerSelector(false)}
          onSelect={handleBowlerSelect}
          match={match}
          currentBowlerId={match?.currentBowler?._id}
        />

        {/* Error Recovery Panel */}
        {showErrorRecovery && (
          <ErrorRecoveryPanel
            matchId={matchId}
            onClose={() => setShowErrorRecovery(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ScoreUpdatePage;