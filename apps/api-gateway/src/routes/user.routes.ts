import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { AppError } from '../middlewares/error-handler.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * GET /api/user/profile
 * Get user profile
 */
router.get('/profile', async (req, res, next) => {
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
      throw new AppError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/user/profile
 * Update user profile
 */
router.patch('/profile', async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1).max(100).optional(),
    });

    const data = schema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
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

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/user/usage
 * Get user usage statistics
 */
router.get('/usage', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        analysisCount: true,
        analysisLimit: true,
        plan: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get monthly usage history
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUsage = await prisma.analysis.groupBy({
      by: ['createdAt'],
      where: {
        userId: req.userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: true,
    });

    // Group by month
    const usageByMonth = new Map<string, number>();
    monthlyUsage.forEach((item) => {
      const month = item.createdAt.toISOString().slice(0, 7);
      usageByMonth.set(month, (usageByMonth.get(month) || 0) + item._count);
    });

    const history = Array.from(usageByMonth.entries()).map(([month, analyses]) => ({
      month,
      analyses,
    }));

    res.json({
      currentMonth: {
        analyses: user.analysisCount,
        limit: user.analysisLimit,
        percentage: Math.round((user.analysisCount / user.analysisLimit) * 100),
      },
      history,
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRouter };
