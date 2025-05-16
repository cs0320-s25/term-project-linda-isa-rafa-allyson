import { Router } from 'express';
import { PlaylistController } from '../controllers/playlist.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/generate', authMiddleware, PlaylistController.generatePlaylist);
router.get('/top-tracks', authMiddleware, PlaylistController.getTopTracks);

export default router;