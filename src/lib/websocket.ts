import { AgentStatus } from '@/components/ui/creation/GenerationStatus';
import { io, Socket } from 'socket.io-client';

export type GenerationStep = {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  error?: string;
  retryCount: number;
};

type WebSocketMessage =
  | {
      type: 'status_update';
      data: {
        agents: AgentStatus[];
        currentAgent?: string;
        steps: GenerationStep[];
        currentStep?: string;
      };
    }
  | {
      type: 'error';
      data: {
        agentId?: string;
        stepId?: string;
        message: string;
        recoverable: boolean;
      };
    }
  | {
      type: 'generation_complete';
      data: {
        success: boolean;
        message: string;
      };
    };

class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private sessionId?: string;
  private connectionPromise: Promise<void> | null = null;

  connect() {
    if (this.socket?.connected) return Promise.resolve();
    
    if (this.connectionPromise) return this.connectionPromise;

    console.log('Connecting to WebSocket server at:', process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');
    
    this.connectionPromise = new Promise<void>((resolve, reject) => {
      this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');

      // Set a connection timeout
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 10000); // 10 second timeout

      this.socket.on('connect', () => {
        console.log('Socket.IO connected');
        clearTimeout(timeout);
        resolve();
      });

      this.socket.on('status_update', (message: WebSocketMessage) => {
        console.log('Received status update:', message);
        this.messageHandlers.forEach((handler) => handler(message));
      });

      this.socket.on('error', (message: WebSocketMessage) => {
        console.error('Received WebSocket error:', message);
        this.messageHandlers.forEach((handler) => handler(message));
      });

      this.socket.on('generation_complete', (message: WebSocketMessage) => {
        console.log('Generation complete:', message);
        this.messageHandlers.forEach((handler) => handler(message));
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        this.connectionPromise = null;
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        reject(error);
      });
    });

    return this.connectionPromise;
  }

  subscribe(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  async startGeneration(data: {
    prompt: string;
    gameType: string;
  }) {
    try {
      // Ensure socket is connected
      await this.connect();
      
      if (!this.socket?.connected) {
        console.error('Socket.IO still not connected after connection attempt');
        throw new Error('Socket.IO not connected');
      }

      console.log('Starting generation with data:', data);
      this.sessionId = crypto.randomUUID();
      this.socket.emit('start_generation', {
        sessionId: this.sessionId,
        data,
      });

      return this.sessionId;
    } catch (error) {
      console.error('Failed to start generation:', error);
      throw error;
    }
  }

  cancelGeneration() {
    if (!this.socket?.connected || !this.sessionId) {
      return;
    }

    this.socket.emit('cancel_generation', {
      sessionId: this.sessionId,
    });
  }

  retryStep(stepId: string) {
    if (!this.socket?.connected || !this.sessionId) {
      return;
    }

    this.socket.emit('retry_step', {
      sessionId: this.sessionId,
      stepId,
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
    this.sessionId = undefined;
    this.connectionPromise = null;
  }
}

export const webSocketService = new WebSocketService(); 