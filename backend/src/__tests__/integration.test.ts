import request from 'supertest';
import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { PlaylistController } from '../controllers/playlist.controller';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth';
import { SpotifyService } from '../services/spotify.service';

// Mock the database
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue(true),
    end: jest.fn().mockResolvedValue(true)
  };
  return { Pool: jest.fn(() => mockPool) };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token'),
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    next();
  })
}));

// Mock Spotify service
jest.mock('../services/spotify.service', () => {
  return {
    SpotifyService: {
      getInstance: jest.fn().mockReturnValue({
        getRecommendationsBasedOnTopTracks: jest.fn().mockResolvedValue({
          tracks: [
            { id: '1', name: 'Track 1', uri: 'spotify:track:1' },
            { id: '2', name: 'Track 2', uri: 'spotify:track:2' }
          ]
        }),
        createPlaylist: jest.fn().mockResolvedValue('playlist123'),
        getUserTopTracks: jest.fn().mockResolvedValue([
          { id: '1', name: 'Track 1', uri: 'spotify:track:1' }
        ])
      })
    }
  };
});

describe('API Integration Tests', () => {
  let app: express.Application;
  let mockPool: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Get the mock pool instance
    mockPool = new Pool();

    // Setup routes with auth middleware
    app.post('/api/auth/register', AuthController.register);
    app.post('/api/auth/login', AuthController.login);
    app.post('/api/playlists/generate', (req, res, next) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    }, PlaylistController.generatePlaylist);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      // Mock database responses
      mockPool.query.mockImplementation((query: string, params: string[]) => {
        if (query.includes('SELECT * FROM users')) {
          return Promise.resolve({ rows: [] });
        }
        if (query.includes('INSERT INTO users')) {
          return Promise.resolve({ 
            rows: [{ 
              id: 'test-user-id', 
              email: params[0]
            }] 
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe('mock-token');
      expect(response.body).toHaveProperty('id');
    });

    it('should login existing user', async () => {
      // Mock database responses
      mockPool.query.mockImplementation((query: string) => {
        if (query.includes('SELECT * FROM users')) {
          return Promise.resolve({ 
            rows: [{ 
              id: 'test-user-id', 
              email: 'test@example.com',
              password_hash: '$2b$10$hashedpassword'
            }] 
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe('mock-token');
      expect(response.body).toHaveProperty('id');
    });

    it('should reject invalid credentials', async () => {
      // Mock database responses
      mockPool.query.mockImplementation((query: string) => {
        if (query.includes('SELECT * FROM users')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Playlist Generation', () => {
    it('should generate playlist with valid emotion', async () => {
      // Mock database responses
      mockPool.query.mockImplementation((query: string) => {
        if (query.includes('INSERT INTO memories')) {
          return Promise.resolve({ 
            rows: [{ 
              id: 'memory123'
            }] 
          });
        }
        if (query.includes('INSERT INTO playlists')) {
          return Promise.resolve({ 
            rows: [{ 
              id: 'playlist123',
              user_id: 'test-user-id',
              memory_id: 'memory123',
              spotify_playlist_id: 'playlist123'
            }] 
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/playlists/generate')
        .send({
          emotion: 'joyful',
          memoryText: 'Test memory'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('playlistId');
      expect(response.body.playlistId).toBe('playlist123');
    });

    it('should handle missing emotion', async () => {
      const response = await request(app)
        .post('/api/playlists/generate')
        .send({
          memoryText: 'Test memory'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});