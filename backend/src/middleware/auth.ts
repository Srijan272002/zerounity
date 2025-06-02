import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/auth';
import { UploadedFile } from 'express-fileupload';

// Define interface for authenticated requests
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    (req as AuthRequest).user = {
      id: user.id,
      email: user.email!,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Optional auth middleware - doesn't require authentication but attaches user if present
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      (req as AuthRequest).user = {
        id: user.id,
        email: user.email!,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}; 