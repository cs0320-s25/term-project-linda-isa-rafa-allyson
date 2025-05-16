import { Request, Response } from 'express';
import { PlaylistController } from '../controllers/playlist.controller';
import { SpotifyService } from '../services/spotify.service';
import { Pool } from 'pg';

// Mock SpotifyService
jest.mock('../services/spotify.service', () => ({
  SpotifyService: {
    getInstance: jest.fn().mockReturnValue({
      createPlaylist: jest.fn().mockResolvedValue('playlist123'),
      getUserTopTracks: jest.fn().mockResolvedValue([
        { id: '1', name: 'Happy Song' },
        { id: '2', name: 'Joyful Tune' }
      ])
    })
  }
}));

// Mock database
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 'memory123' }] }),
    connect: jest.fn().mockResolvedValue(true),
    end: jest.fn().mockResolvedValue(true)
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('PlaylistController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        emotion: 'joyful',
        memoryText: 'A happy memory'
      },
      user: {
        id: 'test-user-id',
        email: 'test@example.com'
      }
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
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

    it('should handle missing emotion', async () => {
      mockRequest.body = { memoryText: 'A happy memory' };
      
      await PlaylistController.generatePlaylist(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to generate playlist'
      });
    });

    it('should handle unauthenticated user', async () => {
      mockRequest.user = undefined;
      
      await PlaylistController.generatePlaylist(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not authenticated'
      });
    });
  });

  describe('getTopTracks', () => {
    it('should get top tracks successfully', async () => {
      await PlaylistController.getTopTracks(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith([
        { id: '1', name: 'Happy Song' },
        { id: '2', name: 'Joyful Tune' }
      ]);
    });
  });
});