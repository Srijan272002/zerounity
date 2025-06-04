import { AgentStatus } from '@/components/ui/creation/GenerationStatus';

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
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private sessionId?: string;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  startGeneration(data: {
    prompt: string;
    gameType: string;
    genre: string;
    additionalDetails: string;
  }) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    this.sessionId = crypto.randomUUID();
    this.ws.send(
      JSON.stringify({
        type: 'start_generation',
        sessionId: this.sessionId,
        data,
      })
    );

    return this.sessionId;
  }

  cancelGeneration() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.sessionId) {
      return;
    }

    this.ws.send(
      JSON.stringify({
        type: 'cancel_generation',
        sessionId: this.sessionId,
      })
    );
  }

  retryStep(stepId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.sessionId) {
      return;
    }

    this.ws.send(
      JSON.stringify({
        type: 'retry_step',
        sessionId: this.sessionId,
        stepId,
      })
    );
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = undefined;
  }
}

export const webSocketService = new WebSocketService(); 