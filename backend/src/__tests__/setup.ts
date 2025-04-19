import { Pool } from 'pg';

// Mock the database connection
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockImplementation((query, params) => {
      if (query.includes('INSERT INTO users')) {
        return Promise.resolve({ rows: [{ id: 'test-user-id' }] });
      }
      if (query.includes('SELECT * FROM users')) {
        return Promise.resolve({ 
          rows: [{ 
            id: 'test-user-id', 
            email: 'test@example.com',
            password: '$2b$10$hashedpassword' // Mock hashed password
          }] 
        });
      }
      return Promise.resolve({ rows: [] });
    }),
    connect: jest.fn().mockResolvedValue(true),
    end: jest.fn().mockResolvedValue(true)
  };
  return { Pool: jest.fn(() => mockPool) };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
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