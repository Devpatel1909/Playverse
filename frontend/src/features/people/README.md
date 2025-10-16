# Public Score Viewing Feature

This feature provides a public-facing interface for viewing live sports scores without requiring authentication.

## Features

- **Live Score Display**: Real-time scores for ongoing matches across multiple sports
- **Recent Results**: View completed match results
- **Sport Filtering**: Filter scores by specific sports (Cricket, Football, Basketball, etc.)
- **Auto-refresh**: Scores update automatically every 30 seconds
- **Responsive Design**: Works on desktop and mobile devices
- **No Authentication Required**: Public access for all users

## Components

### Pages
- `PublicScoreView.jsx` - Main public score viewing page

### Components
- `ScoreCard.jsx` - Individual match score display card
- `LiveScoreTicker.jsx` - Scrolling ticker for live scores
- `MatchDetailsModal.jsx` - Detailed match information modal

### Services
- `publicScoreAPI.js` - API service for fetching public score data

## Usage

### Accessing the Public Score View
Navigate to `/scores` in your browser to view the public score page.

### API Endpoints
The following public API endpoints are available:

- `GET /api/public/live-matches` - Get all live matches
- `GET /api/public/recent-matches` - Get recent completed matches
- `GET /api/public/upcoming-matches` - Get upcoming matches
- `GET /api/public/match/:matchId` - Get specific match details
- `GET /api/public/cricket/commentary/:matchId` - Get cricket commentary
- `GET /api/public/sports` - Get available sports
- `GET /api/public/search` - Search matches
- `GET /api/public/statistics` - Get sports statistics

### Query Parameters
- `sport` - Filter by sport (e.g., `?sport=Cricket`)
- `limit` - Limit number of results (e.g., `?limit=5`)
- `q` - Search query (e.g., `?q=Mumbai`)

## Features by Sport

### Cricket
- Ball-by-ball scores with overs
- Current batsmen and bowler information
- Live commentary (for live matches)
- Detailed scorecards

### Other Sports (Football, Basketball, etc.)
- Current scores
- Match time/period information
- Basic match statistics

## Auto-refresh
- Live scores refresh every 30 seconds automatically
- Users can pause auto-refresh by hovering over content
- Manual refresh available through browser refresh

## Responsive Design
- Mobile-first design approach
- Optimized for various screen sizes
- Touch-friendly interface for mobile devices

## Error Handling
- Graceful fallback to mock data if API is unavailable
- Loading states for better user experience
- Error messages for failed requests

## Future Enhancements
- WebSocket integration for real-time updates
- Push notifications for score updates
- Social sharing features
- Match predictions and statistics
- Historical match data
- Player statistics and profiles