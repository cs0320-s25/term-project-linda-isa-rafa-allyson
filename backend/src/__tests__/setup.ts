import { Pool } from 'pg';

// Mock the database connection
const mockQuery = jest.fn();
jest.mock('pg', () => {
  const mockPool = {
    query: mockQuery,
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

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockReturnValue({ id: 'test-user-id' })
}));

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

// Reset mocks before each test
beforeEach(() => {
  mockQuery.mockReset();
  mockQuery.mockImplementation((query, params) => {
    // Handle user queries
    if (query.includes('SELECT * FROM users')) {
      if (params && params[0] === 'test@example.com') {
        return Promise.resolve({ 
          rows: [{ 
            id: 'test-user-id', 
            email: 'test@example.com',
            password_hash: '$2b$10$hashedpassword'
          }] 
        });
      }
      return Promise.resolve({ rows: [] });
    }
    // Handle user insertion
    if (query.includes('INSERT INTO users')) {
      return Promise.resolve({ 
        rows: [{ 
          id: 'test-user-id', 
          email: params[0]
        }] 
      });
    }
    // Handle memory and playlist queries
    if (query.includes('INSERT INTO memories') || query.includes('INSERT INTO playlists')) {
      return Promise.resolve({ rows: [{ id: 'test-id' }] });
    }
    return Promise.resolve({ rows: [] });
  });
}); 