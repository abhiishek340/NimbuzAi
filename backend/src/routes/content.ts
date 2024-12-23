import { Router } from 'express';
import { ContentController } from '../controllers/contentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const contentController = new ContentController();

router.post('/transform', authMiddleware, contentController.transformContent);
router.post('/schedule', authMiddleware, contentController.schedulePost);
router.get('/scheduled', authMiddleware, contentController.getScheduledPosts);

export const contentRouter = router; 