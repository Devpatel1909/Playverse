import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { ArrowLeft, Radio, Trophy, Users, MapPin, Calendar, Clock, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import cricketAPI from '../../../services/cricketAPI';
import { io } from 'socket.io-client';

// Utility Functions
const formatOvers = (deliveries) => {
  const legal = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
  const overs = Math.floor(legal / 6);
  const balls = legal % 6;
  return `${overs}.${balls}`;
};

const calcRR = (runs, deliveries) => {
  const legal = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
  const overs = legal / 6;
  return overs === 0 ? 0 : parseFloat((runs / overs).toFixed(2));
};

// Components
function TeamStrip({ name, score, wickets, overs, right, muted = false, isLive = false }) {
  return (
    <div className={`flex items-center ${right ? "justify-end" : "justify-start"} gap-4`}>
      {!right && <div className="text-lg font-semibold text-gray-900 truncate md:text-xl">{name}</div>}
      <div className={`px-4 py-2 rounded-2xl shadow-sm border ${muted ? "bg-gray-50 text-gray-400 border-gray-300" : isLive ? "bg-green-50 text-green-900 border-green-500 ring-2 ring-green-200" : "bg-white text-gray-900 border-gray-900"}`}>
        <div className="text-2xl font-bold tabular-nums">{score}/{wickets}</div>
        <div className={`text-xs ${muted ? "text-gray-400" : "text-gray-600"}`}>{overs} ov</div>
      </div>
      {right && <div className="text-lg font-semibold text-right text-gray-900 truncate md:text-xl">{name}</div>}
    </div>
  );
}

function ScoreStrip({ total, wickets, overs, rr, target = null }) {
  return (
    <Card className="border-2 border-gray-900 shadow-lg rounded-2xl">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-4xl font-extrabold text-gray-900 tabular-nums">{total}/{wickets}</div>
          <div className="flex gap-4 text-sm">
            <div className="text-gray-600">Overs: <span className="font-semibold text-gray-900">{overs}</span></div>
            <div className="text-gray-600">CRR: <span className="font-semibold text-gray-900">{rr}</span></div>
            {target && (
              <div className="text-gray-600">Need: <span className="font-semibold text-green-600">{target - total} runs</span></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverProgress({ deliveries }) {
  const legal = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL");
  const ballsInCurrentOver = legal.length % 6;
  const currentOverNum = Math.floor(legal.length / 6);
  
  const allInCurrentOver = deliveries.filter((d, i) => {
    const legalBefore = deliveries.slice(0, i).filter(dd => dd.type !== "WIDE" && dd.type !== "NOBALL").length;
    const overNum = Math.floor(legalBefore / 6);
    return overNum === currentOverNum;
  });

  return (
    <Card className="border-gray-300 shadow-md rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Current Over
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="flex flex-wrap gap-2">
          {allInCurrentOver.map((d, i) => {
            let label = "";
            let bgColor = "bg-gray-900 text-white border-gray-900";
            
            if (d.type === "WICKET") {
              label = "W";
              bgColor = "bg-red-600 text-white border-red-600";
            } else if (d.type === "WIDE") {
              label = d.runs > 1 ? `WD+${d.runs - 1}` : "WD";
              bgColor = "bg-orange-600 text-white border-orange-600";
            } else if (d.type === "NOBALL") {
              label = d.batsmanRuns > 0 ? `NB+${d.batsmanRuns}` : "NB";
              bgColor = "bg-red-600 text-white border-red-600";
            } else if (d.type === "BYE") {
              label = d.runs > 0 ? `B${d.runs}` : "B";
              bgColor = "bg-blue-600 text-white border-blue-600";
            } else if (d.type === "LEGBYE") {
              label = d.runs > 0 ? `LB${d.runs}` : "LB";
              bgColor = "bg-indigo-600 text-white border-indigo-600";
            } else {
              label = d.batsmanRuns;
              if (d.batsmanRuns === 6) bgColor = "bg-purple-600 text-white border-purple-600";
              else if (d.batsmanRuns === 4) bgColor = "bg-blue-700 text-white border-blue-700";
            }

            return (
              <div key={i} className={`w-12 h-12 rounded-xl border-2 grid place-items-center text-sm font-bold tabular-nums ${bgColor} transform transition-all hover:scale-110`}>
                {label}
              </div>
            );
          })}

          {Array.from({ length: Math.max(0, 6 - ballsInCurrentOver) }).map((_, i) => (
            <div key={`empty-${i}`} className="grid w-12 h-12 text-sm font-bold text-gray-300 border-2 border-gray-200 border-dashed bg-gray-50 rounded-xl place-items-center tabular-nums">
              ·
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-600">
          <span className="font-semibold text-orange-600">WD</span> = Wide,&nbsp;
          <span className="font-semibold text-red-600">NB</span> = No Ball,&nbsp;
          <span className="font-semibold text-blue-600">B</span> = Byes,&nbsp;
          <span className="font-semibold text-indigo-600">LB</span> = Leg Byes,&nbsp;
          <span className="font-semibold text-red-600">W</span> = Wicket
        </div>
      </CardContent>
    </Card>
  );
}

function BattingTable({ deliveries, players, strikerId, nonStrikerId }) {
  const stats = useMemo(() => {
    const map = new Map();
    // Map both id and _id to handle different formats
    players.forEach((p) => {
      const playerId = p.id || p._id;
      map.set(playerId, { runs: 0, balls: 0, fours: 0, sixes: 0, out: false });
      // Also map string version of _id if it's an ObjectId
      if (p._id && typeof p._id === 'object') {
        map.set(p._id.toString(), { runs: 0, balls: 0, fours: 0, sixes: 0, out: false });
      }
    });
    deliveries.forEach((d) => {
      let s = map.get(d.strikerId);
      // Try string version if not found
      if (!s && d.strikerId) {
        s = map.get(d.strikerId.toString());
      }
      if (s) {
        if (d.type !== "WIDE" && d.type !== "NOBALL") {
          s.balls += 1;
        }
        s.runs += d.batsmanRuns || 0;
        if (d.batsmanRuns === 4) s.fours += 1;
        if (d.batsmanRuns === 6) s.sixes += 1;
        if (d.type === "WICKET") s.out = true;
      }
    });
    return map;
  }, [deliveries, players]);

  const renderRow = (p) => {
    const playerId = p.id || p._id || (p._id && p._id.toString());
    const s = stats.get(playerId) || stats.get(playerId?.toString()) || { runs: 0, balls: 0, fours: 0, sixes: 0, out: false };
    const isOnStrike = playerId === strikerId || playerId === nonStrikerId || 
                       playerId?.toString() === strikerId?.toString() || 
                       playerId?.toString() === nonStrikerId?.toString();
    
    const sr = s.balls ? ((s.runs / s.balls) * 100).toFixed(1) : "0.0";
    const hasBatted = s.runs > 0 || s.balls > 0 || s.out;
    
    return (
      <TableRow key={playerId} className={isOnStrike ? "bg-green-50 border-l-4 border-l-green-500" : hasBatted ? "" : "opacity-60"}>
        <TableCell className="font-medium text-gray-900">
          <div className="flex items-center gap-2">
            <span>{p.name}</span>
            {(playerId === strikerId || playerId?.toString() === strikerId?.toString()) && <Badge className="text-xs text-white bg-green-600 hover:bg-green-700 animate-pulse">Batting</Badge>}
            {(playerId === nonStrikerId || playerId?.toString() === nonStrikerId?.toString()) && <Badge className="text-xs text-white bg-green-500" variant="secondary">Batting</Badge>}
            {!hasBatted && !isOnStrike && <Badge variant="outline" className="text-xs text-gray-500">Yet to bat</Badge>}
          </div>
          <div className="text-xs text-gray-500">{p.role || 'Player'}</div>
        </TableCell>
        <TableCell className="font-semibold text-right text-gray-900 tabular-nums">{s.runs}</TableCell>
        <TableCell className="text-right text-gray-700 tabular-nums">{s.balls}</TableCell>
        <TableCell className="text-right text-gray-700 tabular-nums">{s.fours}</TableCell>
        <TableCell className="text-right text-gray-700 tabular-nums">{s.sixes}</TableCell>
        <TableCell className="font-medium text-right text-gray-900 tabular-nums">{sr}</TableCell>
        <TableCell className="text-right">
          <Badge variant={s.out ? "destructive" : "secondary"} className="text-xs">
            {s.out ? "Out" : "Not out"}
          </Badge>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-bold text-gray-900">Batsman</TableHead>
            <TableHead className="font-bold text-right text-gray-900">R</TableHead>
            <TableHead className="font-bold text-right text-gray-900">B</TableHead>
            <TableHead className="font-bold text-right text-gray-900">4s</TableHead>
            <TableHead className="font-bold text-right text-gray-900">6s</TableHead>
            <TableHead className="font-bold text-right text-gray-900">SR</TableHead>
            <TableHead className="font-bold text-right text-gray-900">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.slice(0, 11).map((p) => renderRow(p)).filter(Boolean)}
        </TableBody>
      </Table>
    </div>
  );
}

function BowlingTable({ deliveries, players, currentBowlerId }) {
  const stats = useMemo(() => {
    const map = new Map();
    players.forEach((p) => {
      const playerId = p.id || p._id;
      map.set(playerId, { ov: 0, runs: 0, wkts: 0, maidens: 0, balls: 0, dots: 0, wides: 0, noBalls: 0 });
      // Also map string version
      if (p._id && typeof p._id === 'object') {
        map.set(p._id.toString(), { ov: 0, runs: 0, wkts: 0, maidens: 0, balls: 0, dots: 0, wides: 0, noBalls: 0 });
      }
    });

    const groupedByOver = new Map();

    deliveries.forEach((d) => {
      let s = map.get(d.bowlerId);
      if (!s && d.bowlerId) {
        s = map.get(d.bowlerId.toString());
      }
      if (!s) return;
      s.runs += d.runs || 0;
      if (d.type !== "WIDE" && d.type !== "NOBALL") {
        s.balls += 1;
      }
      if (d.type === "WICKET") s.wkts += 1;
      if ((d.batsmanRuns === 0 || !d.batsmanRuns) && d.type !== "WIDE" && d.type !== "NOBALL") s.dots += 1;
      
      if (d.type === "WIDE") s.wides += 1;
      if (d.type === "NOBALL") s.noBalls += 1;

      const list = groupedByOver.get(d.over) || [];
      list.push(d);
      groupedByOver.set(d.over, list);
    });

    groupedByOver.forEach((balls) => {
      const bowlerId = balls[0]?.bowlerId;
      if (!bowlerId) return;
      let s = map.get(bowlerId);
      // Try string version if not found
      if (!s && bowlerId) {
        s = map.get(bowlerId.toString());
      }
      if (!s) return;
      const legalRuns = balls.reduce((acc, d) => acc + (d.type === "WIDE" || d.type === "NOBALL" ? 0 : (d.runs || 0)), 0);
      const isMaiden = legalRuns === 0 && balls.filter(b => b.type !== "WIDE" && b.type !== "NOBALL").length === 6;
      if (isMaiden) s.maidens += 1;
    });

    // Calculate overs for all players with stats
    map.forEach((s) => {
      s.ov = Math.floor(s.balls / 6) + (s.balls % 6) / 10;
    });

    return map;
  }, [deliveries, players]);

  const renderRow = (p) => {
    const playerId = p.id || p._id || (p._id && p._id.toString());
    const s = stats.get(playerId) || stats.get(playerId?.toString()) || { ov: 0, runs: 0, wkts: 0, maidens: 0, balls: 0, dots: 0, wides: 0, noBalls: 0 };
    const isCurrent = playerId === currentBowlerId || playerId?.toString() === currentBowlerId?.toString();
    const hasBowled = s.balls > 0;
    
    const eco = s.balls ? (s.runs / (s.balls / 6)).toFixed(2) : "0.00";
    const extras = s.wides + s.noBalls;
    
    return (
      <TableRow key={playerId} className={isCurrent ? "bg-blue-50 border-l-4 border-l-blue-500" : hasBowled ? "" : "opacity-60"}>
        <TableCell className="font-medium text-gray-900">
          <div className="flex items-center gap-2">
            <span>{p.name}</span>
            {isCurrent && <Badge className="text-xs text-white bg-blue-600 hover:bg-blue-700 animate-pulse">Bowling</Badge>}
            {!hasBowled && !isCurrent && <Badge variant="outline" className="text-xs text-gray-500">Yet to bowl</Badge>}
          </div>
          <div className="text-xs text-gray-500">{p.role || 'Player'}</div>
        </TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.ov.toFixed(1)}</TableCell>
        <TableCell className="text-right text-gray-700 tabular-nums">{s.maidens}</TableCell>
        <TableCell className="font-semibold text-right text-gray-900 tabular-nums">{s.runs}</TableCell>
        <TableCell className="font-semibold text-right text-gray-900 tabular-nums">{s.wkts}</TableCell>
        <TableCell className="font-medium text-right text-gray-900 tabular-nums">{eco}</TableCell>
        <TableCell className="text-right text-gray-700 tabular-nums">{s.dots}</TableCell>
        <TableCell className="text-right text-gray-700 tabular-nums">{extras}</TableCell>
      </TableRow>
    );
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-bold text-gray-900">Bowler</TableHead>
            <TableHead className="font-bold text-right text-gray-900">O</TableHead>
            <TableHead className="font-bold text-right text-gray-900">M</TableHead>
            <TableHead className="font-bold text-right text-gray-900">R</TableHead>
            <TableHead className="font-bold text-right text-gray-900">W</TableHead>
            <TableHead className="font-bold text-right text-gray-900">Econ</TableHead>
            <TableHead className="font-bold text-right text-gray-900">Dots</TableHead>
            <TableHead className="font-bold text-right text-gray-900">Ex</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.slice(0, 11).map((p) => renderRow(p)).filter(Boolean)}
        </TableBody>
      </Table>
    </div>
  );
}

const Commentary = ({ deliveries, players }) => {
  const name = (id) => {
    const player = players.find((p) => {
      const playerId = p.id || p._id || (p._id && p._id.toString());
      return playerId === id || playerId?.toString() === id?.toString();
    });
    return player?.name || "—";
  };
  const items = [...deliveries].reverse();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-4 text-gray-400">
          <Radio className="w-full h-full" />
        </div>
        <p className="text-lg font-semibold text-gray-900">No Commentary Available</p>
        <p className="mt-2 text-sm text-gray-600">Ball-by-ball commentary will appear here once the match starts.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="pr-2 h-96">
      <ul className="grid gap-3">
        {items.map((d) => (
          <li key={d.id} className="flex items-start gap-3 p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
            <Badge variant="secondary" className="font-mono text-white bg-gray-900 rounded-xl shrink-0">
              {d.over}.{d.ball + 1}
            </Badge>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {name(d.strikerId)} vs {name(d.bowlerId)} 
                {d.type === "WICKET" ? (
                  <span className="ml-2 font-bold text-red-600">WICKET!</span>
                ) : (
                  <span className="ml-2 font-semibold text-green-600">{d.runs} run(s)</span>
                )}
              </div>
              {d.notes && <div className="mt-1 text-xs text-gray-600">{d.notes}</div>}
              <div className="mt-1 text-xs text-gray-500">
                {new Date(d.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

const LineupCard = ({ title, players }) => {
  return (
    <Card className="border-gray-300 shadow-md rounded-xl">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center gap-2 text-base text-gray-900">
          <Users className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="grid gap-2 text-sm">
          {players.slice(0, 11).map((p, idx) => (
            <li key={p.id} className="flex items-center justify-between p-2 transition-colors rounded hover:bg-gray-50">
              <span className="flex items-center gap-3 text-gray-900">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gray-900 rounded-full">{idx + 1}</span>
                <span className="font-medium">{p.name}</span>
              </span>
              <Badge variant="outline" className="text-gray-900 border-gray-400">{p.role}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Main Component
const CricketLiveViewer = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedInnings, setSelectedInnings] = useState(null); // null means current/latest
  const socketRef = useRef(null);

  // Fetch match data from API
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[MatchDetailPage] Fetching match:', matchId);
        
        const response = await cricketAPI.getMatchById(matchId);
        console.log('[MatchDetailPage] Match data received:', response);
        
        if (response.success && response.data) {
          setMatch(response.data);
        } else {
          setError('Failed to load match data');
        }
      } catch (err) {
        console.error('[MatchDetailPage] Error fetching match:', err);
        setError(err.message || 'Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  // Socket.IO connection for real-time updates
  useEffect(() => {
    if (!match) return;

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('[MatchDetailPage] Connecting to Socket.IO:', SOCKET_URL);

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current.on('connect', () => {
      console.log('[MatchDetailPage] Socket.IO connected');
      socketRef.current.emit('join', `match-${matchId}`);
    });

    socketRef.current.on('disconnect', () => {
      console.log('[MatchDetailPage] Socket.IO disconnected');
    });

    // Listen for match updates
    socketRef.current.on('match-update', (updateData) => {
      console.log('[MatchDetailPage] Match update received:', updateData);
      if (updateData.matchId === matchId) {
        setMatch(updateData.data);
        setLastUpdate(new Date());
      }
    });

    // Fallback: Poll for updates every 3 seconds
    const pollInterval = setInterval(() => {
      cricketAPI.getMatchById(matchId).then(response => {
        if (response.success && response.data) {
          setMatch(response.data);
          setLastUpdate(new Date());
        }
      }).catch(err => {
        console.error('[MatchDetailPage] Polling error:', err);
      });
    }, 3000);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave', `match-${matchId}`);
        socketRef.current.disconnect();
        console.log('[MatchDetailPage] Socket.IO cleaned up');
      }
      if (pollInterval) {
        clearInterval(pollInterval);
        console.log('[MatchDetailPage] Polling stopped');
      }
    };
  }, [match, matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading live match...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md p-8 text-center">
          <div className="mb-4 text-red-600">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mb-2 text-lg font-semibold text-gray-900">
            {error || 'Match not found'}
          </p>
          <p className="mb-4 text-sm text-gray-600">
            The match you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/user/live-scores" className="inline-flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </Link>
        </Card>
      </div>
    );
  }

 // Extract match data with proper structure - handle both formats
  const innings = match.matchData?.innings || match.innings || [];
  
  console.log('[MatchDetailPage] Match data:', match);
  console.log('[MatchDetailPage] Innings:', innings);
  
  // Current live innings (always the latest - for live situation display)
  const liveInnings = innings[innings.length - 1] || {
    battingTeam: match.teamA?.name || 'Team A',
    bowlingTeam: match.teamB?.name || 'Team B',
    oversLimit: match.overs || match.matchData?.oversLimit || 20,
    deliveries: [],
    wickets: 0,
    total: 0,
    oversBowled: 0,
    strikerId: null,
    nonStrikerId: null,
    bowlerId: null
  };
  
  // Innings to show in scorecard (can be switched by user)
  const current = selectedInnings !== null ? innings[selectedInnings] : liveInnings;
  
  console.log('[MatchDetailPage] Live innings:', liveInnings);
  console.log('[MatchDetailPage] Showing innings:', current);
  console.log('[MatchDetailPage] Deliveries count:', current.deliveries?.length || 0);
  console.log('[MatchDetailPage] Sample delivery:', current.deliveries?.[0]);
  console.log('[MatchDetailPage] Sample player from teamA:', match.teamA?.players?.[0]);
  console.log('[MatchDetailPage] Sample player from teamB:', match.teamB?.players?.[0]);
  
  const target = innings.length > 1 ? innings[0].total + 1 : null;

  // Get all players from both teams
  const allPlayers = [
    ...(match.teamA?.players || []),
    ...(match.teamB?.players || [])
  ];

  // Helper function to find player by ID
  const findPlayerById = (playerId) => {
    return allPlayers.find(p => p.id === playerId || p._id === playerId);
  };

  // Get striker, non-striker, and bowler from LIVE innings (not selected innings)
  const striker = liveInnings.strikerId ? findPlayerById(liveInnings.strikerId) : null;
  const nonStriker = liveInnings.nonStrikerId ? findPlayerById(liveInnings.nonStrikerId) : null;
  const bowler = liveInnings.bowlerId ? findPlayerById(liveInnings.bowlerId) : null;

  // Determine batting and bowling teams with their players (for scorecard display)
  const battingTeam = { 
    name: current.battingTeam, 
    players: current.battingTeam === match.teamA?.name ? match.teamA.players : match.teamB?.players || []
  };
  const bowlingTeam = { 
    name: current.bowlingTeam, 
    players: current.bowlingTeam === match.teamA?.name ? match.teamA.players : match.teamB?.players || []
  };
  // Determine if match is completed and who won
  const isMatchCompleted = match.status === 'completed' || (innings.length === 2 && innings[1].complete);
  const winner = isMatchCompleted && innings.length === 2 ? 
    (innings[1].total > innings[0].total ? innings[1].battingTeam : innings[0].battingTeam) : null;

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-gray-50">
      {/* Celebration Animation - Show when match is won */}
      {winner && (
        <>
          <style>{`
            @keyframes firework {
              0% { transform: translate(0, 0); opacity: 1; }
              100% { transform: translate(var(--x), var(--y)); opacity: 0; }
            }
            @keyframes confetti-fall {
              0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .firework {
              position: fixed;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              animation: firework 1s ease-out infinite;
              pointer-events: none;
              z-index: 9999;
            }
            .confetti {
              position: fixed;
              width: 10px;
              height: 10px;
              animation: confetti-fall 3s linear infinite;
              pointer-events: none;
              z-index: 9999;
            }
          `}</style>
          
          {/* Fireworks particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`firework-${i}`}
              className="firework"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5],
                '--x': `${(Math.random() - 0.5) * 200}px`,
                '--y': `${(Math.random() - 0.5) * 200}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          
          {/* Confetti */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#96CEB4'][i % 6],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 border-b-2 border-gray-900 shadow-lg backdrop-blur bg-white/95">
        <div className="flex items-center justify-between max-w-full gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid font-bold text-white shadow-md bg-gradient-to-br from-gray-900 to-gray-700 size-10 rounded-2xl place-items-center">
              S
            </div>
            <div>
              <div className="text-lg font-bold leading-tight text-gray-900">Spoural — Live Cricket</div>
              <div className="text-xs text-gray-600">
                Real-time updates • {match.venue}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-4 py-2 text-sm font-bold text-white bg-red-600 shadow-lg rounded-xl hover:bg-red-700 animate-pulse">
              <Radio className="w-4 h-4 mr-2" />
              LIVE
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-xs text-gray-700 bg-white border-2 border-gray-300 rounded-xl">
              Updated {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-full px-6 py-6">
        <div className="mx-auto space-y-6 max-w-7xl">
          {/* Match Header Card */}
          <Card className="overflow-hidden border-2 border-gray-900 shadow-xl rounded-2xl">
            <div className="p-6 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{match.teamA?.name || 'Team A'} vs {match.teamB?.name || 'Team B'}</h1>
                <Badge variant="outline" className="!bg-white !border-white font-semibold !text-gray-900">
                  {current.oversLimit} Overs
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {match.venue}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(match.date).toLocaleTimeString()}
                </div>
              </div>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="grid items-center gap-4 mb-4 md:grid-cols-3">
                {/* Team A - Show their innings data */}
                <TeamStrip
                  name={match.teamA?.name || 'Team A'}
                  right={false}
                  score={(() => {
                    // Find innings where teamA was batting
                    const teamAInnings = innings.find(inn => inn.battingTeam === match.teamA?.name);
                    return teamAInnings ? teamAInnings.total : 0;
                  })()}
                  wickets={(() => {
                    const teamAInnings = innings.find(inn => inn.battingTeam === match.teamA?.name);
                    return teamAInnings ? teamAInnings.wickets : 0;
                  })()}
                  overs={(() => {
                    const teamAInnings = innings.find(inn => inn.battingTeam === match.teamA?.name);
                    if (teamAInnings && teamAInnings.deliveries) {
                      return `${formatOvers(teamAInnings.deliveries)}/${current.oversLimit}`;
                    }
                    return `0.0/${current.oversLimit}`;
                  })()}
                  isLive={current.battingTeam === match.teamA?.name}
                  muted={innings.length === 0 || !innings.find(inn => inn.battingTeam === match.teamA?.name)}
                />
                <div className="hidden text-center text-gray-400 md:block">
                  <Trophy className="w-8 h-8 mx-auto" />
                </div>
                {/* Team B - Show their innings data */}
                <TeamStrip
                  name={match.teamB?.name || 'Team B'}
                  right
                  score={(() => {
                    // Find innings where teamB was batting
                    const teamBInnings = innings.find(inn => inn.battingTeam === match.teamB?.name);
                    return teamBInnings ? teamBInnings.total : 0;
                  })()}
                  wickets={(() => {
                    const teamBInnings = innings.find(inn => inn.battingTeam === match.teamB?.name);
                    return teamBInnings ? teamBInnings.wickets : 0;
                  })()}
                  overs={(() => {
                    const teamBInnings = innings.find(inn => inn.battingTeam === match.teamB?.name);
                    if (teamBInnings && teamBInnings.deliveries) {
                      return `${formatOvers(teamBInnings.deliveries)}/${current.oversLimit}`;
                    }
                    return `0.0/${current.oversLimit}`;
                  })()}
                  isLive={current.battingTeam === match.teamB?.name}
                  muted={innings.length === 0 || !innings.find(inn => inn.battingTeam === match.teamB?.name)}
                />
              </div>
              <div className="p-3 text-sm text-center text-gray-700 rounded-lg bg-gray-50">
                <strong>Toss:</strong> {(() => {
                  const tossData = match.matchData?.toss || match.toss;
                  const tossWinner = tossData?.winner || tossData?.tossWinner || match.matchData?.tossWinner || 'TBD';
                  const tossDecision = tossData?.decision || tossData?.tossDecision || match.matchData?.tossDecision || 'bat';
                  return `${tossWinner} won and elected to ${tossDecision} first`;
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Current Match Situation */}
          <Card className="border-2 border-green-500 shadow-lg rounded-2xl bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Live Match Situation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-white border-2 border-green-200 shadow-sm rounded-xl">
                  <div className="mb-2 text-xs font-bold text-gray-600 uppercase">On Strike</div>
                  <div className="text-xl font-bold text-gray-900">{striker?.name || "—"}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    {(() => {
                      const strikerId = striker?.id || striker?._id;
                      const strikerIdStr = strikerId?.toString();
                      const runs = (liveInnings.deliveries || []).filter(d => {
                        const dStrikerId = d.strikerId?.toString();
                        return dStrikerId === strikerIdStr || dStrikerId === strikerId;
                      }).reduce((sum, d) => sum + (d.batsmanRuns || 0), 0);
                      const balls = (liveInnings.deliveries || []).filter(d => {
                        const dStrikerId = d.strikerId?.toString();
                        return (dStrikerId === strikerIdStr || dStrikerId === strikerId) && d.type !== "WIDE" && d.type !== "NOBALL";
                      }).length;
                      return `${runs} runs (${balls} balls)`;
                    })()}
                  </div>
                </div>
                <div className="p-4 bg-white border-2 border-gray-200 shadow-sm rounded-xl">
                  <div className="mb-2 text-xs font-bold text-gray-600 uppercase">Non-Striker</div>
                  <div className="text-xl font-bold text-gray-900">{nonStriker?.name || "—"}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    {(() => {
                      const nonStrikerId = nonStriker?.id || nonStriker?._id;
                      const nonStrikerIdStr = nonStrikerId?.toString();
                      const runs = (liveInnings.deliveries || []).filter(d => {
                        const dStrikerId = d.strikerId?.toString();
                        return dStrikerId === nonStrikerIdStr || dStrikerId === nonStrikerId;
                      }).reduce((sum, d) => sum + (d.batsmanRuns || 0), 0);
                      const balls = (liveInnings.deliveries || []).filter(d => {
                        const dStrikerId = d.strikerId?.toString();
                        return (dStrikerId === nonStrikerIdStr || dStrikerId === nonStrikerId) && d.type !== "WIDE" && d.type !== "NOBALL";
                      }).length;
                      return `${runs} runs (${balls} balls)`;
                    })()}
                  </div>
                </div>
                <div className="p-4 bg-white border-2 border-blue-200 shadow-sm rounded-xl">
                  <div className="mb-2 text-xs font-bold text-gray-600 uppercase">Bowling</div>
                  <div className="text-xl font-bold text-gray-900">{bowler?.name || "—"}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    {(() => {
                      const bowlerId = bowler?.id || bowler?._id;
                      const bowlerIdStr = bowlerId?.toString();
                      const bowlerDeliveries = (liveInnings.deliveries || []).filter(d => {
                        const dBowlerId = d.bowlerId?.toString();
                        return dBowlerId === bowlerIdStr || dBowlerId === bowlerId;
                      });
                      return formatOvers(bowlerDeliveries) + ' overs';
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Strip */}
          <ScoreStrip 
            total={liveInnings.total} 
            wickets={liveInnings.wickets} 
            overs={formatOvers(liveInnings.deliveries || [])} 
            rr={liveInnings.deliveries?.length > 0 ? calcRR(liveInnings.total, liveInnings.deliveries) : 0}
            target={target}
          />

          {/* Over Progress */}
          <OverProgress deliveries={liveInnings.deliveries || []} />

          {/* Innings Summary - Show when multiple innings */}
          {innings.length > 1 && (
            <Card className="border-2 border-purple-300 shadow-lg rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900">Innings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {innings.map((inning, idx) => (
                    <div key={idx} className="p-4 bg-white border-2 border-gray-300 shadow-sm rounded-xl">
                      <div className="mb-2 text-sm font-bold text-gray-600">
                        {idx === 0 ? '1st' : '2nd'} Innings - {inning.battingTeam}
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {inning.total}/{inning.wickets}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {formatOvers(inning.deliveries || [])} overs
                        {inning.complete && <Badge className="ml-2 text-xs bg-gray-600">Completed</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
                {innings.length === 2 && innings[1].total > 0 && (
                  <div className="p-3 mt-4 text-center border-2 border-green-300 rounded-lg bg-green-50">
                    <div className="text-sm font-semibold text-gray-700">
                      {innings[1].total > innings[0].total ? (
                        <span className="text-green-700">{innings[1].battingTeam} leads by {innings[1].total - innings[0].total} runs</span>
                      ) : innings[1].total < innings[0].total ? (
                        <span className="text-orange-700">{innings[1].battingTeam} needs {innings[0].total - innings[1].total + 1} runs to win</span>
                      ) : (
                        <span className="text-blue-700">Scores are tied!</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="scorecard" className="rounded-2xl">
            <TabsList className="grid w-full h-auto grid-cols-3 p-1 bg-gray-900 rounded-t-2xl">
              <TabsTrigger 
                value="scorecard" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white rounded-xl py-3 font-semibold"
              >
                Scorecard
              </TabsTrigger>
              <TabsTrigger 
                value="commentary" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white rounded-xl py-3 font-semibold"
              >
                Commentary
              </TabsTrigger>
              <TabsTrigger 
                value="teams" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white rounded-xl py-3 font-semibold"
              >
                Teams
              </TabsTrigger>
            </TabsList>

            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="mt-0">
              <div className="p-6 space-y-6 bg-white border-2 border-t-0 border-gray-900 rounded-b-2xl">
                
                {/* Innings Selector - Show only if multiple innings exist */}
                {innings.length > 1 && (
                  <div className="flex gap-2 p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
                    <span className="font-semibold text-gray-700">Select Innings:</span>
                    {innings.map((inning, idx) => (
                      <Button
                        key={idx}
                        variant={selectedInnings === idx ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedInnings(idx)}
                        className={selectedInnings === idx ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {idx === 0 ? '1st' : '2nd'} Innings - {inning.battingTeam}
                      </Button>
                    ))}
                    {selectedInnings !== null && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInnings(null)}
                        className="ml-auto"
                      >
                        Show Current
                      </Button>
                    )}
                  </div>
                )}

                {current.deliveries?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-gray-200 border-dashed rounded-xl bg-gray-50">
                    <AlertTriangle className="w-16 h-16 mb-4 text-yellow-500" />
                    <h3 className="mb-2 text-xl font-bold text-gray-900">No Live Scoring Data Yet</h3>
                    <p className="max-w-md text-gray-600">
                      This match is scheduled but live scoring hasn't started. Please check back when the match begins or go to the scoring interface to start recording deliveries.
                    </p>
                  </div>
                ) : (
                  <>
                {/* Batting Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Trophy className="w-5 h-5 text-green-600" />
                      Batting — {current.battingTeam}
                    </h3>
                    <Badge className="px-4 py-1 font-semibold text-white bg-green-600">
                      {current.total}/{current.wickets}
                    </Badge>
                  </div>
                  <BattingTable
                    deliveries={current.deliveries}
                    players={battingTeam?.players || []}
                    strikerId={current.strikerId}
                    nonStrikerId={current.nonStrikerId}
                  />
                </div>

                <Separator className="my-6" />

                {/* Bowling Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Trophy className="w-5 h-5 text-blue-600" />
                      Bowling — {current.bowlingTeam}
                    </h3>
                    <Badge className="px-4 py-1 font-semibold text-white bg-blue-600">
                      {current.wickets} wickets
                    </Badge>
                  </div>
                  <BowlingTable
                    deliveries={current.deliveries}
                    players={bowlingTeam?.players || []}
                    currentBowlerId={current.bowlerId}
                  />
                </div>

                {/* Partnership Info */}
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardContent className="p-4">
                    <div className="mb-2 text-sm font-bold text-gray-700">Current Partnership</div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        {(() => {
                          const strikerId = striker?.id || striker?._id;
                          const strikerIdStr = strikerId?.toString();
                          const nonStrikerId = nonStriker?.id || nonStriker?._id;
                          const nonStrikerIdStr = nonStrikerId?.toString();
                          
                          const runs = (current.deliveries || []).filter(d => {
                            const dStrikerId = d.strikerId?.toString();
                            return dStrikerId === strikerIdStr || dStrikerId === nonStrikerIdStr ||
                                   dStrikerId === strikerId || dStrikerId === nonStrikerId;
                          }).reduce((sum, d) => sum + (d.batsmanRuns || 0), 0);
                          
                          return `${runs} runs`;
                        })()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const strikerId = striker?.id || striker?._id;
                          const strikerIdStr = strikerId?.toString();
                          const nonStrikerId = nonStriker?.id || nonStriker?._id;
                          const nonStrikerIdStr = nonStrikerId?.toString();
                          
                          const balls = (current.deliveries || []).filter(d => {
                            const dStrikerId = d.strikerId?.toString();
                            return ((dStrikerId === strikerIdStr || dStrikerId === nonStrikerIdStr ||
                                    dStrikerId === strikerId || dStrikerId === nonStrikerId) &&
                                    d.type !== "WIDE" && d.type !== "NOBALL");
                          }).length;
                          
                          return `${balls} balls`;
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Commentary Tab */}
            <TabsContent value="commentary" className="mt-0">
              <Card className="border-2 border-t-0 border-gray-900 rounded-b-2xl">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Radio className="w-5 h-5 text-green-600 animate-pulse" />
                    Ball-by-Ball Commentary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Commentary
                    deliveries={current.deliveries || []}
                    players={[...(match.teamA?.players || []), ...(match.teamB?.players || [])]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="mt-0">
              <div className="p-6 bg-white border-2 border-t-0 border-gray-900 rounded-b-2xl">
                <div className="grid gap-6 md:grid-cols-2">
                  <LineupCard title={match.teamA?.name || 'Team A'} players={match.teamA?.players || []} />
                  <LineupCard title={match.teamB?.name || 'Team B'} players={match.teamB?.players || []} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-xs text-center text-gray-600 bg-white border-t-2 border-gray-300">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold">© {new Date().getFullYear()} Spoural • Live Cricket Scoring</p>
          <p className="mt-2 text-gray-500">Updates automatically in real-time</p>
        </div>
      </footer>
    </div>
  );
};

export default CricketLiveViewer