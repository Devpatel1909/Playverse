import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../cricket/UI/dialog';
import { Badge } from '../../cricket/UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../cricket/UI/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import publicScoreAPI from '../services/publicScoreAPI';

const MatchDetailsModal = ({ open, onOpenChange, matchId, match }) => {
  const [matchDetails, setMatchDetails] = useState(match || null);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scorecard');

  useEffect(() => {
    if (open && matchId && !match) {
      fetchMatchDetails();
    }
    if (open && match) {
      setMatchDetails(match);
      if (match.sport === 'Cricket' && match.status === 'live') {
        fetchCommentary();
      }
    }
  }, [open, matchId, match]);

  const fetchMatchDetails = async () => {
    setLoading(true);
    try {
      const response = await publicScoreAPI.getMatchDetails(matchId);
      setMatchDetails(response.data);
      
      if (response.data.sport === 'Cricket' && response.data.status === 'live') {
        fetchCommentary();
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentary = async () => {
    try {
      const response = await publicScoreAPI.getCricketCommentary(matchId);
      setCommentary(response.data || []);
    } catch (error) {
      console.error('Error fetching commentary:', error);
    }
  };

  const renderCricketScorecard = () => {
    if (!matchDetails) return null;

    return (
      <div className="space-y-6">
        {/* Current Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{matchDetails.team1}</span>
                  {matchDetails.team1Logo && (
                    <img src={matchDetails.team1Logo} alt={matchDetails.team1} className="w-8 h-8 rounded" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{matchDetails.score1}</div>
                  {matchDetails.overs1 && (
                    <div className="text-sm text-gray-600">({matchDetails.overs1} overs)</div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{matchDetails.team2}</span>
                  {matchDetails.team2Logo && (
                    <img src={matchDetails.team2Logo} alt={matchDetails.team2} className="w-8 h-8 rounded" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{matchDetails.score2}</div>
                  {matchDetails.overs2 && (
                    <div className="text-sm text-gray-600">({matchDetails.overs2} overs)</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Players (if live) */}
        {matchDetails.status === 'live' && matchDetails.currentBatsman && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Partnership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-semibold">{matchDetails.currentBatsman.striker}</div>
                  <div className="text-2xl font-bold text-green-600">{matchDetails.currentBatsman.strikerRuns}*</div>
                  <div className="text-sm text-gray-600">Striker</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-semibold">{matchDetails.currentBatsman.nonStriker}</div>
                  <div className="text-2xl font-bold text-blue-600">{matchDetails.currentBatsman.nonStrikerRuns}</div>
                  <div className="text-sm text-gray-600">Non-Striker</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Bowler (if live) */}
        {matchDetails.status === 'live' && matchDetails.currentBowler && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Bowler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="font-semibold text-lg">{matchDetails.currentBowler.name}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {matchDetails.currentBowler.overs} overs • {matchDetails.currentBowler.maidens} maidens • {matchDetails.currentBowler.runs} runs • {matchDetails.currentBowler.wickets} wickets
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderOtherSportScorecard = () => {
    if (!matchDetails) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Match Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-lg">{matchDetails.team1}</span>
                {matchDetails.team1Logo && (
                  <img src={matchDetails.team1Logo} alt={matchDetails.team1} className="w-8 h-8 rounded" />
                )}
              </div>
              <div className="text-3xl font-bold">{matchDetails.score1}</div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-lg">{matchDetails.team2}</span>
                {matchDetails.team2Logo && (
                  <img src={matchDetails.team2Logo} alt={matchDetails.team2} className="w-8 h-8 rounded" />
                )}
              </div>
              <div className="text-3xl font-bold">{matchDetails.score2}</div>
            </div>

            {matchDetails.time && matchDetails.status === 'live' && (
              <div className="text-center p-2 bg-red-50 rounded">
                <Badge variant="destructive">{matchDetails.time}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCommentary = () => {
    if (commentary.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No commentary available
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {commentary.map((comment, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-sm">{comment.over}</span>
              <span className="text-xs text-gray-500">{comment.time}</span>
            </div>
            <p className="text-sm">{comment.text}</p>
            {comment.runs && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {comment.runs} runs
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMatchInfo = () => {
    if (!matchDetails) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Match Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium">{matchDetails.venue}</span>
            </div>
            {matchDetails.tournament && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tournament:</span>
                <span className="font-medium">{matchDetails.tournament}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={matchDetails.status === 'live' ? 'destructive' : 'secondary'}>
                {matchDetails.status}
              </Badge>
            </div>
            {matchDetails.result && (
              <div className="flex justify-between">
                <span className="text-gray-600">Result:</span>
                <span className="font-medium text-green-600">{matchDetails.result}</span>
              </div>
            )}
            {matchDetails.startTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium">{new Date(matchDetails.startTime).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading match details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!matchDetails) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="text-center py-8 text-gray-500">
            Match details not available
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{matchDetails.team1} vs {matchDetails.team2}</span>
            <Badge variant="outline">{matchDetails.sport}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            {matchDetails.sport === 'Cricket' && matchDetails.status === 'live' && (
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
            )}
            <TabsTrigger value="info">Match Info</TabsTrigger>
          </TabsList>

          <TabsContent value="scorecard" className="mt-4">
            {matchDetails.sport === 'Cricket' 
              ? renderCricketScorecard() 
              : renderOtherSportScorecard()
            }
          </TabsContent>

          {matchDetails.sport === 'Cricket' && matchDetails.status === 'live' && (
            <TabsContent value="commentary" className="mt-4">
              {renderCommentary()}
            </TabsContent>
          )}

          <TabsContent value="info" className="mt-4">
            {renderMatchInfo()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MatchDetailsModal;