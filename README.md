# MoodTunes - Emotion-Based Playlist Generator

# Week 1, commit = 7646cbc1a3e559a79cc52877fc0b21d6cfa93a8d

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

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (comes with Node.js)
- A Brown University email address (required for authentication)

You'll also need the following API keys:

- Spotify API credentials (Client ID and Client Secret)
- OpenAI API key
- Clerk Publishable key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd term-project-linda-isa-rafa-allyson
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Set up environment variables:

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

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

The backend will run on http://localhost:3001

2. In a new terminal, start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:3000

## Running Tests

### Backend Tests

The backend uses Jest for testing the API endpoints. To run the tests:

```bash
cd backend
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Frontend Tests

The frontend uses Playwright for end-to-end testing. To run the tests:

1. First, install the required browsers:

```bash
cd frontend
npx playwright install
```

2. Run the tests:

```bash
npx playwright test
```

To run tests with UI mode:

```bash
npx playwright test --ui
```

To run tests in a specific browser:

```bash
npx playwright test --project=chromium
```

## Features

- Authentication with Brown University email addresses
- Emotion and memory-based playlist generation
- Integration with Spotify for song recommendations
- AI-powered song selection using OpenAI
- Preview functionality for recommended songs
- Responsive design for all devices

## Tech Stack

- Frontend:

  - React with TypeScript
  - Vite for build tooling
  - Clerk for authentication
  - Playwright for testing

- Backend:
  - Node.js with Express
  - TypeScript
  - Jest for testing
  - Spotify Web API
  - OpenAI API

## Troubleshooting

1. If you encounter CORS issues:

   - Ensure both frontend and backend are running
   - Check that the backend URL is correctly set in the frontend

2. If authentication fails:

   - Verify your Clerk publishable key
   - Ensure you're using a Brown University email address

3. If tests fail:
   - Make sure all dependencies are installed
   - Check that environment variables are properly set
   - Ensure the application is not running while running tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
