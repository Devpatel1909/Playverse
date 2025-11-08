import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, fetch from API using matchId
    const mockMatches = [
      {
        id: '1',
        sport: 'Cricket',
        team1: 'Australia',
        team2: 'India',
        score1: '185/4',
        score2: '120/3',
        overs1: '20.0',
        overs2: '15.2',
        status: 'live',
        venue: 'The Gabba, Brisbane',
        tournament: 'India tour of Australia, 2025',
        time: 'Live',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'Australia won the toss and opt to Bowl',
        umpires: 'Rod Tucker, Shawn Craig',
        referee: 'Jeff Crowe',
        stadium: 'The Gabba',
        city: 'Brisbane, Australia',
        capacity: '42000 (approx)',
      },
    ];

    const foundMatch = mockMatches.find(m => m.id === matchId);
    setMatch(foundMatch || mockMatches[0]);
    setLoading(false);
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <p className="text-gray-600">Match not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <Navigation />

      {/* Back Button */}
      <div className="px-4 py-4 mx-auto max-w-7xl">
        <Link to="/scores" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Scores
        </Link>
      </div>

      <div className="px-4 pb-8 mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          {/* Match Header */}
          <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="!bg-white !text-green-700 !border-white font-semibold">{match.sport}</Badge>
              <Badge variant="destructive" className="animate-pulse !bg-red-600 !text-white">LIVE</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white">{match.team1} vs {match.team2}</h1>
            <p className="text-white opacity-90">{match.tournament}</p>
          </div>

          {/* Current Score */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">{match.team1}</div>
                <div className="text-4xl font-bold text-gray-900">{match.score1}</div>
                {match.overs1 && (
                  <div className="text-sm text-gray-600 mt-1">({match.overs1} Overs)</div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">{match.team2}</div>
                <div className="text-4xl font-bold text-gray-900">{match.score2}</div>
                {match.overs2 && (
                  <div className="text-sm text-gray-600 mt-1">({match.overs2} Overs)</div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-green-600 rounded-none">
              <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white rounded-none">Info</TabsTrigger>
              <TabsTrigger value="scorecard" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white rounded-none">Scorecard</TabsTrigger>
              <TabsTrigger value="squads" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white rounded-none">Squads</TabsTrigger>
              <TabsTrigger value="overs" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white rounded-none">Overs</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-base font-bold text-gray-900">MATCH INFO</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Match</span>
                        <span className="text-gray-900 text-right">{match.team1} vs {match.team2}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Series</span>
                        <span className="text-gray-900">{match.tournament}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Date</span>
                        <span className="text-gray-900">Today</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Time</span>
                        <span className="text-gray-900">{match.time}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Toss</span>
                        <span className="text-gray-900 text-right">{match.toss}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Venue</span>
                        <span className="text-gray-900 text-right">{match.venue}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Umpires</span>
                        <span className="text-gray-900 text-right">{match.umpires}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Referee</span>
                        <span className="text-gray-900">{match.referee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-base font-bold text-gray-900">VENUE GUIDE</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Stadium</span>
                        <span className="text-gray-900">{match.stadium}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">City</span>
                        <span className="text-gray-900">{match.city}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Capacity</span>
                        <span className="text-gray-900">{match.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="p-6">
              <div className="space-y-6">
                {/* India Innings */}
                <Card>
                  <CardHeader className="bg-green-600 text-white">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold">{match.team2}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{match.score2}</div>
                        {match.overs2 && <div className="text-sm opacity-90">({match.overs2} Ov)</div>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Batting Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-3 font-semibold text-gray-700">Batter</th>
                            <th className="text-center p-3 font-semibold text-gray-700">R</th>
                            <th className="text-center p-3 font-semibold text-gray-700">B</th>
                            <th className="text-center p-3 font-semibold text-gray-700">4s</th>
                            <th className="text-center p-3 font-semibold text-gray-700">6s</th>
                            <th className="text-center p-3 font-semibold text-gray-700">SR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">Abhishek Sharma</div>
                              <div className="text-xs text-gray-600">not out</div>
                            </td>
                            <td className="text-center p-3 font-bold text-gray-900">23</td>
                            <td className="text-center p-3 text-gray-700">13</td>
                            <td className="text-center p-3 text-gray-700">1</td>
                            <td className="text-center p-3 text-gray-700">1</td>
                            <td className="text-center p-3 text-gray-700">176.92</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">Shubman Gill</div>
                              <div className="text-xs text-gray-600">not out</div>
                            </td>
                            <td className="text-center p-3 font-bold text-gray-900">29</td>
                            <td className="text-center p-3 text-gray-700">16</td>
                            <td className="text-center p-3 text-gray-700">6</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">181.25</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Extras */}
                    <div className="p-3 bg-gray-50 border-t">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Extras:</span>
                        <span className="text-gray-900 ml-2">0 (b 0, lb 0, w 0, nb 0, p 0)</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="p-3 bg-green-50 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">{match.score2} ({match.overs2} Overs, RR: 10.76)</span>
                      </div>
                    </div>

                    {/* Did not Bat */}
                    <div className="p-3 border-t">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Did not Bat:</span>
                        <span className="text-gray-900 ml-2">
                          Suryakumar Yadav (c), Rinku Singh, Jitesh Sharma (wk), Washington Sundar, Shivam Dube, Axar Patel, Arshdeep Singh, Varun Chakaravarthy, Jasprit Bumrah
                        </span>
                      </div>
                    </div>

                    {/* Bowling Table */}
                    <div className="overflow-x-auto border-t">
                      <div className="p-3 bg-gray-50">
                        <h3 className="font-bold text-gray-900">Bowler</h3>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-3 font-semibold text-gray-700">Bowler</th>
                            <th className="text-center p-3 font-semibold text-gray-700">O</th>
                            <th className="text-center p-3 font-semibold text-gray-700">M</th>
                            <th className="text-center p-3 font-semibold text-gray-700">R</th>
                            <th className="text-center p-3 font-semibold text-gray-700">W</th>
                            <th className="text-center p-3 font-semibold text-gray-700">ECO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Ben Dwarshuis</td>
                            <td className="text-center p-3 text-gray-700">2</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">27</td>
                            <td className="text-center p-3 font-bold text-gray-900">0</td>
                            <td className="text-center p-3 text-gray-700">13.50</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Nathan Ellis</td>
                            <td className="text-center p-3 text-gray-700">1</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">12</td>
                            <td className="text-center p-3 font-bold text-gray-900">0</td>
                            <td className="text-center p-3 text-gray-700">12.00</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Xavier Bartlett</td>
                            <td className="text-center p-3 text-gray-700">0.2</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">5</td>
                            <td className="text-center p-3 font-bold text-gray-900">0</td>
                            <td className="text-center p-3 text-gray-700">15.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Australia Innings */}
                <Card>
                  <CardHeader className="bg-gray-100">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold text-gray-900">{match.team1}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{match.score1}</div>
                        {match.overs1 && <div className="text-sm text-gray-600">({match.overs1} Ov)</div>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Batting Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-3 font-semibold text-gray-700">Batter</th>
                            <th className="text-center p-3 font-semibold text-gray-700">R</th>
                            <th className="text-center p-3 font-semibold text-gray-700">B</th>
                            <th className="text-center p-3 font-semibold text-gray-700">4s</th>
                            <th className="text-center p-3 font-semibold text-gray-700">6s</th>
                            <th className="text-center p-3 font-semibold text-gray-700">SR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">Travis Head</div>
                              <div className="text-xs text-gray-600">c Sharma b Bumrah</div>
                            </td>
                            <td className="text-center p-3 font-bold text-gray-900">45</td>
                            <td className="text-center p-3 text-gray-700">28</td>
                            <td className="text-center p-3 text-gray-700">6</td>
                            <td className="text-center p-3 text-gray-700">2</td>
                            <td className="text-center p-3 text-gray-700">160.71</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">Matthew Short</div>
                              <div className="text-xs text-gray-600">c Gill b Arshdeep</div>
                            </td>
                            <td className="text-center p-3 font-bold text-gray-900">37</td>
                            <td className="text-center p-3 text-gray-700">25</td>
                            <td className="text-center p-3 text-gray-700">4</td>
                            <td className="text-center p-3 text-gray-700">2</td>
                            <td className="text-center p-3 text-gray-700">148.00</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">Josh Inglis (wk)</div>
                              <div className="text-xs text-gray-600">not out</div>
                            </td>
                            <td className="text-center p-3 font-bold text-gray-900">52</td>
                            <td className="text-center p-3 text-gray-700">32</td>
                            <td className="text-center p-3 text-gray-700">5</td>
                            <td className="text-center p-3 text-gray-700">3</td>
                            <td className="text-center p-3 text-gray-700">162.50</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">Tim David</div>
                              <div className="text-xs text-gray-600">not out</div>
                            </td>
                            <td className="text-center p-3 font-bold text-gray-900">28</td>
                            <td className="text-center p-3 text-gray-700">18</td>
                            <td className="text-center p-3 text-gray-700">2</td>
                            <td className="text-center p-3 text-gray-700">2</td>
                            <td className="text-center p-3 text-gray-700">155.56</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Extras */}
                    <div className="p-3 bg-gray-50 border-t">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Extras:</span>
                        <span className="text-gray-900 ml-2">8 (b 2, lb 3, w 2, nb 1, p 0)</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="p-3 bg-blue-50 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">{match.score1} ({match.overs1} Overs, RR: 9.25)</span>
                      </div>
                    </div>

                    {/* Did not Bat */}
                    <div className="p-3 border-t">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Did not Bat:</span>
                        <span className="text-gray-900 ml-2">
                          Mitchell Marsh (c), Glenn Maxwell, Marcus Stoinis, Sean Abbott, Nathan Ellis, Xavier Bartlett, Ben Dwarshuis
                        </span>
                      </div>
                    </div>

                    {/* Bowling Table */}
                    <div className="overflow-x-auto border-t">
                      <div className="p-3 bg-gray-50">
                        <h3 className="font-bold text-gray-900">Bowler</h3>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-3 font-semibold text-gray-700">Bowler</th>
                            <th className="text-center p-3 font-semibold text-gray-700">O</th>
                            <th className="text-center p-3 font-semibold text-gray-700">M</th>
                            <th className="text-center p-3 font-semibold text-gray-700">R</th>
                            <th className="text-center p-3 font-semibold text-gray-700">W</th>
                            <th className="text-center p-3 font-semibold text-gray-700">ECO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Jasprit Bumrah</td>
                            <td className="text-center p-3 text-gray-700">4</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">35</td>
                            <td className="text-center p-3 font-bold text-gray-900">1</td>
                            <td className="text-center p-3 text-gray-700">8.75</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Arshdeep Singh</td>
                            <td className="text-center p-3 text-gray-700">4</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">42</td>
                            <td className="text-center p-3 font-bold text-gray-900">1</td>
                            <td className="text-center p-3 text-gray-700">10.50</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Varun Chakaravarthy</td>
                            <td className="text-center p-3 text-gray-700">4</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">38</td>
                            <td className="text-center p-3 font-bold text-gray-900">0</td>
                            <td className="text-center p-3 text-gray-700">9.50</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">Axar Patel</td>
                            <td className="text-center p-3 text-gray-700">4</td>
                            <td className="text-center p-3 text-gray-700">0</td>
                            <td className="text-center p-3 text-gray-700">32</td>
                            <td className="text-center p-3 font-bold text-gray-900">0</td>
                            <td className="text-center p-3 text-gray-700">8.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Squads Tab */}
            <TabsContent value="squads" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{match.team1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Player 1 (C)', 'Player 2', 'Player 3 (WK)', 'Player 4', 'Player 5', 'Player 6', 'Player 7', 'Player 8', 'Player 9', 'Player 10', 'Player 11'].map((player, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{player}</div>
                            <div className="text-xs text-gray-600">Batter</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{match.team2}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Player A (C)', 'Player B', 'Player C (WK)', 'Player D', 'Player E', 'Player F', 'Player G', 'Player H', 'Player I', 'Player J', 'Player K'].map((player, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{player}</div>
                            <div className="text-xs text-gray-600">Batter</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Overs Tab */}
            <TabsContent value="overs" className="p-6">
              <div className="space-y-4">
                {[
                  { over: 'Ov 5', runs: '5 runs', score: '52-0', bowler: 'Xavier Bartlett', batsmen: 'Gill & Abhishek Sharma', balls: [1, 1, 0, 1, 2] },
                  { over: 'Ov 4', runs: '12 runs', score: '47-0', bowler: 'Nathan Ellis', batsmen: 'Gill & Abhishek Sharma', balls: [2, 0, 2, 1, 1, 6] },
                  { over: 'Ov 3', runs: '16 runs', score: '35-0', bowler: 'Ben Dwarshuis', batsmen: 'Gill & Dwarshuis', balls: [4, 0, 4, 4, 4, 0] },
                ].map((over, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-gray-900">{over.over}</div>
                          <div className="text-sm text-gray-600">{over.runs}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{match.team1}</div>
                          <div className="text-sm text-gray-600">{over.score}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <div className="text-sm text-gray-700">{over.bowler} to {over.batsmen}</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {over.balls.map((ball, ballIdx) => (
                          <div
                            key={ballIdx}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              ball === 6 ? 'bg-purple-600' :
                              ball === 4 ? 'bg-blue-600' :
                              ball > 0 ? 'bg-green-600' :
                              'bg-gray-400'
                            }`}
                          >
                            {ball}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPage;
