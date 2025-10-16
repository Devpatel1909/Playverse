import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card';
import { Button } from '../UI/button';

const BallTimeline = ({ match, recentBalls = [], onUndoBall, onEditBall }) => {
  const [selectedBall, setSelectedBall] = useState(null);
  const [showConfirmUndo, setShowConfirmUndo] = useState(null);

  const getBallIcon = (ball) => {
    if (ball.isWicket) return '🔴';
    if (ball.runs === 6) return '🟢';
    if (ball.runs === 4) return '🔵';
    if (ball.ballType === 'wide') return '🟡';
    if (ball.ballType === 'noball') return '🟠';
    if (ball.runs === 0) return '⚪';
    return '⚫';
  };

  const getBallDescription = (ball) => {
    let description = '';
    
    if (ball.isWicket) {
      description = `WICKET: ${ball.wicketType || 'out'}`;
    } else if (ball.ballType === 'wide') {
      description = `Wide ball`;
    } else if (ball.ballType === 'noball') {
      description = `No ball`;
    } else {
      description = `${ball.runs} run${ball.runs !== 1 ? 's' : ''}`;
    }
    
    if (ball.extras > 0) {
      description += ` + ${ball.extras} extra${ball.extras !== 1 ? 's' : ''}`;
    }
    
    return description;
  };

  const formatOverBall = (ballIndex) => {
    const over = Math.floor(ballIndex / 6);
    const ball = ballIndex % 6;
    return `${over}.${ball + 1}`;
  };

  const handleUndoBall = (ballIndex) => {
    if (onUndoBall) {
      onUndoBall(ballIndex);
      setShowConfirmUndo(null);
    }
  };

  const handleEditBall = (ballIndex) => {
    if (onEditBall) {
      onEditBall(ballIndex);
      setSelectedBall(null);
    }
  };

  const groupBallsByOver = (balls) => {
    const overs = {};
    balls.forEach((ball, index) => {
      const overNum = Math.floor(index / 6);
      if (!overs[overNum]) {
        overs[overNum] = [];
      }
      overs[overNum].push({ ...ball, originalIndex: index });
    });
    return overs;
  };

  const calculateOverStats = (overBalls) => {
    const runs = overBalls.reduce((sum, ball) => sum + (ball.runs || 0) + (ball.extras || 0), 0);
    const wickets = overBalls.filter(ball => ball.isWicket).length;
    const boundaries = overBalls.filter(ball => ball.runs === 4 || ball.runs === 6).length;
    return { runs, wickets, boundaries };
  };

  const groupedBalls = groupBallsByOver(recentBalls);
  const overNumbers = Object.keys(groupedBalls).map(Number).sort((a, b) => b - a);

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Ball-by-Ball Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 overflow-y-auto space-y-3">
          {recentBalls.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No balls recorded yet. Start scoring to see the timeline!
            </div>
          ) : (
            overNumbers.map(overNum => {
              const overBalls = groupedBalls[overNum];
              const overStats = calculateOverStats(overBalls);
              
              return (
                <div key={overNum} className="border rounded-lg p-3 bg-gray-50">
                  {/* Over Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">
                      Over {overNum + 1}
                    </h4>
                    <div className="text-xs text-gray-600">
                      {overStats.runs} runs
                      {overStats.wickets > 0 && `, ${overStats.wickets} wicket${overStats.wickets !== 1 ? 's' : ''}`}
                      {overStats.boundaries > 0 && `, ${overStats.boundaries} boundaries`}
                    </div>
                  </div>
                  
                  {/* Balls in Over */}
                  <div className="grid grid-cols-6 gap-2">
                    {overBalls.map((ball, ballIndex) => (
                      <div
                        key={`${overNum}-${ballIndex}`}
                        className={`relative p-2 rounded-md border-2 cursor-pointer transition-all ${
                          selectedBall === ball.originalIndex
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBall(ball.originalIndex)}
                      >
                        {/* Ball Icon */}
                        <div className="text-center">
                          <div className="text-lg mb-1">{getBallIcon(ball)}</div>
                          <div className="text-xs font-medium">
                            {ball.runs || 0}
                            {ball.extras > 0 && `+${ball.extras}`}
                          </div>
                        </div>
                        
                        {/* Ball Number */}
                        <div className="absolute -top-1 -left-1 bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {ballIndex + 1}
                        </div>
                        
                        {/* Wicket Indicator */}
                        {ball.isWicket && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            W
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Empty slots for incomplete over */}
                    {overBalls.length < 6 && [...Array(6 - overBalls.length)].map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="p-2 rounded-md border-2 border-dashed border-gray-300 text-center text-gray-400"
                      >
                        <div className="text-lg">○</div>
                        <div className="text-xs">-</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Ball Details and Actions */}
        {selectedBall !== null && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-sm">
                  Ball {formatOverBall(selectedBall)}
                </h5>
                <p className="text-sm text-gray-700">
                  {getBallDescription(recentBalls[selectedBall])}
                </p>
                {recentBalls[selectedBall]?.batsmanName && (
                  <p className="text-xs text-gray-600 mt-1">
                    Faced by: {recentBalls[selectedBall].batsmanName}
                  </p>
                )}
                {recentBalls[selectedBall]?.bowlerName && (
                  <p className="text-xs text-gray-600">
                    Bowled by: {recentBalls[selectedBall].bowlerName}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBall(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditBall(selectedBall)}
                className="h-8 px-3 text-xs"
                disabled={!onEditBall}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowConfirmUndo(selectedBall)}
                className="h-8 px-3 text-xs"
                disabled={!onUndoBall}
              >
                Undo
              </Button>
            </div>
          </div>
        )}
        
        {/* Confirm Undo Dialog */}
        {showConfirmUndo !== null && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-800 mb-2">
              Are you sure you want to undo ball {formatOverBall(showConfirmUndo)}?
            </div>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUndoBall(showConfirmUndo)}
                className="h-8 px-3 text-xs"
              >
                Yes, Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmUndo(null)}
                className="h-8 px-3 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BallTimeline;