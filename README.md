# MoodTunes - Emotion-Based Playlist Generator

# Week 1, commit = b86b00b21392c3e3e14393a4fd4ca7efea0b0c8e

## Project Overview
MoodTunes is a web application that generates personalized Spotify playlists based on user emotions and memories. The application uses AI to analyze emotional context and creates playlists that match the user's mood.

## Implementation Status

### Backend (Completed)
- **Authentication System**: Implemented using Clerk for secure Google OAuth
- **Spotify Integration**: 
  - Spotify Web API integration for playlist generation
  - User top tracks retrieval
  - Emotion-based recommendations
- **Database**: PostgreSQL for storing user data and playlist history
- **API Endpoints**:
  - `/api/auth/*` - Authentication routes
  - `/api/playlists/generate` - Playlist generation
  - `/api/playlists/top` - User's top tracks

### Frontend (In Progress)
- **Authentication**: 
  - Implemented Clerk authentication
  - Google OAuth integration
  - Protected routes
- **Components**:
  - Header with authentication controls
  - Playlist generator form
  - Home page
- **Styling**: 
  - Material-UI theme
  - Tailwind CSS for component styling
  - Responsive design

## Technical Feasibility

### Achieved
1. **Authentication**: Successfully integrated Clerk for secure authentication
2. **Spotify Integration**: Working API endpoints for playlist generation
3. **Database**: Functional PostgreSQL integration for data persistence
4. **Frontend Structure**: Clean component architecture with proper routing

### Current Hurdles
1. **Environment Setup**: Need to configure Clerk environment variables
2. **Type Definitions**: Pending installation of @types/node for process.env
3. **API Integration**: Need to ensure proper error handling for Spotify API calls
4. **State Management**: Consider implementing global state management for playlist data

## Next Steps
1. Complete environment configuration
2. Implement error handling and loading states
3. Add playlist visualization component
4. Enhance user experience with animations and transitions
5. Add unit and integration tests

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- Spotify Developer Account
- Clerk Account

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Add required credentials for Clerk, Spotify, and PostgreSQL

4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the MIT License.

