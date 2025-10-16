import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card';
import { Button } from '../UI/button';
import { Input } from '../UI/input';

const CommentarySystem = ({ matchId, match, recentBalls = [] }) => {
  const [commentary, setCommentary] = useState([]);
  const [manualComment, setManualComment] = useState('');
  const [isAutoCommentary, setIsAutoCommentary] = useState(true);
  const commentaryEndRef = useRef(null);

  // Auto-scroll to latest commentary
  useEffect(() => {
    commentaryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commentary]);

  // Generate auto-commentary based on ball data
  const generateAutoCommentary = (ballData) => {
    const { runs, ballType, isWicket, wicketType, batsmanName, bowlerName } = ballData;
    
    let comment = '';
    const timestamp = new Date().toLocaleTimeString();
    
    if (isWicket) {
      const wicketComments = {
        bowled: `What a delivery! ${batsmanName} is bowled by ${bowlerName}! The stumps are shattered!`,
        caught: `In the air... and taken! ${batsmanName} departs, caught by a brilliant catch. ${bowlerName} strikes!`,
        lbw: `That's plumb! ${batsmanName} is trapped in front. The umpire raises the finger for LBW.`,
        runout: `Direct hit! ${batsmanName} is run out by yards. Brilliant fielding!`,
        stumped: `Lightning fast work behind the stumps! ${batsmanName} is stumped!`,
        hitwicket: `Unfortunate! ${batsmanName} dislodges the bails and is out hit wicket.`
      };
      comment = wicketComments[wicketType] || `${batsmanName} is out! What a breakthrough for the bowling side!`;
    } else {
      switch (runs) {
        case 0:
          comment = ballType === 'wide' 
            ? `Wide ball! That's going down the leg side for an extra run.`
            : ballType === 'noball'
            ? `No ball! Free hit coming up next.`
            : `Dot ball. ${bowlerName} maintains the pressure on ${batsmanName}.`;
          break;
        case 1:
          comment = `Single taken. ${batsmanName} works it into the gap for a comfortable single.`;
          break;
        case 2:
          comment = `Two runs! ${batsmanName} finds the gap and comes back for the second.`;
          break;
        case 3:
          comment = `Three runs! Excellent running between the wickets by ${batsmanName}.`;
          break;
        case 4:
          comment = `FOUR! Beautiful shot by ${batsmanName}! The ball races away to the boundary.`;
          break;
        case 6:
          comment = `SIX! What a shot! ${batsmanName} sends it sailing over the boundary for a maximum!`;
          break;
        default:
          comment = `${runs} runs scored by ${batsmanName}.`;
      }
    }
    
    return {
      id: Date.now(),
      timestamp,
      text: comment,
      type: isWicket ? 'wicket' : runs >= 4 ? 'boundary' : 'normal',
      over: ballData.over || 0,
      ball: ballData.ball || 0
    };
  };

  // Add commentary when new ball is recorded
  useEffect(() => {
    if (recentBalls.length > 0 && isAutoCommentary) {
      const latestBall = recentBalls[recentBalls.length - 1];
      const autoComment = generateAutoCommentary(latestBall);
      setCommentary(prev => [...prev, autoComment]);
    }
  }, [recentBalls, isAutoCommentary]);

  const handleManualComment = (e) => {
    e.preventDefault();
    if (manualComment.trim()) {
      const comment = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        text: manualComment.trim(),
        type: 'manual',
        over: match?.currentInnings?.overs || 0,
        ball: match?.currentInnings?.balls || 0
      };
      setCommentary(prev => [...prev, comment]);
      setManualComment('');
    }
  };

  const clearCommentary = () => {
    setCommentary([]);
  };

  const getCommentaryIcon = (type) => {
    switch (type) {
      case 'wicket':
        return '🔴';
      case 'boundary':
        return '🟢';
      case 'manual':
        return '💬';
      default:
        return '⚪';
    }
  };

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Commentary</CardTitle>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={isAutoCommentary}
                onChange={(e) => setIsAutoCommentary(e.target.checked)}
                className="rounded"
              />
              <span>Auto</span>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCommentary}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Commentary Display */}
        <div className="h-48 overflow-y-auto border rounded-md p-2 mb-3 bg-gray-50 space-y-2">
          {commentary.length === 0 ? (
            <div className="text-gray-500 text-sm text-center mt-8">
              No commentary yet. Start scoring to see live updates!
            </div>
          ) : (
            commentary.map((comment) => (
              <div key={comment.id} className="text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-xs">{getCommentaryIcon(comment.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                      <span>{comment.timestamp}</span>
                      <span>Over {comment.over}.{comment.ball}</span>
                      {comment.type === 'manual' && (
                        <span className="bg-blue-100 text-blue-700 px-1 rounded">Manual</span>
                      )}
                    </div>
                    <div className={`text-sm ${
                      comment.type === 'wicket' ? 'text-red-700 font-medium' :
                      comment.type === 'boundary' ? 'text-green-700 font-medium' :
                      comment.type === 'manual' ? 'text-blue-700' :
                      'text-gray-700'
                    }`}>
                      {comment.text}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={commentaryEndRef} />
        </div>

        {/* Manual Commentary Input */}
        <form onSubmit={handleManualComment} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Add manual commentary..."
            value={manualComment}
            onChange={(e) => setManualComment(e.target.value)}
            className="flex-1 h-9 text-sm"
          />
          <Button 
            type="submit" 
            size="sm"
            className="h-9 px-3"
            disabled={!manualComment.trim()}
          >
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentarySystem;