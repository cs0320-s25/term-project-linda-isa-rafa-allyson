import { SpotifyService } from '../services/spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';

// Mock Spotify Web API
jest.mock('spotify-web-api-node');

describe('SpotifyService', () => {
  let spotifyService: SpotifyService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    spotifyService = SpotifyService.getInstance();
  });

  describe('getRecommendationsBasedOnTopTracks', () => {
    it('should return recommendations based on emotion', async () => {
      const mockRecommendations = {
        body: {
          tracks: [
            { id: '1', name: 'Happy Song', uri: 'spotify:track:1' },
            { id: '2', name: 'Joyful Tune', uri: 'spotify:track:2' }
          ]
        },
        headers: {},
        statusCode: 200
      };

      // Mock the Spotify API calls
      (SpotifyWebApi as jest.MockedClass<typeof SpotifyWebApi>).prototype.getRecommendations
        .mockResolvedValue(mockRecommendations as any);

      const result = await spotifyService.getRecommendationsBasedOnTopTracks('joyful');

      expect(result).toBeDefined();
      expect(result.tracks).toHaveLength(2);
      expect(result.tracks[0].name).toBe('Happy Song');
    });

    it('should throw error for invalid emotion', async () => {
      await expect(
        spotifyService.getRecommendationsBasedOnTopTracks('invalid-emotion')
      ).rejects.toThrow('Unsupported emotion');
    });
  });

  describe('getMyTopTracks', () => {
    it('should return top tracks', async () => {
      const mockTopTracks = {
        body: {
          items: [
            { id: '1', name: 'Track 1', artists: [{ name: 'Artist 1' }], uri: 'spotify:track:1' }
          ]
        },
        headers: {},
        statusCode: 200
      };

      // Mock the Spotify API calls
      (SpotifyWebApi as jest.MockedClass<typeof SpotifyWebApi>).prototype.getMyTopTracks
        .mockResolvedValue(mockTopTracks);

      const result = await spotifyService.getMyTopTracks();

      expect(result).toBeDefined();
      expect(result.tracks).toHaveLength(1);
      expect(result.tracks[0].name).toBe('Track 1');
    });
  });
});