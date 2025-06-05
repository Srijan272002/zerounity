import { EventEmitter } from 'events';

export class GenerationController {
  private static instance: GenerationController;
  private activeGenerations: Map<string, { cancel: () => void }>;
  private eventEmitter: EventEmitter;

  private constructor() {
    this.activeGenerations = new Map();
    this.eventEmitter = new EventEmitter();
  }

  static getInstance(): GenerationController {
    if (!GenerationController.instance) {
      GenerationController.instance = new GenerationController();
    }
    return GenerationController.instance;
  }

  registerGeneration(generationId: string, cancelFn: () => void) {
    this.activeGenerations.set(generationId, { cancel: cancelFn });
    this.eventEmitter.emit('generationStarted', generationId);
  }

  cancelGeneration(generationId: string) {
    const generation = this.activeGenerations.get(generationId);
    if (generation) {
      generation.cancel();
      this.activeGenerations.delete(generationId);
      this.eventEmitter.emit('generationCancelled', generationId);
    }
  }

  completeGeneration(generationId: string) {
    this.activeGenerations.delete(generationId);
    this.eventEmitter.emit('generationCompleted', generationId);
  }

  onGenerationEvent(event: 'generationStarted' | 'generationCancelled' | 'generationCompleted', listener: (generationId: string) => void) {
    this.eventEmitter.on(event, listener);
    return () => this.eventEmitter.off(event, listener);
  }

  isGenerationActive(generationId: string): boolean {
    return this.activeGenerations.has(generationId);
  }

  getAllActiveGenerations(): string[] {
    return Array.from(this.activeGenerations.keys());
  }
} 