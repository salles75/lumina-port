import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { prisma } from '../lib/prisma.js';
import { nlpClient } from '../lib/nlp-client.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { AppError } from '../middlewares/error-handler.js';
import { logger } from '../lib/logger.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// All routes require authentication
router.use(requireAuth);

/**
 * POST /api/analysis
 * Create a new analysis
 */
router.post('/', async (req, res, next) => {
  try {
    const schema = z.object({
      type: z.enum(['url', 'csv', 'text']),
      content: z.string().min(1),
      name: z.string().optional(),
    });

    const { type, content, name } = schema.parse(req.body);

    // Check user limits
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { analysisCount: true, analysisLimit: true, plan: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.analysisCount >= user.analysisLimit) {
      throw new AppError(
        403,
        'Analysis limit reached. Please upgrade your plan.'
      );
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        userId: req.userId!,
        name: name || `Análise ${new Date().toLocaleDateString('pt-BR')}`,
        type: type.toUpperCase() as 'URL' | 'CSV' | 'TEXT',
        sourceUrl: type === 'url' ? content : null,
        status: 'PENDING',
      },
    });

    // Process analysis asynchronously
    processAnalysis(analysis.id, type, content).catch((err) => {
      logger.error(`Analysis processing failed: ${analysis.id}`, err);
    });

    res.status(201).json({
      id: analysis.id,
      status: 'processing',
      message: 'Analysis started',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analysis/upload
 * Upload CSV file for analysis
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file uploaded');
    }

    // Check user limits
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { analysisCount: true, analysisLimit: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.analysisCount >= user.analysisLimit) {
      throw new AppError(
        403,
        'Analysis limit reached. Please upgrade your plan.'
      );
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        userId: req.userId!,
        name: req.file.originalname,
        type: 'CSV',
        fileName: req.file.originalname,
        status: 'PENDING',
      },
    });

    // Parse CSV and process
    const csvContent = req.file.buffer.toString('utf-8');
    processAnalysis(analysis.id, 'csv', csvContent).catch((err) => {
      logger.error(`Analysis processing failed: ${analysis.id}`, err);
    });

    res.status(201).json({
      id: analysis.id,
      status: 'processing',
      message: 'File uploaded and analysis started',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis
 * List user's analyses
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          totalFeedbacks: true,
          positiveCount: true,
          neutralCount: true,
          negativeCount: true,
          averageScore: true,
          createdAt: true,
          completedAt: true,
        },
      }),
      prisma.analysis.count({
        where: { userId: req.userId },
      }),
    ]);

    res.json({
      data: analyses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis/:id
 * Get analysis details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        feedbacks: {
          take: 100,
          orderBy: { createdAt: 'desc' },
        },
        keywords: {
          orderBy: { count: 'desc' },
          take: 20,
        },
      },
    });

    if (!analysis) {
      throw new AppError(404, 'Analysis not found');
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/analysis/:id
 * Delete an analysis
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!analysis) {
      throw new AppError(404, 'Analysis not found');
    }

    await prisma.analysis.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// Helper Functions
// ==========================================

async function processAnalysis(
  analysisId: string,
  type: string,
  content: string
): Promise<void> {
  try {
    // Update status to processing
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'PROCESSING' },
    });

    let texts: string[] = [];

    if (type === 'csv') {
      // Parse CSV
      const lines = content.split('\n');
      const header = lines[0].toLowerCase();
      const textColumn = header.includes('text')
        ? header.split(',').indexOf('text')
        : header.includes('feedback')
        ? header.split(',').indexOf('feedback')
        : 0;

      texts = lines
        .slice(1)
        .map((line) => {
          const columns = line.split(',');
          return columns[textColumn]?.trim() || '';
        })
        .filter((text) => text.length > 0);
    } else if (type === 'text') {
      texts = content.split('\n').filter((text) => text.trim().length > 0);
    } else if (type === 'url') {
      // URL scraping would go here
      // For now, use mock data
      texts = [
        'Produto excelente! Superou minhas expectativas.',
        'Entrega rápida, mas embalagem poderia melhorar.',
        'Qualidade muito ruim, não recomendo.',
        'Bom custo benefício, estou satisfeito.',
        'Veio com defeito, precisei trocar.',
      ];
    }

    // Analyze sentiments using NLP engine
    const nlpResults = await nlpClient.analyze(texts);

    // Process results
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let totalScore = 0;
    const keywordCounts = new Map<string, { count: number; sentiment: string }>();

    // Create feedback records
    const feedbacks = nlpResults.results.map((result) => {
      if (result.sentiment === 'positive') positiveCount++;
      else if (result.sentiment === 'neutral') neutralCount++;
      else negativeCount++;

      totalScore += result.score;

      // Count keywords
      result.keywords.forEach((keyword) => {
        const existing = keywordCounts.get(keyword);
        if (existing) {
          existing.count++;
        } else {
          keywordCounts.set(keyword, { count: 1, sentiment: result.sentiment });
        }
      });

      return {
        analysisId,
        text: result.text,
        sentiment: result.sentiment.toUpperCase() as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
        confidence: result.confidence,
        score: result.score,
      };
    });

    // Batch insert feedbacks
    await prisma.feedback.createMany({
      data: feedbacks,
    });

    // Insert keywords
    const keywords = Array.from(keywordCounts.entries()).map(([word, data]) => ({
      analysisId,
      word,
      count: data.count,
      sentiment: data.sentiment.toUpperCase() as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
    }));

    await prisma.keyword.createMany({
      data: keywords,
    });

    // Get user for updating count
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: { userId: true },
    });

    // Update analysis with results
    await prisma.$transaction([
      prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'COMPLETED',
          totalFeedbacks: feedbacks.length,
          positiveCount,
          neutralCount,
          negativeCount,
          averageScore: feedbacks.length > 0 ? totalScore / feedbacks.length : 0,
          completedAt: new Date(),
        },
      }),
      // Increment user's analysis count
      prisma.user.update({
        where: { id: analysis!.userId },
        data: {
          analysisCount: { increment: 1 },
        },
      }),
    ]);

    logger.info(`Analysis completed: ${analysisId}, ${feedbacks.length} feedbacks processed`);
  } catch (error) {
    // Update analysis status to failed
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    });
    throw error;
  }
}

export { router as analysisRouter };
