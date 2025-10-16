import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card';
import { Badge } from '../../cricket/UI/badge';

const ScoreCard = ({ match, isLive = false }) => {
  const renderCricketScore = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-900">{match.team1}</span>
          {match.team1Logo && (
            <img src={match.team1Logo} alt={match.team1} className="w-6 h-6 rounded" />
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{match.score1}</div>
          {match.overs1 && (
            <div className="text-sm text-gray-600">({match.overs1} ov)</div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-900">{match.team2}</span>
          {match.team2Logo && (
            <img src={match.team2Logo} alt={match.team2} className="w-6 h-6 rounded" />
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{match.score2}</div>
          {match.overs2 && (
            <div className="text-sm text-gray-600">({match.overs2} ov)</div>
          )}
        </div>
      </div>

      {match.currentBatsman && isLive && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md">
          <div className="text-xs text-blue-800 font-medium">Current Batsmen</div>
          <div className="text-sm text-blue-900">
            {match.currentBatsman.striker} ({match.currentBatsman.strikerRuns}*) • {match.currentBatsman.nonStriker} ({match.currentBatsman.nonStrikerRuns})
          </div>
        </div>
      )}

      {match.currentBowler && isLive && (
        <div className="mt-2 p-2 bg-orange-50 rounded-md">
          <div className="text-xs text-orange-800 font-medium">Current Bowler</div>
          <div className="text-sm text-orange-900">
            {match.currentBowler.name} ({match.currentBowler.overs}-{match.currentBowler.maidens}-{match.currentBowler.runs}-{match.currentBowler.wickets})
          </div>
        </div>
      )}
    </div>
  );

  const renderOtherSportScore = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-900">{match.team1}</span>
          {match.team1Logo && (
            <img src={match.team1Logo} alt={match.team1} className="w-6 h-6 rounded" />
          )}
        </div>
        <div className="text-lg font-bold text-gray-900">{match.score1}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-900">{match.team2}</span>
          {match.team2Logo && (
            <img src={match.team2Logo} alt={match.team2} className="w-6 h-6 rounded" />
          )}
        </div>
        <div className="text-lg font-bold text-gray-900">{match.score2}</div>
      </div>

      {match.time && isLive && (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {match.time}
          </Badge>
        </div>
      )}

      {match.period && (
        <div className="text-center text-sm text-gray-600">
          {match.period}
        </div>
      )}
    </div>
  );

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isLive ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isLive ? (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                LIVE
              </Badge>
            ) : (
              <Badge variant="secondary">{match.status}</Badge>
            )}
            {match.priority && (
              <Badge variant="outline" className="text-xs">
                {match.priority}
              </Badge>
            )}
          </div>
          <Badge variant="outline">{match.sport}</Badge>
        </div>
        
        <CardTitle className="text-base font-medium text-gray-700">
          {match.venue}
        </CardTitle>
        
        {match.tournament && (
          <div className="text-sm text-gray-500">{match.tournament}</div>
        )}
      </CardHeader>
      
      <CardContent>
        {match.sport === 'Cricket' ? renderCricketScore() : renderOtherSportScore()}
        
        {match.result && !isLive && (
          <div className="mt-3 p-2 bg-green-50 rounded-md">
            <div className="text-sm text-green-800 font-medium text-center">
              {match.result}
            </div>
          </div>
        )}

        {match.nextUpdate && isLive && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Next update in {match.nextUpdate}s
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;