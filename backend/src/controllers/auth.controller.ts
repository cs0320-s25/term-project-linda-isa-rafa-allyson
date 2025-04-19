import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { generateToken } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5433'),
  database: process.env.POSTGRES_DB
});

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = generateToken({ id: user.id, email: user.email });

      res.status(201).json({
        id: user.id,
        email: user.email,
        token
      });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = generateToken({ id: user.id, email: user.email });

      res.json({
        id: user.id,
        email: user.email,
        token
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User is already attached to request by authMiddleware
      const userId = req.user?.id;

      const result = await pool.query(
        'SELECT id, email, created_at FROM users WHERE id = $1',
        [userId]
      );

      const user = result.rows[0];

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}