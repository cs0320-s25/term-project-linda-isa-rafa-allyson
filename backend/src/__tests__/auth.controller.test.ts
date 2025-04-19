import { Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

jest.mock('pg');
jest.mock('bcryptjs');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
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
      const mockPool = {
        query: jest.fn().mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce({
            rows: [{ id: 1, email: 'test@example.com' }]
          })
      };

      (Pool as jest.MockedClass<typeof Pool>).prototype.query = mockPool.query;
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          token: expect.any(String)
        })
      );
    });
  });
});