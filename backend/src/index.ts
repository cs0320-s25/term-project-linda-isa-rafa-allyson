import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";
import { OpenAI } from "openai";
import spotifyPreviewFinder from "spotify-preview-finder";
import { generatePlaylist } from "./routes/playlist";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize services
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware - just verify that a token exists
const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No session token provided" });
    return;
  }
  next();
};

// Routes
app.post("/api/playlists/generate", authMiddleware, generatePlaylist);

// Export app for testing
export { app };

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
