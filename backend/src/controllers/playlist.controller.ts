import { Request, Response } from 'express';
import { SpotifyService } from '../services/spotify.service';
import { encryptMemory } from '../utils/encryption';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5433'),
  database: process.env.POSTGRES_DB
});

export class PlaylistController {
  static async generatePlaylist(req: Request, res: Response): Promise<void> {
    try {
      const { emotion, memoryText } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!emotion) {
        res.status(500).json({ error: 'Failed to generate playlist' });
        return;
      }

      // Encrypt memory text before storing
      const encryptedMemory = memoryText ? encryptMemory(memoryText) : null;

      // Store memory
      const memoryResult = await pool.query(
        'INSERT INTO memories (user_id, memory_text, encrypted_memory, emotion) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, memoryText, encryptedMemory, emotion]
      );

      // Generate playlist
      const spotifyService = SpotifyService.getInstance();
      const playlistId = await spotifyService.createPlaylist(userId, emotion, memoryText);

      // Store playlist
      await pool.query(
        'INSERT INTO playlists (user_id, memory_id, spotify_playlist_id) VALUES ($1, $2, $3)',
        [userId, memoryResult.rows[0].id, playlistId]
      );

      res.json({ playlistId });
    } catch (error) {
      console.error('Error generating playlist:', error);
      res.status(500).json({ error: 'Failed to generate playlist' });
    }
  }

  static async getTopTracks(req: Request, res: Response): Promise<void> {
    try {
      const spotifyService = SpotifyService.getInstance();
      const topTracks = await spotifyService.getUserTopTracks();
      res.json(topTracks);
    } catch (error) {
      console.error('Error getting top tracks:', error);
      res.status(500).json({ error: 'Failed to get top tracks' });
    }
  }
}