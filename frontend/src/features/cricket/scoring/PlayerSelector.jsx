import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../UI/dialog';
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import cricketAPIService from '../../../services/cricketAPI';

// Batsman Selection Modal
export const BatsmanSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  match, 
  excludePlayerIds = [] 
}) => {
  const [availableBatsmen, setAvailableBatsmen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (isOpen && match) {
      loadAvailableBatsmen();
    }
  }, [isOpen, match, loadAvailableBatsmen]);

  const loadAvailableBatsmen = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current batting team
      const currentInnings = match.innings?.[match.currentInnings - 1];
      if (!currentInnings) return;
      
      const battingTeamId = currentInnings.team;
      const teamData = await cricketAPIService.getTeamById(battingTeamId);
      
      // Filter out players who are already out or currently batting
      const availablePlayers = teamData.players?.filter(player => {
        // Exclude already selected batsmen
        if (excludePlayerIds.includes(player._id)) return false;
        
        // Check if player is already out in current innings
        const playerStats = match.playerStats?.find(stat => 
          stat.playerId === player._id && stat.batting?.isOut
        );
        
        return !playerStats?.batting?.isOut;
      }) || [];
      
      setAvailableBatsmen(availablePlayers);
    } catch (error) {
      console.error('Failed to load available batsmen:', error);
    } finally {
      setLoading(false);
    }
  }, [match, excludePlayerIds]);

  const filteredBatsmen = availableBatsmen.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchTerm)
  );

  const handleSelect = () => {
    if (selectedPlayer && onSelect) {
      onSelect(selectedPlayer);
      onClose();
      setSelectedPlayer(null);
      setSearchTerm('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPlayer(null);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Next Batsman</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <Input
            placeholder="Search by name or jersey number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Player List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4">Loading players...</div>
            ) : filteredBatsmen.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? 'No players found' : 'No available batsmen'}
              </div>
            ) : (
              filteredBatsmen.map((player) => (
                <div
                  key={player._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlayer?._id === player._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-gray-600">
                        {player.role} • Jersey #{player.jerseyNumber}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.battingStyle}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedPlayer}
          >
            Select Batsman
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Bowler Selection Modal
export const BowlerSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  match, 
  currentBowlerId = null 
}) => {
  const [availableBowlers, setAvailableBowlers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (isOpen && match) {
      loadAvailableBowlers();
    }
  }, [isOpen, match, loadAvailableBowlers]);

  const loadAvailableBowlers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current bowling team (opposite of batting team)
      const currentInnings = match.innings?.[match.currentInnings - 1];
      if (!currentInnings) return;
      
      const battingTeamId = currentInnings.team;
      const bowlingTeamId = match.teams.team1 === battingTeamId ? 
        match.teams.team2 : match.teams.team1;
      
      const teamData = await cricketAPIService.getTeamById(bowlingTeamId);
      
      // Filter bowlers based on match rules
      const availablePlayers = teamData.players?.filter(player => {
        // Exclude current bowler
        if (currentBowlerId && player._id === currentBowlerId) return false;
        
        // Check if bowler has completed maximum overs (for limited overs matches)
        if (match.matchType === 'T20' || match.matchType === 'ODI') {
          const maxOvers = match.matchType === 'T20' ? 4 : 10;
          const bowlerStats = match.playerStats?.find(stat => 
            stat.playerId === player._id
          );
          
          if (bowlerStats?.bowling?.overs >= maxOvers) return false;
        }
        
        return true;
      }) || [];
      
      setAvailableBowlers(availablePlayers);
    } catch (error) {
      console.error('Failed to load available bowlers:', error);
    } finally {
      setLoading(false);
    }
  }, [match, currentBowlerId]);

  const filteredBowlers = availableBowlers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchTerm)
  );

  const getBowlerStats = (playerId) => {
    return match.playerStats?.find(stat => stat.playerId === playerId)?.bowling || {
      overs: 0,
      runs: 0,
      wickets: 0,
      economy: 0
    };
  };

  const handleSelect = () => {
    if (selectedPlayer && onSelect) {
      onSelect(selectedPlayer);
      onClose();
      setSelectedPlayer(null);
      setSearchTerm('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPlayer(null);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Bowler</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <Input
            placeholder="Search by name or jersey number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Player List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4">Loading players...</div>
            ) : filteredBowlers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? 'No players found' : 'No available bowlers'}
              </div>
            ) : (
              filteredBowlers.map((player) => {
                const stats = getBowlerStats(player._id);
                return (
                  <div
                    key={player._id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlayer?._id === player._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-600">
                          {player.role} • Jersey #{player.jerseyNumber}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {player.bowlingStyle}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">
                          {stats.overs}-{stats.runs}-{stats.wickets}
                        </div>
                        <div className="text-gray-500">
                          Econ: {stats.economy.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedPlayer}
          >
            Select Bowler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Generic Player Selector (can be used for other scenarios)
export const PlayerSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  players = [], 
  title = "Select Player",
  excludePlayerIds = [],
  showStats = false,
  match = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const filteredPlayers = players.filter(player => {
    if (excludePlayerIds.includes(player._id)) return false;
    return player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           player.jerseyNumber.toString().includes(searchTerm);
  });

  const getPlayerStats = (playerId) => {
    if (!showStats || !match) return null;
    return match.playerStats?.find(stat => stat.playerId === playerId);
  };

  const handleSelect = () => {
    if (selectedPlayer && onSelect) {
      onSelect(selectedPlayer);
      onClose();
      setSelectedPlayer(null);
      setSearchTerm('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPlayer(null);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <Input
            placeholder="Search by name or jersey number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Player List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? 'No players found' : 'No players available'}
              </div>
            ) : (
              filteredPlayers.map((player) => {
                const stats = getPlayerStats(player._id);
                return (
                  <div
                    key={player._id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlayer?._id === player._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-600">
                          {player.role} • Jersey #{player.jerseyNumber}
                        </div>
                      </div>
                      {stats && (
                        <div className="text-right text-sm">
                          {stats.batting && (
                            <div>
                              <div className="font-medium">
                                {stats.batting.runs}({stats.batting.ballsFaced})
                              </div>
                              <div className="text-gray-500">
                                SR: {stats.batting.strikeRate?.toFixed(2) || '0.00'}
                              </div>
                            </div>
                          )}
                          {stats.bowling && (
                            <div>
                              <div className="font-medium">
                                {stats.bowling.overs}-{stats.bowling.runs}-{stats.bowling.wickets}
                              </div>
                              <div className="text-gray-500">
                                Econ: {stats.bowling.economy?.toFixed(2) || '0.00'}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedPlayer}
          >
            Select Player
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};