import { User } from '@supabase/supabase-js';
import { UploadedFile } from 'express-fileupload';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
      files?: {
        [key: string]: UploadedFile | UploadedFile[];
      };
    }
  }
}

export {}; 