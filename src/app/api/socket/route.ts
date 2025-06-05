import { Server } from 'socket.io';
import { NextApiResponseWithSocket } from '@/types/socket';
import { createServer } from 'http';
import { NextResponse } from 'next/server';

const io = new Server({
  path: '/api/socket',
  addTrailingSlash: false,
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('startGeneration', (data) => {
    // Emit progress updates
    const stages = ['initializing', 'generating_narrative', 'creating_assets', 'compiling_code'];
    let currentStage = 0;

    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        socket.emit('progressUpdate', {
          stage: stages[currentStage],
          progress: Math.floor((currentStage / stages.length) * 100),
          status: 'in_progress'
        });
        currentStage++;
      } else {
        clearInterval(interval);
        socket.emit('progressUpdate', {
          stage: 'completed',
          progress: 100,
          status: 'completed'
        });
      }
    }, 1000);

    socket.on('cancelGeneration', () => {
      clearInterval(interval);
      socket.emit('progressUpdate', {
        stage: 'cancelled',
        progress: 0,
        status: 'cancelled'
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const httpServer = createServer();
io.attach(httpServer);

export async function GET() {
  return new NextResponse('WebSocket server is running', { status: 200 });
}

export const dynamic = 'force-dynamic'; 