MoodTunes - Emotion-Based Playlist Generator

Week 1 
commit = 7646cbc1a3e559a79cc52877fc0b21d6cfa93a8d
Github link: https://github.com/cs0320-s25/term-project-linda-isa-rafa-allyson.git

Project Overview

MoodTunes is a web application that generates personalized Spotify playlists based on user emotions and memories. The application uses AI to analyze emotional context and creates playlists that match the user's mood.


Backend (Completed)

- Authentication System: Implemented using Clerk for secure Google OAuth
- Spotify Integration:
  - Spotify Web API integration for playlist generation
  - User top tracks retrieval
  - Emotion-based recommendations
-  PostgreSQL for storing user data and playlist history


  - `/api/auth/*` - Authentication routes
  - `/api/playlists/generate` - Playlist generation
  - `/api/playlists/top` - User's top tracks

Frontend 

  - Implemented Clerk authentication
  - Google OAuth integration
  - Protected routes
  - Header with authentication controls
  - Playlist generator form
  - Home page


What we achived: 

1. Successfully integrated Clerk for secure authentication
2. Working API endpoints for playlist generation
3. Functional PostgreSQL integration for data persistence
4. Clean component architecture with proper routing

What we need to do next: 

1. Complete environment configuration
2. Implement error handling and loading states
3. Add playlist visualization component
4. Enhance user experience with animations and transitions
5. Add unit and integration tests


Needed API keys:

- Spotify API credentials (Client ID and Client Secret)
- OpenAI API key
- Clerk Publishable key

To install: 

1. Clone the repository
2. Install dependencies:
   cd backend
   npm install

   cd frontend
   npm install
  

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


Set up environment variables:

Backend (.env):

```plaintext
PORT=3001
NODE_ENV=development
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
OPENAI_API_KEY=your_openai_api_key
```

Frontend (.env):

```plaintext
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

To run tests: 

The backend uses Jest for testing the API endpoints. To run the tests:
cd backend
npm test

To run tests in watch mode:
npm run test:watch

Front end tests: 

The frontend uses Playwright for end-to-end testing. To run the tests:

```bash
cd frontend
npx playwright install
```

```bash
npx playwright test
```

To run tests with UI mode:

```bash
npx playwright test --ui
```

## Features

- Authentication with Brown University email addresses
- Emotion and memory-based playlist generation
- Integration with Spotify for song recommendations
- AI-powered song selection using OpenAI
- Preview functionality for recommended songs
- Responsive design for all devices