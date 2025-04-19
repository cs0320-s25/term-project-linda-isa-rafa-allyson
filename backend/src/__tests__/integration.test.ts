import request from 'supertest';
import express from 'express';
import playlistRoutes from '../routes/playlist.routes';
import authRoutes from '../routes/auth.routes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);

describe('API Integration Tests', () => {
  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Playlist Generation', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login and get token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      authToken = response.body.token;
    });

    it('should generate playlist with valid emotion', async () => {
      const response = await request(app)
        .post('/api/playlists/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          emotion: 'joyful',
          memoryText: 'Happy summer day'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('playlistId');
    });
  });
});