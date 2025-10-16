import React, { useState, useEffect } from 'react';
import { Badge } from '../../cricket/UI/badge';

const LiveScoreTicker = ({ matches = [], autoScroll = true, scrollSpeed = 50 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoScroll || matches.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % matches.length);
    }, scrollSpeed * 100);

    return () => clearInterval(interval);
  }, [autoScroll, matches.length, scrollSpeed, isHovered]);

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-gray-800 text-white py-2 px-4">
        <div className="flex items-center justify-center">
          <span className="text-sm">No live matches at the moment</span>
        </div>
      </div>
    );
  }

  const formatScoreForTicker = (match) => {
    if (match.sport === 'Cricket') {
      return `${match.team1} ${match.score1} vs ${match.team2} ${match.score2}`;
    }
    return `${match.team1} ${match.score1} - ${match.score2} ${match.team2}`;
  };

  return (
    <div 
      className="bg-red-600 text-white py-2 px-4 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-6">
        {/* Live indicator */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-bold text-sm">LIVE</span>
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${matches.length * 100}%`
            }}
          >
            {matches.map((match, index) => (
              <div 
                key={match.id || index} 
                className="flex-shrink-0 flex items-center space-x-4"
                style={{ width: `${100 / matches.length}%` }}
              >
                <Badge variant="outline" className="bg-white text-red-600 text-xs">
                  {match.sport}
                </Badge>
                <span className="text-sm font-medium truncate">
                  {formatScoreForTicker(match)}
                </span>
                {match.venue && (
                  <span className="text-xs opacity-75 truncate">
                    @ {match.venue}
                  </span>
                )}
                {match.time && (
                  <span className="text-xs opacity-75">
                    {match.time}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        {matches.length > 1 && (
          <div className="flex space-x-1 flex-shrink-0">
            {matches.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveScoreTicker;