import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CricketLiveScoringUI from './CricketScoringUI';
import cricketAPIService from '../../../services/cricketAPI';

const CricketScoringWrapper = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[CricketScoringWrapper] Loading match:', matchId);
        
        // Fetch match details
        const matchResponse = await cricketAPIService.getMatchById(matchId);
        const match = matchResponse?.data || matchResponse;
        
        console.log('[CricketScoringWrapper] Match data received:', match);

        if (!match) {
          throw new Error('Match not found');
        }

        // Transform the database match data into the format expected by CricketScoringUI
        const transformedMatch = {
          id: match._id,
          title: `${match.teamA?.name || 'Team A'} vs ${match.teamB?.name || 'Team B'}`,
          venue: match.venue || 'Venue TBD',
          startTimeISO: match.date || new Date().toISOString(),
          status: match.status?.toUpperCase() || 'SCHEDULED',
          teams: [
            {
              name: match.teamA?.name || 'Team A',
              players: (match.teamA?.players || []).map(p => ({
                id: p._id || p.id || String(Math.random()),
                name: p.name || 'Unknown',
                role: p.role || 'BAT',
                jerseyNumber: p.jerseyNumber || 0
              }))
            },
            {
              name: match.teamB?.name || 'Team B',
              players: (match.teamB?.players || []).map(p => ({
                id: p._id || p.id || String(Math.random()),
                name: p.name || 'Unknown',
                role: p.role || 'BAT',
                jerseyNumber: p.jerseyNumber || 0
              }))
            }
          ],
          toss: match.matchData?.toss || match.toss || null,
          innings: match.matchData?.innings || match.innings || [
            {
              battingTeam: match.teamA?.name || 'Team A',
              bowlingTeam: match.teamB?.name || 'Team B',
              oversLimit: match.overs || 20,
              deliveries: [],
              wickets: match.score?.teamA?.wickets || 0,
              total: match.score?.teamA?.runs || 0,
              strikerId: match.teamA?.players?.[0]?._id || match.teamA?.players?.[0]?.id || '',
              nonStrikerId: match.teamA?.players?.[1]?._id || match.teamA?.players?.[1]?.id || '',
              bowlerId: match.teamB?.players?.[0]?._id || match.teamB?.players?.[0]?.id || '',
              oversBowled: 0,
            }
          ],
          currentInningsIndex: 0,
          matchType: match.matchType || 'T20',
          overs: match.overs || 20
        };

        console.log('[CricketScoringWrapper] Transformed match data:', transformedMatch);
        setMatchData(transformedMatch);
        
        // Update match status to 'live' when scoring starts
        if (match.status === 'scheduled') {
          try {
            await cricketAPIService.updateMatch(matchId, { status: 'live' });
            console.log('[CricketScoringWrapper] Match status updated to LIVE');
          } catch (err) {
            console.warn('[CricketScoringWrapper] Failed to update match status:', err);
          }
        }

      } catch (err) {
        console.error('[CricketScoringWrapper] Error loading match:', err);
        setError(err.message || 'Failed to load match data');
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      loadMatchData();
    } else {
      setError('No match ID provided');
      setLoading(false);
    }
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
          <p className="text-xl font-semibold text-white">Loading match data...</p>
          <p className="mt-2 text-sm text-slate-400">Please wait while we fetch the teams and players</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-md p-8 text-center border rounded-2xl bg-slate-800/50 border-red-500/30">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-red-400">Error Loading Match</h2>
          <p className="mb-6 text-slate-300">{error}</p>
          <button
            onClick={() => navigate('/admin/cricket')}
            className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            ← Back to Cricket Admin
          </button>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center text-slate-400">
          <p className="text-xl">No match data available</p>
        </div>
      </div>
    );
  }

  return <CricketLiveScoringUI initialMatch={matchData} matchId={matchId} />;
};

export default CricketScoringWrapper;
