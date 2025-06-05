'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Lightbulb, Loader2, Wand2, XCircle } from 'lucide-react';
import { GenerationStatus, AgentStatus } from './GenerationStatus';
import { GenerationSteps } from './GenerationSteps';
import { webSocketService } from '@/lib/websocket';
import type { GenerationStep } from '@/lib/websocket';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface GameIdeaFormProps {
  onSubmit: (data: {
    prompt: string;
    gameType: string;
  }) => void;
}

const initialAgents: AgentStatus[] = [
  { id: 'narrative', name: 'Narrative Generation', status: 'waiting', progress: 0 },
  { id: 'code', name: 'Code Generation', status: 'waiting', progress: 0 },
  { id: 'asset', name: 'Asset Generation', status: 'waiting', progress: 0 },
];

const initialSteps: GenerationStep[] = [
  {
    id: 'init',
    name: 'Initialization',
    description: 'Setting up the generation environment',
    status: 'pending',
    retryCount: 0,
  },
  {
    id: 'narrative',
    name: 'Story Generation',
    description: 'Creating game narrative and mechanics',
    status: 'pending',
    retryCount: 0,
  },
  {
    id: 'code',
    name: 'Code Generation',
    description: 'Generating game code and logic',
    status: 'pending',
    retryCount: 0,
  },
  {
    id: 'asset',
    name: 'Asset Generation',
    description: 'Creating game assets and resources',
    status: 'pending',
    retryCount: 0,
  },
  {
    id: 'finalize',
    name: 'Finalization',
    description: 'Packaging and preparing the game',
    status: 'pending',
    retryCount: 0,
  },
];

const gameTypes = [
  { value: 'action', label: 'Action', icon: '⚔️' },
  { value: 'adventure', label: 'Adventure', icon: '🗺️' },
  { value: 'puzzle', label: 'Puzzle', icon: '🧩' },
  { value: 'strategy', label: 'Strategy', icon: '♟️' },
  { value: 'rpg', label: 'RPG', icon: '🎲' },
  { value: 'platformer', label: 'Platformer', icon: '🏃' },
  { value: 'racing', label: 'Racing', icon: '🏎️' },
  { value: 'simulation', label: 'Simulation', icon: '🎮' },
];

const genres = [
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'horror', label: 'Horror' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'casual', label: 'Casual' },
];

export function GameIdeaForm({ onSubmit }: GameIdeaFormProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [gameType, setGameType] = useState('');
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [agents, setAgents] = useState<AgentStatus[]>(initialAgents);
  const [steps, setSteps] = useState<GenerationStep[]>(initialSteps);
  const [currentAgent, setCurrentAgent] = useState<string>();
  const [currentStep, setCurrentStep] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();

  useEffect(() => {
    if (isGenerating) {
      webSocketService.connect();
      const unsubscribe = webSocketService.subscribe((message) => {
        console.log('Received WebSocket message:', message);
        
        if (message.type === 'status_update') {
          const { agents: updatedAgents, currentAgent, steps: updatedSteps, currentStep } = message.data;
          console.log('Updating generation status:', { updatedAgents, currentAgent, updatedSteps, currentStep });
          
          setAgents(updatedAgents);
          setCurrentAgent(currentAgent);
          setSteps(updatedSteps);
          setCurrentStep(currentStep);
        } else if (message.type === 'error') {
          console.error('Generation error:', message.data);
          if (!message.data.recoverable) {
            setError(message.data.message);
            setIsGenerating(false);
          }
        } else if (message.type === 'generation_complete') {
          console.log('Generation completed:', message.data);
          if (message.data.success) {
            // Reset form state
            setPrompt('');
            setGameType('');
            setIsGenerating(false);
            // Directly start the game in a new window/tab
            window.open(`/game/play?session=${sessionId}`, '_blank');
          } else {
            setError(message.data.message);
            setIsGenerating(false);
          }
        }
      });

      return () => {
        unsubscribe();
        if (!isGenerating) {
          webSocketService.disconnect();
        }
      };
    }
  }, [isGenerating, sessionId, router]);

  // Add a cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const handleGenerateIdea = async () => {
    setIsGeneratingSuggestion(true);
    try {
      // TODO: Integrate with AI service to generate game idea suggestions
      const suggestion = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            'How about a game where the player controls a time-traveling scientist who must solve puzzles by manipulating objects across different time periods?'
          );
        }, 1000);
      });
      setAiSuggestion(suggestion as string);
      setPrompt(suggestion as string);
    } catch (error) {
      console.error('Failed to generate game idea:', error);
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!prompt || !gameType) {
      setError('Please fill in all required fields');
      return;
    }

    setError(undefined);
    setIsGenerating(true);
    setAgents(initialAgents);
    setSteps(initialSteps);

    try {
      console.log('Attempting to start WebSocket connection...');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation request timed out')), 15000);
      });

      const id = await Promise.race([
        webSocketService.startGeneration({
          prompt,
          gameType,
        }),
        timeoutPromise
      ]);

      console.log('WebSocket connection started, session ID:', id);
      setSessionId(id as string);
      onSubmit({
        prompt,
        gameType,
      });
    } catch (error) {
      console.error('Game generation error:', error);
      setError('Failed to start generation. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    webSocketService.cancelGeneration();
    setIsGenerating(false);
    setError(undefined);
  };

  const handleRetry = (stepId: string) => {
    setError(undefined);
    webSocketService.retryStep(stepId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Describe your game idea
          </label>
          <div className="relative">
            <Textarea
              placeholder="How about a game where the player controls a time-traveling scientist who must solve puzzles by manipulating objects across different time periods?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24 bg-[#1a1625] border-purple-500/20 focus:border-purple-500 text-white placeholder:text-gray-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={handleGenerateIdea}
              disabled={isGeneratingSuggestion}
            >
              {isGeneratingSuggestion ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="h-5 w-5" />
              )}
            </Button>
          </div>
          {aiSuggestion && (
            <div className="mt-2 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-purple-400 mt-0.5" />
                <p className="text-sm text-gray-300">{aiSuggestion}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-4">
            Game Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gameTypes.map((type) => (
              <Card
                key={type.value}
                className={cn(
                  'relative cursor-pointer transition-all duration-200',
                  'bg-[#1a1625] border-purple-500/20 hover:border-purple-500/40',
                  gameType === type.value && 'border-purple-500 bg-purple-500/10'
                )}
                onClick={() => setGameType(type.value)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm font-medium text-white">
                    {type.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isGenerating && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Generation Progress</h3>
            <GenerationStatus agents={agents} currentAgent={currentAgent} />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Generation Steps</h3>
            <GenerationSteps
              steps={steps}
              currentStep={currentStep}
              onRetry={handleRetry}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Create Game'
          )}
        </Button>

        {isGenerating && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="gap-2 border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            size="lg"
          >
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
} 