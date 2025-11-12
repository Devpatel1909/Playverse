import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import Navigation from '../../../components/Navigation';

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const location = useLocation();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const fromSport = location.state?.fromSport || 'all';

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
      {
        id: '2',
        sport: 'Cricket',
        team1: 'England',
        team2: 'Pakistan',
        score1: '245/6',
        score2: '198/8',
        overs1: '50.0',
        overs2: '45.3',
        status: 'live',
        venue: 'Lord\'s Cricket Ground',
        tournament: 'ICC World Cup 2025',
        time: 'Live',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'England won the toss and opt to Bat',
        umpires: 'Kumar Dharmasena, Marais Erasmus',
        referee: 'Ranjan Madugalle',
        stadium: 'Lord\'s',
        city: 'London, England',
        capacity: '30000 (approx)',
      },
      {
        id: '3',
        sport: 'Football',
        team1: 'Manchester United',
        team2: 'Liverpool',
        score1: '2',
        score2: '1',
        status: 'live',
        venue: 'Old Trafford',
        tournament: 'Premier League',
        time: '67\' - 2nd Half',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss completed',
        umpires: 'Referee: Michael Oliver',
        referee: 'VAR: Stuart Attwell',
        stadium: 'Old Trafford',
        city: 'Manchester, England',
        capacity: '74000 (approx)',
      },
      {
        id: '4',
        sport: 'Basketball',
        team1: 'LA Lakers',
        team2: 'Golden State Warriors',
        score1: '98',
        score2: '102',
        status: 'live',
        venue: 'Crypto.com Arena',
        tournament: 'NBA Regular Season',
        time: 'Q4 - 2:45',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball won by Warriors',
        umpires: 'Officials: Scott Foster, Tony Brothers',
        referee: 'Crew Chief: Scott Foster',
        stadium: 'Crypto.com Arena',
        city: 'Los Angeles, CA',
        capacity: '19000 (approx)',
      },
      {
        id: '5',
        sport: 'Tennis',
        team1: 'Carlos Alcaraz',
        team2: 'Novak Djokovic',
        score1: '6-4, 3-6, 5-4',
        score2: '',
        status: 'live',
        venue: 'Centre Court',
        tournament: 'ATP Finals',
        time: 'Set 3 - In Progress',
        team1Logo: '🎾',
        team2Logo: '🎾',
        toss: 'Alcaraz won the toss and chose to serve',
        umpires: 'Chair Umpire: Carlos Bernardes',
        referee: 'Tournament Referee: Andreas Egli',
        stadium: 'Centre Court',
        city: 'London, England',
        capacity: '15000 (approx)',
      },
      {
        id: '6',
        sport: 'Hockey',
        team1: 'Toronto Maple Leafs',
        team2: 'Montreal Canadiens',
        score1: '3',
        score2: '2',
        status: 'live',
        venue: 'Scotiabank Arena',
        tournament: 'NHL Regular Season',
        time: 'P2 - 8:23',
        team1Logo: '🏒',
        team2Logo: '🏒',
        toss: 'Puck drop won by Maple Leafs',
        umpires: 'Referees: Wes McCauley, Chris Rooney',
        referee: 'Linesmen: Ryan Galloway, Kiel Murchison',
        stadium: 'Scotiabank Arena',
        city: 'Toronto, ON',
        capacity: '18800 (approx)',
      },
      {
        id: 'upcoming-1',
        sport: 'Cricket',
        team1: 'India',
        team2: 'Australia',
        status: 'scheduled',
        venue: 'Melbourne Cricket Ground',
        tournament: 'World Test Championship',
        series: 'India tour of Australia, 2025',
        matchType: 'Test Match - Day 1',
        date: 'SUN, NOV 10 2025',
        time: '6:15 PM LOCAL, 8:15 AM GMT',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'Toss yet to happen',
        umpires: 'To be announced',
        referee: 'To be announced',
        stadium: 'Melbourne Cricket Ground',
        city: 'Melbourne, Australia',
        capacity: '100000 (approx)',
      },
      {
        id: 'upcoming-2',
        sport: 'Cricket',
        team1: 'England',
        team2: 'Pakistan',
        status: 'scheduled',
        venue: 'Lord\'s Cricket Ground',
        tournament: 'ICC World Cup 2025',
        series: 'England vs Pakistan',
        matchType: 'ODI Match',
        date: 'MON, NOV 11 2025',
        time: '7:00 PM LOCAL',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'Toss yet to happen',
        umpires: 'To be announced',
        referee: 'To be announced',
        stadium: 'Lord\'s',
        city: 'London, England',
        capacity: '30000 (approx)',
      },
      {
        id: 'upcoming-3',
        sport: 'Cricket',
        team1: 'New Zealand',
        team2: 'West Indies',
        status: 'scheduled',
        venue: 'Eden Park',
        tournament: 'T20 Series',
        series: 'New Zealand vs West Indies',
        matchType: 'T20I - 1st Match',
        date: 'TUE, NOV 12 2025',
        time: '6:00 PM LOCAL',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'Toss yet to happen',
        umpires: 'To be announced',
        referee: 'To be announced',
        stadium: 'Eden Park',
        city: 'Auckland, New Zealand',
        capacity: '50000 (approx)',
      },
      {
        id: 'upcoming-4',
        sport: 'Football',
        team1: 'Manchester City',
        team2: 'Arsenal',
        status: 'scheduled',
        venue: 'Etihad Stadium',
        tournament: 'Premier League',
        series: 'Premier League 2025',
        matchType: 'League Match',
        date: 'SAT, NOV 9 2025',
        time: '5:30 PM LOCAL',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss before kickoff',
        umpires: 'Referee to be announced',
        referee: 'Match officials to be announced',
        stadium: 'Etihad Stadium',
        city: 'Manchester, England',
        capacity: '55000 (approx)',
      },
      {
        id: 'upcoming-5',
        sport: 'Basketball',
        team1: 'Boston Celtics',
        team2: 'Miami Heat',
        status: 'scheduled',
        venue: 'TD Garden',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        date: 'FRI, NOV 8 2025',
        time: '7:30 PM EST',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball at tip-off',
        umpires: 'Officials to be announced',
        referee: 'Crew chief to be announced',
        stadium: 'TD Garden',
        city: 'Boston, MA',
        capacity: '19156 (approx)',
      },
      {
        id: 'upcoming-6',
        sport: 'Cricket',
        team1: 'South Africa',
        team2: 'Sri Lanka',
        status: 'scheduled',
        venue: 'Newlands, Cape Town',
        tournament: 'Test Series',
        series: 'South Africa vs Sri Lanka',
        matchType: 'Test Match - Day 1',
        date: 'WED, NOV 13 2025',
        time: '2:00 PM LOCAL',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'Toss yet to happen',
        umpires: 'To be announced',
        referee: 'To be announced',
        stadium: 'Newlands',
        city: 'Cape Town, South Africa',
        capacity: '25000 (approx)',
      },
      {
        id: 'upcoming-7',
        sport: 'Football',
        team1: 'Real Madrid',
        team2: 'Barcelona',
        status: 'scheduled',
        venue: 'Santiago Bernabéu',
        tournament: 'La Liga',
        series: 'La Liga 2025',
        matchType: 'El Clásico',
        date: 'SUN, NOV 10 2025',
        time: '9:00 PM LOCAL',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss before kickoff',
        umpires: 'Referee to be announced',
        referee: 'Match officials to be announced',
        stadium: 'Santiago Bernabéu',
        city: 'Madrid, Spain',
        capacity: '81000 (approx)',
      },
      {
        id: 'upcoming-8',
        sport: 'Football',
        team1: 'Liverpool',
        team2: 'Chelsea',
        status: 'scheduled',
        venue: 'Anfield',
        tournament: 'Premier League',
        series: 'Premier League 2025',
        matchType: 'League Match',
        date: 'MON, NOV 11 2025',
        time: '8:00 PM LOCAL',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss before kickoff',
        umpires: 'Referee to be announced',
        referee: 'Match officials to be announced',
        stadium: 'Anfield',
        city: 'Liverpool, England',
        capacity: '54000 (approx)',
      },
      {
        id: 'upcoming-9',
        sport: 'Basketball',
        team1: 'Los Angeles Lakers',
        team2: 'Golden State Warriors',
        status: 'scheduled',
        venue: 'Crypto.com Arena',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        date: 'SUN, NOV 10 2025',
        time: '8:30 PM PST',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball at tip-off',
        umpires: 'Officials to be announced',
        referee: 'Crew chief to be announced',
        stadium: 'Crypto.com Arena',
        city: 'Los Angeles, CA',
        capacity: '19000 (approx)',
      },
      {
        id: 'upcoming-10',
        sport: 'Basketball',
        team1: 'Brooklyn Nets',
        team2: 'Philadelphia 76ers',
        status: 'scheduled',
        venue: 'Barclays Center',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        date: 'MON, NOV 11 2025',
        time: '7:00 PM EST',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball at tip-off',
        umpires: 'Officials to be announced',
        referee: 'Crew chief to be announced',
        stadium: 'Barclays Center',
        city: 'Brooklyn, NY',
        capacity: '17700 (approx)',
      },
      {
        id: 'upcoming-11',
        sport: 'Tennis',
        team1: 'Novak Djokovic',
        team2: 'Carlos Alcaraz',
        status: 'scheduled',
        venue: 'Centre Court',
        tournament: 'ATP Finals',
        series: 'ATP Finals 2025',
        matchType: 'Semi-Final',
        date: 'SAT, NOV 9 2025',
        time: '2:00 PM LOCAL',
        team1Logo: '🎾',
        team2Logo: '🎾',
        toss: 'Coin toss for serve',
        umpires: 'Chair umpire to be announced',
        referee: 'Tournament referee to be announced',
        stadium: 'Centre Court',
        city: 'London, England',
        capacity: '15000 (approx)',
      },
      {
        id: 'upcoming-12',
        sport: 'Tennis',
        team1: 'Iga Swiatek',
        team2: 'Aryna Sabalenka',
        status: 'scheduled',
        venue: 'Rod Laver Arena',
        tournament: 'WTA Finals',
        series: 'WTA Finals 2025',
        matchType: 'Final',
        date: 'SUN, NOV 10 2025',
        time: '3:00 PM LOCAL',
        team1Logo: '🎾',
        team2Logo: '🎾',
        toss: 'Coin toss for serve',
        umpires: 'Chair umpire to be announced',
        referee: 'Tournament referee to be announced',
        stadium: 'Rod Laver Arena',
        city: 'Melbourne, Australia',
        capacity: '14820 (approx)',
      },
      {
        id: 'upcoming-13',
        sport: 'Hockey',
        team1: 'Toronto Maple Leafs',
        team2: 'Montreal Canadiens',
        status: 'scheduled',
        venue: 'Scotiabank Arena',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        date: 'SAT, NOV 9 2025',
        time: '7:00 PM EST',
        team1Logo: '🏒',
        team2Logo: '🏒',
        toss: 'Puck drop at center ice',
        umpires: 'Officials to be announced',
        referee: 'Referees to be announced',
        stadium: 'Scotiabank Arena',
        city: 'Toronto, ON',
        capacity: '18800 (approx)',
      },
      {
        id: 'upcoming-14',
        sport: 'Hockey',
        team1: 'Boston Bruins',
        team2: 'New York Rangers',
        status: 'scheduled',
        venue: 'TD Garden',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        date: 'SUN, NOV 10 2025',
        time: '8:00 PM EST',
        team1Logo: '🏒',
        team2Logo: '🏒',
        toss: 'Puck drop at center ice',
        umpires: 'Officials to be announced',
        referee: 'Referees to be announced',
        stadium: 'TD Garden',
        city: 'Boston, MA',
        capacity: '17850 (approx)',
      },
      {
        id: 'upcoming-15',
        sport: 'Hockey',
        team1: 'Edmonton Oilers',
        team2: 'Calgary Flames',
        status: 'scheduled',
        venue: 'Rogers Place',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Battle of Alberta',
        date: 'MON, NOV 11 2025',
        time: '9:00 PM MST',
        team1Logo: '🏒',
        team2Logo: '🏒',
        toss: 'Puck drop at center ice',
        umpires: 'Officials to be announced',
        referee: 'Referees to be announced',
        stadium: 'Rogers Place',
        city: 'Edmonton, AB',
        capacity: '18500 (approx)',
      },
      // Archived matches
      {
        id: 'archive-1',
        sport: 'Cricket',
        team1: 'India',
        team2: 'South Africa',
        score1: '295/8',
        score2: '287/10',
        overs1: '50.0',
        overs2: '49.3',
        status: 'completed',
        result: 'India won by 8 runs',
        date: 'WED, NOV 6 2025',
        venue: 'Melbourne Cricket Ground',
        tournament: 'ICC World Cup 2025',
        series: 'ICC World Cup 2025',
        matchType: 'Semi-Final',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'India won the toss and opt to Bat',
        umpires: 'Kumar Dharmasena, Marais Erasmus',
        referee: 'Ranjan Madugalle',
        stadium: 'Melbourne Cricket Ground',
        city: 'Melbourne, Australia',
        capacity: '100000 (approx)',
      },
      {
        id: 'archive-2',
        sport: 'Cricket',
        team1: 'New Zealand',
        team2: 'West Indies',
        score1: '178/9',
        score2: '175/10',
        overs1: '20.0',
        overs2: '19.5',
        status: 'completed',
        result: 'New Zealand won by 3 runs',
        date: 'TUE, NOV 5 2025',
        venue: 'Eden Park',
        tournament: 'T20 Series',
        series: 'New Zealand vs West Indies',
        matchType: 'T20I - 3rd Match',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'New Zealand won the toss and opt to Bowl',
        umpires: 'Paul Reiffel, Bruce Oxenford',
        referee: 'Andy Pycroft',
        stadium: 'Eden Park',
        city: 'Auckland, New Zealand',
        capacity: '50000 (approx)',
      },
      {
        id: 'archive-3',
        sport: 'Football',
        team1: 'Barcelona',
        team2: 'Real Madrid',
        score1: '3',
        score2: '2',
        status: 'completed',
        result: 'Barcelona won',
        date: 'SUN, NOV 3 2025',
        venue: 'Camp Nou',
        tournament: 'La Liga',
        series: 'La Liga 2025',
        matchType: 'El Clásico',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss completed',
        umpires: 'Referee: Antonio Mateu Lahoz',
        referee: 'VAR: Alejandro Hernández',
        stadium: 'Camp Nou',
        city: 'Barcelona, Spain',
        capacity: '99000 (approx)',
      },
      {
        id: 'archive-4',
        sport: 'Basketball',
        team1: 'Lakers',
        team2: 'Celtics',
        score1: '112',
        score2: '108',
        status: 'completed',
        result: 'Lakers won',
        date: 'SAT, NOV 2 2025',
        venue: 'Crypto.com Arena',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball won by Lakers',
        umpires: 'Officials: Scott Foster, Tony Brothers, Josh Tiven',
        referee: 'Crew Chief: Scott Foster',
        stadium: 'Crypto.com Arena',
        city: 'Los Angeles, CA',
        capacity: '19000 (approx)',
      },
      {
        id: 'archive-5',
        sport: 'Cricket',
        team1: 'England',
        team2: 'Australia',
        score1: '267/9',
        score2: '265/10',
        overs1: '50.0',
        overs2: '49.4',
        status: 'completed',
        result: 'England won by 2 runs',
        date: 'FRI, NOV 1 2025',
        venue: 'Lord\'s Cricket Ground',
        tournament: 'ODI Series',
        series: 'England vs Australia',
        matchType: 'ODI - 5th Match',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'England won the toss and opt to Bat',
        umpires: 'Aleem Dar, Richard Illingworth',
        referee: 'Jeff Crowe',
        stadium: 'Lord\'s',
        city: 'London, England',
        capacity: '30000 (approx)',
      },
      {
        id: 'archive-6',
        sport: 'Tennis',
        team1: 'Rafael Nadal',
        team2: 'Roger Federer',
        score1: '3',
        score2: '2',
        status: 'completed',
        result: 'Nadal won (6-4, 3-6, 7-6, 4-6, 6-3)',
        date: 'THU, OCT 31 2025',
        venue: 'Centre Court',
        tournament: 'ATP Finals',
        series: 'ATP Finals 2025',
        matchType: 'Quarter-Final',
        team1Logo: '🎾',
        team2Logo: '🎾',
        toss: 'Nadal won the toss and chose to serve',
        umpires: 'Chair Umpire: Mohamed Lahyani',
        referee: 'Tournament Referee: Andreas Egli',
        stadium: 'Centre Court',
        city: 'London, England',
        capacity: '15000 (approx)',
      },
      {
        id: 'archive-7',
        sport: 'Hockey',
        team1: 'Canada',
        team2: 'USA',
        score1: '4',
        score2: '3',
        status: 'completed',
        result: 'Canada won (OT)',
        date: 'WED, OCT 30 2025',
        venue: 'Bell Centre',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        team1Logo: '🏒',
        team2Logo: '🏒',
        toss: 'Puck drop won by Canada',
        umpires: 'Referees: Wes McCauley, Chris Rooney',
        referee: 'Linesmen: Ryan Galloway, Kiel Murchison',
        stadium: 'Bell Centre',
        city: 'Montreal, QC',
        capacity: '21000 (approx)',
      },
      {
        id: 'archive-8',
        sport: 'Football',
        team1: 'Manchester United',
        team2: 'Liverpool',
        score1: '2',
        score2: '2',
        status: 'completed',
        result: 'Draw',
        date: 'TUE, OCT 29 2025',
        venue: 'Old Trafford',
        tournament: 'Premier League',
        series: 'Premier League 2025',
        matchType: 'League Match',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss completed',
        umpires: 'Referee: Michael Oliver',
        referee: 'VAR: Stuart Attwell',
        stadium: 'Old Trafford',
        city: 'Manchester, England',
        capacity: '74000 (approx)',
      },
      {
        id: 'archive-9',
        sport: 'Basketball',
        team1: 'Warriors',
        team2: 'Nets',
        score1: '125',
        score2: '118',
        status: 'completed',
        result: 'Warriors won',
        date: 'MON, OCT 28 2025',
        venue: 'Chase Center',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball won by Warriors',
        umpires: 'Officials: Marc Davis, Zach Zarba, Ben Taylor',
        referee: 'Crew Chief: Marc Davis',
        stadium: 'Chase Center',
        city: 'San Francisco, CA',
        capacity: '18000 (approx)',
      },
      {
        id: 'archive-10',
        sport: 'Cricket',
        team1: 'Pakistan',
        team2: 'Sri Lanka',
        score1: '342/6',
        score2: '338/9',
        overs1: '50.0',
        overs2: '50.0',
        status: 'completed',
        result: 'Pakistan won by 4 runs',
        date: 'SUN, OCT 27 2025',
        venue: 'National Stadium',
        tournament: 'Asia Cup',
        series: 'Asia Cup 2025',
        matchType: 'Final',
        team1Logo: '🏏',
        team2Logo: '🏏',
        toss: 'Pakistan won the toss and opt to Bat',
        umpires: 'Kumar Dharmasena, Paul Reiffel',
        referee: 'Ranjan Madugalle',
        stadium: 'National Stadium',
        city: 'Karachi, Pakistan',
        capacity: '34000 (approx)',
      },
      {
        id: 'archive-11',
        sport: 'Football',
        team1: 'Bayern Munich',
        team2: 'Borussia Dortmund',
        score1: '3',
        score2: '1',
        status: 'completed',
        result: 'Bayern Munich won',
        date: 'SAT, OCT 26 2025',
        venue: 'Allianz Arena',
        tournament: 'Bundesliga',
        series: 'Bundesliga 2025',
        matchType: 'Der Klassiker',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss completed',
        umpires: 'Referee: Felix Brych',
        referee: 'VAR: Marco Fritz',
        stadium: 'Allianz Arena',
        city: 'Munich, Germany',
        capacity: '75000 (approx)',
      },
      {
        id: 'archive-12',
        sport: 'Tennis',
        team1: 'Jannik Sinner',
        team2: 'Daniil Medvedev',
        score1: '2',
        score2: '1',
        status: 'completed',
        result: 'Sinner won (7-6, 4-6, 6-3)',
        date: 'FRI, OCT 25 2025',
        venue: 'O2 Arena',
        tournament: 'ATP Finals',
        series: 'ATP Finals 2025',
        matchType: 'Round Robin',
        team1Logo: '🎾',
        team2Logo: '🎾',
        toss: 'Sinner won the toss and chose to serve',
        umpires: 'Chair Umpire: Carlos Bernardes',
        referee: 'Tournament Referee: Andreas Egli',
        stadium: 'O2 Arena',
        city: 'London, England',
        capacity: '17000 (approx)',
      },
      {
        id: 'archive-13',
        sport: 'Hockey',
        team1: 'Pittsburgh Penguins',
        team2: 'Washington Capitals',
        score1: '4',
        score2: '5',
        status: 'completed',
        result: 'Capitals won (SO)',
        date: 'THU, OCT 24 2025',
        venue: 'PPG Paints Arena',
        tournament: 'NHL Regular Season',
        series: 'NHL 2025',
        matchType: 'Regular Season',
        team1Logo: '🏒',
        team2Logo: '🏒',
        toss: 'Puck drop won by Penguins',
        umpires: 'Referees: Dan O\'Rourke, Kelly Sutherland',
        referee: 'Linesmen: Steve Barton, Jonny Murray',
        stadium: 'PPG Paints Arena',
        city: 'Pittsburgh, PA',
        capacity: '18400 (approx)',
      },
      {
        id: 'archive-14',
        sport: 'Basketball',
        team1: 'Milwaukee Bucks',
        team2: 'Phoenix Suns',
        score1: '128',
        score2: '122',
        status: 'completed',
        result: 'Bucks won',
        date: 'WED, OCT 23 2025',
        venue: 'Fiserv Forum',
        tournament: 'NBA Regular Season',
        series: 'NBA 2025',
        matchType: 'Regular Season',
        team1Logo: '🏀',
        team2Logo: '🏀',
        toss: 'Jump ball won by Bucks',
        umpires: 'Officials: James Capers, David Guthrie, Natalie Sago',
        referee: 'Crew Chief: James Capers',
        stadium: 'Fiserv Forum',
        city: 'Milwaukee, WI',
        capacity: '17500 (approx)',
      },
      {
        id: 'archive-15',
        sport: 'Football',
        team1: 'PSG',
        team2: 'Marseille',
        score1: '2',
        score2: '0',
        status: 'completed',
        result: 'PSG won',
        date: 'TUE, OCT 22 2025',
        venue: 'Parc des Princes',
        tournament: 'Ligue 1',
        series: 'Ligue 1 2025',
        matchType: 'Le Classique',
        team1Logo: '⚽',
        team2Logo: '⚽',
        toss: 'Coin toss completed',
        umpires: 'Referee: Clément Turpin',
        referee: 'VAR: François Letexier',
        stadium: 'Parc des Princes',
        city: 'Paris, France',
        capacity: '48000 (approx)',
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
        <Link 
          to={
            match.status === 'scheduled' 
              ? fromSport === 'all' ? '/schedule' : `/schedule?sport=${fromSport}`
              : match.status === 'completed' 
                ? fromSport === 'all' ? '/archives' : `/archives?sport=${fromSport}`
                : fromSport === 'all' ? '/scores' : `/scores?sport=${fromSport}`
          } 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {match.status === 'scheduled' ? 'Back to Schedule' : match.status === 'completed' ? 'Back to Archives' : 'Back to Scores'}
        </Link>
      </div>

      <div className="px-4 pb-8 mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          {/* Match Header */}
          <div className={`p-6 text-white ${
            match.status === 'live' ? 'bg-gradient-to-r from-green-600 to-green-700' : 
            match.status === 'completed' ? 'bg-gradient-to-r from-gray-700 to-gray-800' :
            'bg-gradient-to-r from-blue-600 to-blue-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className={`!bg-white !border-white font-semibold ${
                match.status === 'live' ? '!text-green-700' : 
                match.status === 'completed' ? '!text-gray-700' :
                '!text-blue-700'
              }`}>{match.sport}</Badge>
              {match.status === 'live' ? (
                <Badge variant="destructive" className="animate-pulse !bg-red-600 !text-white">LIVE</Badge>
              ) : match.status === 'completed' ? (
                <Badge className="!bg-green-600 !text-white font-semibold">COMPLETED</Badge>
              ) : (
                <Badge className="!bg-white !text-blue-700 font-semibold">SCHEDULED</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white">{match.team1} vs {match.team2}</h1>
            <p className="text-white opacity-90">{match.tournament}</p>
          </div>

          {/* Current Score or Match Preview */}
          {match.status === 'live' || match.status === 'completed' ? (
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
              {match.result && (
                <div className="mt-4 p-3 text-center text-sm font-medium text-green-800 rounded bg-green-50">
                  {match.result}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 border-b">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Match starts on</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{match.date}</div>
                <div className="text-lg text-gray-700">{match.time}</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className={`grid w-full ${
              (match.status === 'live' || match.status === 'completed') 
                ? (match.sport === 'Cricket' ? 'grid-cols-5' : 'grid-cols-4')
                : 'grid-cols-2'
            } ${
              match.status === 'live' ? 'bg-green-600' : 
              match.status === 'completed' ? 'bg-gray-700' :
              'bg-blue-600'
            } rounded-none`}>
              <TabsTrigger value="info" className={`data-[state=active]:bg-white ${
                match.status === 'live' ? 'data-[state=active]:text-green-600' : 
                match.status === 'completed' ? 'data-[state=active]:text-gray-700' :
                'data-[state=active]:text-blue-600'
              } text-white rounded-none`}>Info</TabsTrigger>
              {(match.status === 'live' || match.status === 'completed') && (
                <TabsTrigger value="scorecard" className={`data-[state=active]:bg-white ${
                  match.status === 'live' ? 'data-[state=active]:text-green-600' : 'data-[state=active]:text-gray-700'
                } text-white rounded-none`}>
                  {match.sport === 'Cricket' ? 'Scorecard' : 
                   match.sport === 'Football' ? 'Match Stats' :
                   match.sport === 'Basketball' ? 'Box Score' :
                   match.sport === 'Tennis' ? 'Match Stats' :
                   match.sport === 'Hockey' ? 'Box Score' : 'Stats'}
                </TabsTrigger>
              )}
              <TabsTrigger value="squads" className={`data-[state=active]:bg-white ${
                match.status === 'live' ? 'data-[state=active]:text-green-600' : 
                match.status === 'completed' ? 'data-[state=active]:text-gray-700' :
                'data-[state=active]:text-blue-600'
              } text-white rounded-none`}>
                {match.sport === 'Tennis' ? 'Players' : 'Squads'}
              </TabsTrigger>
              {(match.status === 'live' || match.status === 'completed') && (
                <TabsTrigger value="overs" className={`data-[state=active]:bg-white ${
                  match.status === 'live' ? 'data-[state=active]:text-green-600' : 'data-[state=active]:text-gray-700'
                } text-white rounded-none`}>
                  {match.sport === 'Cricket' ? 'Overs' :
                   match.sport === 'Football' ? 'Timeline' :
                   match.sport === 'Basketball' ? 'Play-by-Play' :
                   match.sport === 'Tennis' ? 'Game Log' :
                   match.sport === 'Hockey' ? 'Periods' : 'Details'}
                </TabsTrigger>
              )}
              {(match.status === 'live' || match.status === 'completed') && match.sport === 'Cricket' && (
                <TabsTrigger value="commentary" className={`data-[state=active]:bg-white ${
                  match.status === 'live' ? 'data-[state=active]:text-green-600' : 'data-[state=active]:text-gray-700'
                } text-white rounded-none`}>
                  Commentary
                </TabsTrigger>
              )}
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
                        <span className="text-gray-900">{match.date || 'Today'}</span>
                      </div>
                      <div className="flex justify-between p-4">
                        <span className="font-semibold text-gray-700">Time</span>
                        <span className="text-gray-900">{match.time}</span>
                      </div>
                      {match.matchType && (
                        <div className="flex justify-between p-4">
                          <span className="font-semibold text-gray-700">Match Type</span>
                          <span className="text-gray-900 text-right">{match.matchType}</span>
                        </div>
                      )}
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
              {match.sport === 'Cricket' ? (
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
              ) : match.sport === 'Football' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-base font-bold text-gray-900">MATCH STATISTICS</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">{match.score1 || '0'}</span>
                          <span className="text-sm font-semibold text-gray-600">Goals</span>
                          <span className="text-2xl font-bold text-gray-900">{match.score2 || '0'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">58%</span>
                          <span className="text-sm font-semibold text-gray-600">Possession</span>
                          <span className="text-lg font-semibold text-gray-900">42%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">12</span>
                          <span className="text-sm font-semibold text-gray-600">Shots</span>
                          <span className="text-lg font-semibold text-gray-900">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">6</span>
                          <span className="text-sm font-semibold text-gray-600">Shots on Target</span>
                          <span className="text-lg font-semibold text-gray-900">4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">5</span>
                          <span className="text-sm font-semibold text-gray-600">Corners</span>
                          <span className="text-lg font-semibold text-gray-900">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">2</span>
                          <span className="text-sm font-semibold text-gray-600">Yellow Cards</span>
                          <span className="text-lg font-semibold text-gray-900">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">485</span>
                          <span className="text-sm font-semibold text-gray-600">Passes</span>
                          <span className="text-lg font-semibold text-gray-900">392</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : match.sport === 'Basketball' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-base font-bold text-gray-900">BOX SCORE</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 border-b">
                            <tr>
                              <th className="text-left p-3 font-semibold text-gray-700">Team</th>
                              <th className="text-center p-3 font-semibold text-gray-700">Q1</th>
                              <th className="text-center p-3 font-semibold text-gray-700">Q2</th>
                              <th className="text-center p-3 font-semibold text-gray-700">Q3</th>
                              <th className="text-center p-3 font-semibold text-gray-700">Q4</th>
                              <th className="text-center p-3 font-semibold text-gray-900">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 font-semibold text-gray-900">{match.team1}</td>
                              <td className="text-center p-3 text-gray-700">28</td>
                              <td className="text-center p-3 text-gray-700">24</td>
                              <td className="text-center p-3 text-gray-700">22</td>
                              <td className="text-center p-3 text-gray-700">24</td>
                              <td className="text-center p-3 font-bold text-gray-900">{match.score1}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 font-semibold text-gray-900">{match.team2}</td>
                              <td className="text-center p-3 text-gray-700">26</td>
                              <td className="text-center p-3 text-gray-700">28</td>
                              <td className="text-center p-3 text-gray-700">25</td>
                              <td className="text-center p-3 text-gray-700">23</td>
                              <td className="text-center p-3 font-bold text-gray-900">{match.score2}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="p-6 space-y-4 border-t">
                        <h3 className="font-bold text-gray-900">Team Statistics</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">45%</span>
                          <span className="text-sm font-semibold text-gray-600">Field Goal %</span>
                          <span className="text-lg font-semibold text-gray-900">48%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">38%</span>
                          <span className="text-sm font-semibold text-gray-600">3-Point %</span>
                          <span className="text-lg font-semibold text-gray-900">35%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">42</span>
                          <span className="text-sm font-semibold text-gray-600">Rebounds</span>
                          <span className="text-lg font-semibold text-gray-900">38</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">24</span>
                          <span className="text-sm font-semibold text-gray-600">Assists</span>
                          <span className="text-lg font-semibold text-gray-900">22</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : match.sport === 'Tennis' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-base font-bold text-gray-900">MATCH STATISTICS</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">12</span>
                          <span className="text-sm font-semibold text-gray-600">Aces</span>
                          <span className="text-lg font-semibold text-gray-900">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">3</span>
                          <span className="text-sm font-semibold text-gray-600">Double Faults</span>
                          <span className="text-lg font-semibold text-gray-900">5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">68%</span>
                          <span className="text-sm font-semibold text-gray-600">1st Serve %</span>
                          <span className="text-lg font-semibold text-gray-900">62%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">78%</span>
                          <span className="text-sm font-semibold text-gray-600">1st Serve Points Won</span>
                          <span className="text-lg font-semibold text-gray-900">72%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">45</span>
                          <span className="text-sm font-semibold text-gray-600">Winners</span>
                          <span className="text-lg font-semibold text-gray-900">38</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">22</span>
                          <span className="text-sm font-semibold text-gray-600">Unforced Errors</span>
                          <span className="text-lg font-semibold text-gray-900">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">5/12</span>
                          <span className="text-sm font-semibold text-gray-600">Break Points Won</span>
                          <span className="text-lg font-semibold text-gray-900">3/8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : match.sport === 'Hockey' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-base font-bold text-gray-900">BOX SCORE</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 border-b">
                            <tr>
                              <th className="text-left p-3 font-semibold text-gray-700">Team</th>
                              <th className="text-center p-3 font-semibold text-gray-700">P1</th>
                              <th className="text-center p-3 font-semibold text-gray-700">P2</th>
                              <th className="text-center p-3 font-semibold text-gray-700">P3</th>
                              <th className="text-center p-3 font-semibold text-gray-900">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 font-semibold text-gray-900">{match.team1}</td>
                              <td className="text-center p-3 text-gray-700">1</td>
                              <td className="text-center p-3 text-gray-700">1</td>
                              <td className="text-center p-3 text-gray-700">1</td>
                              <td className="text-center p-3 font-bold text-gray-900">{match.score1}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 font-semibold text-gray-900">{match.team2}</td>
                              <td className="text-center p-3 text-gray-700">0</td>
                              <td className="text-center p-3 text-gray-700">1</td>
                              <td className="text-center p-3 text-gray-700">1</td>
                              <td className="text-center p-3 font-bold text-gray-900">{match.score2}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="p-6 space-y-4 border-t">
                        <h3 className="font-bold text-gray-900">Team Statistics</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">32</span>
                          <span className="text-sm font-semibold text-gray-600">Shots on Goal</span>
                          <span className="text-lg font-semibold text-gray-900">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">2/5</span>
                          <span className="text-sm font-semibold text-gray-600">Power Play</span>
                          <span className="text-lg font-semibold text-gray-900">1/4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">18</span>
                          <span className="text-sm font-semibold text-gray-600">Hits</span>
                          <span className="text-lg font-semibold text-gray-900">22</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">12</span>
                          <span className="text-sm font-semibold text-gray-600">Blocked Shots</span>
                          <span className="text-lg font-semibold text-gray-900">15</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
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
              {match.sport === 'Cricket' ? (
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
              ) : match.sport === 'Football' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Match Timeline</h3>
                  {[
                    { time: '67\'', event: 'Goal', team: match.team1, player: 'Marcus Rashford', desc: 'Assisted by Bruno Fernandes' },
                    { time: '52\'', event: 'Goal', team: match.team2, player: 'Mohamed Salah', desc: 'Penalty kick' },
                    { time: '45\'', event: 'Half Time', team: null, player: null, desc: `${match.team1} 1 - 0 ${match.team2}` },
                    { time: '23\'', event: 'Goal', team: match.team1, player: 'Casemiro', desc: 'Header from corner' },
                    { time: '12\'', event: 'Yellow Card', team: match.team2, player: 'Virgil van Dijk', desc: 'Foul' },
                  ].map((event, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 text-center">
                            <span className="font-bold text-gray-900">{event.time}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 text-xs font-bold rounded ${
                                event.event === 'Goal' ? 'bg-green-100 text-green-800' :
                                event.event === 'Yellow Card' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>{event.event}</span>
                              {event.team && <span className="font-semibold text-gray-900">{event.team}</span>}
                            </div>
                            {event.player && <div className="font-semibold text-gray-900">{event.player}</div>}
                            <div className="text-sm text-gray-600">{event.desc}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : match.sport === 'Basketball' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Play-by-Play</h3>
                  {[
                    { quarter: 'Q4', time: '2:45', team: match.team2, player: 'Stephen Curry', action: '3-pointer', score: `${match.score1}-${match.score2}` },
                    { quarter: 'Q4', time: '3:12', team: match.team1, player: 'LeBron James', action: 'Layup', score: '98-99' },
                    { quarter: 'Q4', time: '4:30', team: match.team2, player: 'Klay Thompson', action: 'Jump shot', score: '96-99' },
                    { quarter: 'Q3', time: '0:05', team: match.team1, player: 'Anthony Davis', action: 'Dunk', score: '96-97' },
                    { quarter: 'Q3', time: '1:23', team: match.team2, player: 'Draymond Green', action: 'Free throw', score: '94-97' },
                  ].map((play, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            <div className="font-bold text-gray-900">{play.quarter}</div>
                            <div className="text-sm text-gray-600">{play.time}</div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{play.team}</div>
                            <div className="text-sm text-gray-700">{play.player} - {play.action}</div>
                          </div>
                          <div className="flex-shrink-0 font-bold text-gray-900">{play.score}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : match.sport === 'Tennis' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Game Log</h3>
                  {[
                    { set: 'Set 3', game: 'Game 10', score: '5-4', winner: match.team1, points: ['15-0', '15-15', '30-15', '40-15', 'Game'] },
                    { set: 'Set 3', game: 'Game 9', score: '4-4', winner: match.team2, points: ['0-15', '0-30', '15-30', '15-40', 'Game'] },
                    { set: 'Set 2', game: 'Game 10', score: '3-6', winner: match.team2, points: ['0-15', '15-15', '15-30', '15-40', 'Game'] },
                  ].map((game, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{game.set} - {game.game}</span>
                            <span className="font-semibold text-gray-900">{game.score}</span>
                          </div>
                          <div className="text-sm text-gray-600">Winner: {game.winner}</div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {game.points.map((point, pointIdx) => (
                            <span key={pointIdx} className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-700">
                              {point}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : match.sport === 'Hockey' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Period Summary</h3>
                  {[
                    { period: 'P2', time: '8:23', team: match.team1, player: 'Connor McDavid', event: 'Goal', assist: 'Leon Draisaitl', score: '3-2' },
                    { period: 'P2', time: '12:45', team: match.team2, player: 'Auston Matthews', event: 'Goal', assist: 'Mitch Marner', score: '2-2' },
                    { period: 'P1', time: '15:30', team: match.team1, player: 'Zach Hyman', event: 'Goal', assist: 'Ryan Nugent-Hopkins', score: '2-1' },
                    { period: 'P1', time: '8:12', team: match.team2, player: 'William Nylander', event: 'Goal', assist: 'John Tavares', score: '1-1' },
                    { period: 'P1', time: '3:45', team: match.team1, player: 'Evan Bouchard', event: 'Goal', assist: 'Connor McDavid', score: '1-0' },
                  ].map((play, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            <div className="font-bold text-gray-900">{play.period}</div>
                            <div className="text-sm text-gray-600">{play.time}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">{play.event}</span>
                              <span className="font-semibold text-gray-900">{play.team}</span>
                            </div>
                            <div className="font-semibold text-gray-900">{play.player}</div>
                            <div className="text-sm text-gray-600">Assisted by {play.assist}</div>
                          </div>
                          <div className="flex-shrink-0 font-bold text-gray-900">{play.score}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}
            </TabsContent>

            {/* Commentary Tab - Cricket Only */}
            {match.sport === 'Cricket' && (
              <TabsContent value="commentary" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Ball-by-Ball Commentary</h3>
                  {[
                    { over: '0.6', bowler: 'Suresh vs Labors', batsman: 'Iqram nemo e', runs: '4 run(s)', commentary: 'FOUR! Beautiful cover drive. Labors pitches it up and Iqram nemo drives it through the covers for a boundary.' },
                    { over: '0.5', bowler: 'Suresh vs Labors', batsman: 'Iqram nemo e', runs: '4 run(s)', commentary: 'FOUR! Short and wide, Iqram nemo cuts it away past point for another boundary.' },
                    { over: '0.4', bowler: 'DAlish vs Labors', batsman: 'Iqram nemo e', runs: '4 run(s)', commentary: 'FOUR! Overpitched delivery, driven straight down the ground for four runs.' },
                    { over: '0.3', bowler: 'DAlish vs Labors', batsman: 'Iqram nemo e', runs: '2 run(s)', commentary: 'Good length delivery, worked away to the leg side for a couple of runs.' },
                    { over: '0.2', bowler: 'DAlish vs Labors', batsman: 'Iqram nemo e', runs: '0 run(s)', commentary: 'Dot ball. Good length delivery outside off, left alone by the batsman.' },
                    { over: '0.1', bowler: 'Suresh vs Labors', batsman: 'Iqram nemo e', runs: '1 run(s)', commentary: 'Single taken. Good length ball, pushed to mid-off for a quick single.' },
                  ].map((ball, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 text-center">
                            <div className="font-bold text-gray-900">{ball.over}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-gray-900">{ball.bowler}</span>
                              <span className="text-sm text-gray-600">to</span>
                              <span className="text-sm font-semibold text-gray-900">{ball.batsman}</span>
                              <span className={`ml-auto px-2 py-1 text-xs font-bold rounded ${
                                ball.runs.includes('4') || ball.runs.includes('6') 
                                  ? 'bg-green-100 text-green-800' 
                                  : ball.runs.includes('0') 
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {ball.runs}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{ball.commentary}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPage;
