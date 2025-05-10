import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

// Define types for audio features
interface AudioFeatures {
  valence: { min: number; max?: number } | number;
  energy: { min: number; max?: number } | number;
  danceability?: { min: number; max?: number } | number;
  acousticness?: { min: number; max?: number } | number;
  instrumentalness?: { min: number; max?: number } | number;
  tempo: { min: number; max: number };
}

interface EmotionFeatures {
  [key: string]: AudioFeatures;
}

// Emotion to audio features mapping
const emotionToAudioFeatures: EmotionFeatures = {
  joyful: {
    valence: { min: 0.7 },
    energy: { min: 0.7 },
    danceability: { min: 0.6 },
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

export class SpotifyService {
  private static instance: SpotifyService;
  private spotifyApi: SpotifyWebApi;
  private cache: Map<string, any>;

  private constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
      accessToken: process.env.SPOTIFY_ACCESS_TOKEN
    });
    this.cache = new Map();
  }

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  async getUserTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term', limit: number = 5): Promise<any> {
    try {
      const response = await this.spotifyApi.getMyTopTracks({
        time_range: timeRange,
        limit: limit
      });

      return response.body.items.map(track => ({
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', '),
        id: track.id,
        uri: track.uri
      }));
    } catch (error) {
      console.error('Error getting user top tracks:', error);
      throw error;
    }
  }

  async setAccessToken(token: string): Promise<void> {
    this.spotifyApi.setAccessToken(token);
  }

  private async ensureAccessToken(): Promise<void> {
    try {
      await this.spotifyApi.getMe();
    } catch (error) {
      try {
        const data = await this.spotifyApi.clientCredentialsGrant();
        this.spotifyApi.setAccessToken(data.body['access_token']);
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        throw new Error('Failed to get Spotify access token');
      }
    }
  }

  async getRecommendationsBasedOnTopTracks(emotion: string, limit: number = 20): Promise<any> {
    await this.ensureAccessToken();

    try {
      const topTracks = await this.getUserTopTracks('medium_term', 5);
      const trackIds = topTracks.map((track: any) => track.id);

      const features = emotionToAudioFeatures[emotion];
      if (!features) {
        throw new Error(`Unsupported emotion: ${emotion}`);
      }

      const recommendations = await this.spotifyApi.getRecommendations({
        seed_tracks: trackIds.slice(0, 5),
        target_valence: typeof features.valence === 'number' ? features.valence : features.valence.min,
        target_energy: typeof features.energy === 'number' ? features.energy : features.energy.min,
        target_danceability: features.danceability && (typeof features.danceability === 'number' ? features.danceability : features.danceability.min),
        min_tempo: features.tempo.min,
        max_tempo: features.tempo.max,
        limit
      });

      return recommendations.body;
    } catch (error) {
      console.error('Error getting recommendations based on top tracks:', error);
      throw error;
    }
  }

  async createPlaylist(userId: string, emotion: string, memoryText: string): Promise<string> {
    await this.ensureAccessToken();

    try {
      const recommendations = await this.getRecommendationsBasedOnTopTracks(emotion);

      const playlist = await this.spotifyApi.createPlaylist(`${emotion} Playlist`, {
        description: `Generated based on ${emotion} emotion`,
        public: false
      });

      const trackUris = recommendations.tracks.map((track: any) => track.uri);
      await this.spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

      return playlist.body.id;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw new Error('Failed to create playlist');
    }
  }

  async searchTracks(query: string, limit: number = 20): Promise<any> {
    await this.ensureAccessToken();

    try {
      const results = await this.spotifyApi.searchTracks(query, { limit });
      return results.body;
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw error;
    }
  }

  async getAudioFeatures(trackId: string): Promise<any> {
    await this.ensureAccessToken();

    try {
      const features = await this.spotifyApi.getAudioFeaturesForTrack(trackId);
      return features.body;
    } catch (error) {
      console.error('Error getting audio features:', error);
      throw error;
    }
  }
}