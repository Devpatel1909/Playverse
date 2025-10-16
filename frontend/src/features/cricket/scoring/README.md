# Cricket Live Scoring System

This directory contains the live cricket scoring functionality for the Playverse admin system.

## Components

### ScoreUpdatePage.jsx
The main live scoring interface that allows admins to:
- Record ball-by-ball scoring
- Update batsmen and bowlers
- Handle wickets and extras
- Complete overs and innings
- End matches

**Route**: `/admin/cricket/score/:matchId`

**Features**:
- Quick score buttons (0, 1, 2, 3, 4, 6, Wide, No Ball)
- Detailed ball input form
- Match controls (switch batsmen, change bowler, complete over)
- Error recovery and corrections
- Real-time scoreboard integration

### ScoreBoard.jsx
Real-time scoreboard component that displays:
- Current match score and statistics
- Batsmen and bowler statistics
- Partnership details
- Recent balls
- Match status

**Features**:
- WebSocket integration for real-time updates
- Auto-refresh functionality
- Run rate calculations
- Target and required run rate (for second innings)

### PlayerSelector.jsx
Modal components for selecting players:

**BatsmanSelector**: Selects new batsmen when wickets fall
**BowlerSelector**: Changes current bowler
**PlayerSelector**: Generic player selection component

**Features**:
- Search by name or jersey number
- Filter available players based on match rules
- Show player statistics during match
- Exclude already playing/out players

## Services

### cricketScoringAPI.js
API service for all scoring operations:
- Record balls and match events
- Update batsmen and bowlers
- Get match statistics
- Handle error recovery
- WebSocket support for real-time updates

## Usage

1. Navigate to Cricket Admin page (`/admin/cricket`)
2. Find a match in the matches section
3. Click "🏏 Live Scoring" to start scoring
4. Use quick buttons or detailed form to record balls
5. Use match controls for player changes and match flow

## Integration

The scoring system integrates with:
- Cricket Admin dashboard
- Match management system
- Team and player data
- Real-time updates via WebSocket
- Authentication system

## Future Enhancements

- Ball-by-ball commentary
- Detailed match statistics
- Match highlights and key moments
- Multi-device synchronization
- Spectator view mode
