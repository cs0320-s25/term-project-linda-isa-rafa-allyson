import { SpotifyService } from '../services/spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';

// Mock Spotify Web API
jest.mock('spotify-web-api-node', () => {
  const mockSpotifyApi = {
    getMyTopTracks: jest.fn(),
    getRecommendations: jest.fn(),
    setAccessToken: jest.fn(),
    getMe: jest.fn(),
    clientCredentialsGrant: jest.fn()
  };
  return jest.fn(() => mockSpotifyApi);
});

describe('SpotifyService', () => {
  let spotifyService: SpotifyService;
  let mockSpotifyApi: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Get the mock instance
    mockSpotifyApi = new SpotifyWebApi();
    // Reset the singleton instance
    (SpotifyService as any).instance = null;
    spotifyService = SpotifyService.getInstance();
  });

  describe('getRecommendationsBasedOnTopTracks', () => {
    it('should return recommendations based on emotion', async () => {
      // Mock getMyTopTracks response
      mockSpotifyApi.getMyTopTracks.mockResolvedValue({
        body: {
          items: [
            { id: '1', name: 'Track 1', artists: [{ name: 'Artist 1' }], uri: 'spotify:track:1' }
          ]
        }
      });

      // Mock getRecommendations response
      mockSpotifyApi.getRecommendations.mockResolvedValue({
        body: {
          tracks: [
            { id: '1', name: 'Happy Song', uri: 'spotify:track:1' },
            { id: '2', name: 'Joyful Tune', uri: 'spotify:track:2' }
          ]
        }
      });

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

  describe('getUserTopTracks', () => {
    it('should return top tracks', async () => {
      // Mock getMyTopTracks response
      mockSpotifyApi.getMyTopTracks.mockResolvedValue({
        body: {
          items: [
            { 
              id: '1', 
              name: 'Track 1', 
              artists: [{ name: 'Artist 1' }], 
              uri: 'spotify:track:1' 
            }
          ]
        }
      });

      const result = await spotifyService.getUserTopTracks();

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Track 1');
    });
  });
});