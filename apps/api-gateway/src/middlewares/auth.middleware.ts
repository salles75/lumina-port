import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      clerkUserId?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Clerk
    const session = await clerkClient.verifyToken(token);
    
    if (!session || !session.sub) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: session.sub },
    });

    if (!user) {
      // Fetch user details from Clerk and create in our DB
      const clerkUser = await clerkClient.users.getUser(session.sub);
      
      user = await prisma.user.create({
        data: {
          clerkId: session.sub,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          imageUrl: clerkUser.imageUrl,
        },
      });

      logger.info(`Created new user: ${user.id}`);
    }

    req.userId = user.id;
    req.clerkUserId = session.sub;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const session = await clerkClient.verifyToken(token);
    
    if (session?.sub) {
      const user = await prisma.user.findUnique({
        where: { clerkId: session.sub },
      });
      
      if (user) {
        req.userId = user.id;
        req.clerkUserId = session.sub;
      }
    }
    
    next();
  } catch {
    // Continue without auth
    next();
  }
}
