import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Emotion to audio features mapping based on research
export const emotionToAudioFeatures = {
  joyful: {
    minValence: 0.7,
    minEnergy: 0.7,
    minDanceability: 0.6,
    tempo: { min: 120, max: 140 }
  },
  nostalgic: {
    valence: { min: 0.4, max: 0.7 },
    energy: { min: 0.3, max: 0.6 },
    acousticness: { min: 0.4 },
    tempo: { min: 70, max: 120 }
  },
  bittersweet: {
    valence: { min: 0.3, max: 0.6 },
    energy: { min: 0.3, max: 0.5 },
    instrumentalness: { min: 0.2 },
    tempo: { min: 60, max: 100 }
  }
};