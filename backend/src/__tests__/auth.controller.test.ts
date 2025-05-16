import { Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock the database
jest.mock('pg', () => {
  const mockQuery = jest.fn();
  const mockPool = {
    query: mockQuery,
    connect: jest.fn().mockResolvedValue(true),
    end: jest.fn().mockResolvedValue(true)
  };
  return { 
    Pool: jest.fn(() => mockPool),
    mockQuery // Export the mock function for use in tests
  };
});

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    // Get the mock query function from the pg mock
    mockQuery = (require('pg') as any).mockQuery;
    // Reset mocks
    mockQuery.mockReset();
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Mock that user doesn't exist
      mockQuery.mockImplementation((query, params) => {
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

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-user-id',
          email: 'test@example.com',
          token: expect.any(String)
        })
      );
    });

    it('should handle existing user', async () => {
      // Mock that user already exists
      mockQuery.mockImplementation((query) => {
        if (query.includes('SELECT * FROM users')) {
          return Promise.resolve({ 
            rows: [{ 
              id: 'existing-user-id', 
              email: 'test@example.com' 
            }] 
          });
        }
        return Promise.resolve({ rows: [] });
      });

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User already exists'
      });
    });
  });

  describe('login', () => {
    it('should login existing user successfully', async () => {
      // Mock that user exists
      mockQuery.mockImplementation((query) => {
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

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-user-id',
          email: 'test@example.com',
          token: expect.any(String)
        })
      );
    });

    it('should handle invalid credentials', async () => {
      // Mock that user doesn't exist
      mockQuery.mockImplementation((query) => {
        if (query.includes('SELECT * FROM users')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });
  });
});