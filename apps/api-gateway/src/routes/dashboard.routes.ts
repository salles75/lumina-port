import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { AppError } from '../middlewares/error-handler.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.userId!;

    // Get aggregated statistics
    const [analysisStats, recentAnalyses, trendData] = await Promise.all([
      // Total statistics
      prisma.analysis.aggregate({
        where: {
          userId,
          status: 'COMPLETED',
        },
        _count: true,
        _sum: {
          totalFeedbacks: true,
          positiveCount: true,
          neutralCount: true,
          negativeCount: true,
        },
        _avg: {
          averageScore: true,
        },
      }),

      // Recent analyses
      prisma.analysis.findMany({
        where: {
          userId,
          status: 'COMPLETED',
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          totalFeedbacks: true,
          positiveCount: true,
          neutralCount: true,
          negativeCount: true,
          createdAt: true,
        },
      }),

      // Trend data for last 30 days
      getTrendData(userId, 30),
    ]);

    const totalFeedbacks = analysisStats._sum.totalFeedbacks || 0;
    const positiveCount = analysisStats._sum.positiveCount || 0;
    const neutralCount = analysisStats._sum.neutralCount || 0;
    const negativeCount = analysisStats._sum.negativeCount || 0;

    res.json({
      totalAnalyses: analysisStats._count,
      totalFeedbacks,
      averageSentiment: analysisStats._avg.averageScore || 0,
      sentimentDistribution: {
        positive: totalFeedbacks > 0 ? Math.round((positiveCount / totalFeedbacks) * 100) : 0,
        neutral: totalFeedbacks > 0 ? Math.round((neutralCount / totalFeedbacks) * 100) : 0,
        negative: totalFeedbacks > 0 ? Math.round((negativeCount / totalFeedbacks) * 100) : 0,
      },
      recentAnalyses: recentAnalyses.map((analysis) => ({
        ...analysis,
        results: [
          {
            sentiment: 'positive',
            percentage: analysis.totalFeedbacks > 0
              ? Math.round((analysis.positiveCount / analysis.totalFeedbacks) * 100)
              : 0,
          },
          {
            sentiment: 'neutral',
            percentage: analysis.totalFeedbacks > 0
              ? Math.round((analysis.neutralCount / analysis.totalFeedbacks) * 100)
              : 0,
          },
          {
            sentiment: 'negative',
            percentage: analysis.totalFeedbacks > 0
              ? Math.round((analysis.negativeCount / analysis.totalFeedbacks) * 100)
              : 0,
          },
        ],
      })),
      trendData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/dashboard/keywords
 * Get top keywords across all analyses
 */
router.get('/keywords', async (req, res, next) => {
  try {
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 20;

    // Get analyses IDs for this user
    const analyses = await prisma.analysis.findMany({
      where: { userId },
      select: { id: true },
    });

    const analysisIds = analyses.map((a) => a.id);

    // Aggregate keywords
    const keywords = await prisma.keyword.groupBy({
      by: ['word', 'sentiment'],
      where: {
        analysisId: { in: analysisIds },
      },
      _sum: {
        count: true,
      },
      orderBy: {
        _sum: {
          count: 'desc',
        },
      },
      take: limit,
    });

    res.json(
      keywords.map((k) => ({
        word: k.word,
        count: k._sum.count || 0,
        sentiment: k.sentiment.toLowerCase(),
      }))
    );
  } catch (error) {
    next(error);
  }
});

// ==========================================
// Helper Functions
// ==========================================

async function getTrendData(userId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all analyses in the period
  const analyses = await prisma.analysis.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      positiveCount: true,
      neutralCount: true,
      negativeCount: true,
      totalFeedbacks: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date
  const dataByDate = new Map<string, { positive: number; neutral: number; negative: number; total: number }>();

  analyses.forEach((analysis) => {
    const date = analysis.createdAt.toISOString().split('T')[0];
    const existing = dataByDate.get(date) || { positive: 0, neutral: 0, negative: 0, total: 0 };

    dataByDate.set(date, {
      positive: existing.positive + analysis.positiveCount,
      neutral: existing.neutral + analysis.neutralCount,
      negative: existing.negative + analysis.negativeCount,
      total: existing.total + analysis.totalFeedbacks,
    });
  });

  // Fill in missing dates
  const result = [];
  const currentDate = new Date(startDate);
  const endDate = new Date();

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const data = dataByDate.get(dateStr);

    if (data && data.total > 0) {
      result.push({
        date: dateStr,
        positive: Math.round((data.positive / data.total) * 100),
        neutral: Math.round((data.neutral / data.total) * 100),
        negative: Math.round((data.negative / data.total) * 100),
      });
    } else {
      // No data for this date, use null or previous values
      result.push({
        date: dateStr,
        positive: 0,
        neutral: 0,
        negative: 0,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

export { router as dashboardRouter };
