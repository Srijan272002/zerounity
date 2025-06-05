import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface GenerationProgress {
  stage: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'cancelled' | 'error';
}

export interface GenerationData {
  projectId: string;
  gameType: string;
  description: string;
} 