import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { logger } from '../lib/logger.js';

const router = Router();

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        plan: true,
        analysisCount: true,
        analysisLimit: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/sync
 * Sync user data from Clerk
 */
router.post('/sync', requireAuth, async (req, res, next) => {
  try {
    const { email, name, imageUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(imageUrl && { imageUrl }),
      },
    });

    logger.info(`User synced: ${user.id}`);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
