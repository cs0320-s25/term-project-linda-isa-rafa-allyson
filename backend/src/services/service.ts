import { spotifyApi, emotionToAudioFeatures } from '../config/spotify.config';
import Redis from 'redis';
import SpotifyWebApi from 'spotify-web-api-node';

const redisClient = Redis.createClient();

export class SpotifyService {
  private static instance: SpotifyService;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  async refreshAccessToken(): Promise<void> {
    try {
      const data = await spotifyApi.refreshAccessToken();
      spotifyApi.setAccessToken(data.body['access_token']);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  async getRecommendations(emotion: string, limit: number = 20): Promise<any> {
    const cacheKey = `recommendations:${emotion}:${limit}`;
    const cachedResults = await redisClient.get(cacheKey);

    if (cachedResults) {
      return JSON.parse(cachedResults);
    }

    const features = emotionToAudioFeatures[emotion as keyof typeof emotionToAudioFeatures];
    
    try {
      const recommendations = await spotifyApi.getRecommendations({
        target_valence: features.valence?.min || 0.5,
        target_energy: features.energy?.min || 0.5,
        target_danceability: features.minDanceability || 0.5,
        min_tempo: features.tempo?.min || 0,
        max_tempo: features.tempo?.max || 200,
        limit
      });

      // Cache the results for 1 hour
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(recommendations.body));
      return recommendations.body;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async createPlaylist(userId: string, emotion: string, memoryText: string): Promise<string> {
    try {
      const recommendations = await this.getRecommendations(emotion);
      const playlist = await spotifyApi.createPlaylist(`${emotion} Playlist`, {
        description: `Generated based on ${emotion} emotion`,
        public: false
      });

      const trackUris = recommendations.tracks.map((track: any) => track.uri);
      await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

      return playlist.body.id;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }
}