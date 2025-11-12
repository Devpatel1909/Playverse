# Cricket Management API Documentation

## Base URL
```
http://localhost:5000/api/cricket
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Team Endpoints

### GET /teams
Get all active teams
- **Method**: GET
- **Auth**: Not required
- **Response**: Array of team objects with player counts

### GET /teams/:id
Get single team by ID
- **Method**: GET
- **Auth**: Not required
- **Parameters**: 
  - `id` (string): Team MongoDB ObjectId
- **Response**: Team object with all players

### POST /teams
Create new team
- **Method**: POST
- **Auth**: Optional
- **Body**:
  ```json
  {
    "name": "Team Name",
    "shortName": "TN",
    "captain": "Captain Name",
    "coach": "Coach Name",
    "established": "2024",
    "homeGround": "Ground Name",
    "contactEmail": "team@email.com",
    "contactPhone": "+91 9876543210",
    "logo": "base64-image-data (optional)"
  }
  ```

### PUT /teams/:id
Update team information
- **Method**: PUT
- **Auth**: Optional
- **Parameters**: 
  - `id` (string): Team MongoDB ObjectId
- **Body**: Partial team object with fields to update

### DELETE /teams/:id
Delete team (soft delete)
- **Method**: DELETE
- **Auth**: Optional
- **Parameters**: 
  - `id` (string): Team MongoDB ObjectId

### PUT /teams/:teamId/logo
Upload team logo
- **Method**: PUT
- **Auth**: Optional
- **Parameters**: 
  - `teamId` (string): Team MongoDB ObjectId
- **Body**:
  ```json
  {
    "logo": "base64-image-data"
  }
  ```

---

## Player Endpoints

### POST /teams/:teamId/players
Add player to team
- **Method**: POST
- **Auth**: Optional
- **Parameters**: 
  - `teamId` (string): Team MongoDB ObjectId
- **Body**:
  ```json
  {
    "name": "Player Name",
    "role": "Batsman",
    "age": 25,
    "jerseyNumber": 10,
    "experience": "5 years",
    "contactPhone": "+91 9876543210",
    "contactEmail": "player@email.com",
    "matches": 0,
    "runs": 0,
    "wickets": 0,
    "catches": 0,
    "stumps": 0,
    "average": 0,
    "strikeRate": 0,
    "economy": 0,
    "photo": "base64-image-data (optional)"
  }
  ```

### PUT /teams/:teamId/players/:playerId
Update player information
- **Method**: PUT
- **Auth**: Optional
- **Parameters**: 
  - `teamId` (string): Team MongoDB ObjectId
  - `playerId` (string): Player MongoDB ObjectId
- **Body**: Partial player object with fields to update

### DELETE /teams/:teamId/players/:playerId
Remove player from team
- **Method**: DELETE
- **Auth**: Optional
- **Parameters**: 
  - `teamId` (string): Team MongoDB ObjectId
  - `playerId` (string): Player MongoDB ObjectId

### PUT /teams/:teamId/players/:playerId/photo
Upload player photo
- **Method**: PUT
- **Auth**: Optional
- **Parameters**: 
  - `teamId` (string): Team MongoDB ObjectId
  - `playerId` (string): Player MongoDB ObjectId
- **Body**:
  ```json
  {
    "photo": "base64-image-data"
  }
  ```

---

## Statistics Endpoints

### GET /teams/stats
Get overall cricket statistics
- **Method**: GET
- **Auth**: Not required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalTeams": 5,
      "totalPlayers": 45,
      "averagePlayersPerTeam": 9
    }
  }
  ```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Player Roles
- Captain/Batsman
- Captain/Bowler
- Captain/All-rounder
- Captain/Wicket Keeper
- Batsman
- Fast Bowler
- Spin Bowler
- All-rounder
- Wicket Keeper
- Opening Batsman
- Middle Order Batsman
- Finisher

---

## Validation Rules

### Team Validation
- Maximum 15 players per team
- Unique team name and short name
- Short name max 10 characters
- Valid email format required

### Player Validation
- Unique jersey numbers within team (1-99)
- Age between 16-45 years
- All required fields must be provided
- Valid email format if provided

---

## Testing with curl

### Create a team
```bash
curl -X POST http://localhost:5000/api/cricket/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "name": "Test Warriors",
    "shortName": "TW",
    "captain": "John Doe",
    "coach": "Jane Smith",
    "established": "2024",
    "homeGround": "Test Stadium",
    "contactEmail": "test@warriors.com",
    "contactPhone": "+91 9876543210"
  }'
```

### Get all teams
```bash
curl -X GET http://localhost:5000/api/cricket/teams
```

### Add a player
```bash
curl -X POST http://localhost:5000/api/cricket/teams/{TEAM_ID}/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "name": "Test Player",
    "role": "Batsman",
    "age": 25,
    "jerseyNumber": 10,
    "experience": "3 years"
  }'
```
