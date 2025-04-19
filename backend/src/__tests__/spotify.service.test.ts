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
});