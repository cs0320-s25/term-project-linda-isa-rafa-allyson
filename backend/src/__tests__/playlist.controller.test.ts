import { Request, Response } from 'express';
import { PlaylistController } from '../controllers/playlist.controller';
import { SpotifyService } from '../services/spotify.service';

jest.mock('../services/spotify.service');

describe('PlaylistController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockSpotifyService: jest.Mocked<SpotifyService>;

  beforeEach(() => {
    mockRequest = {
      body: {
        emotion: 'joyful',
        memoryText: 'Happy summer day',
        userId: '123'
      },
      user: {
        id: '123',
        email: 'test@example.com'
      }
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockSpotifyService = {
      createPlaylist: jest.fn().mockResolvedValue('playlist123'),
      getInstance: jest.fn()
    } as unknown as jest.Mocked<SpotifyService>;
  });

  describe('generatePlaylist', () => {
    it('should generate playlist successfully', async () => {
      await PlaylistController.generatePlaylist(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        playlistId: expect.any(String)
      });
    });

    it('should handle errors appropriately', async () => {
      mockSpotifyService.createPlaylist.mockRejectedValue(new Error('API Error'));

      await PlaylistController.generatePlaylist(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to generate playlist'
      });
    });
  });
});