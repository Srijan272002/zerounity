'use client';

import React, { useState, useEffect } from 'react';
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
    genre: string;
    additionalDetails: string;
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
  const [prompt, setPrompt] = useState('');
  const [gameType, setGameType] = useState('');
  const [genre, setGenre] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
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
        if (message.type === 'status_update') {
          setAgents(message.data.agents);
          setCurrentAgent(message.data.currentAgent);
          setSteps(message.data.steps);
          setCurrentStep(message.data.currentStep);
        } else if (message.type === 'error') {
          if (!message.data.recoverable) {
            setError(message.data.message);
            setIsGenerating(false);
          }
        } else if (message.type === 'generation_complete') {
          setIsGenerating(false);
          if (!message.data.success) {
            setError(message.data.message);
          }
        }
      });

      return () => {
        unsubscribe();
        webSocketService.disconnect();
      };
    }
  }, [isGenerating]);

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
    setError(undefined);
    setIsGenerating(true);
    setAgents(initialAgents);
    setSteps(initialSteps);

    try {
      const id = await webSocketService.startGeneration({
        prompt,
        gameType,
        genre,
        additionalDetails,
      });
      setSessionId(id);
      onSubmit({
        prompt,
        gameType,
        genre,
        additionalDetails,
      });
    } catch (error) {
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalDetails(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Describe your game idea
          </label>
          <div className="flex gap-4">
            <Textarea
              placeholder="Enter your game idea or concept..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 flex-1 bg-[#1a1625] border-purple-500/20 focus:border-purple-500 text-white placeholder:text-gray-400"
              required
            />
            <Button
              type="button"
              variant="outline"
              className="mt-8 whitespace-nowrap border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
              onClick={handleGenerateIdea}
              disabled={isGeneratingSuggestion}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Idea
            </Button>
          </div>
        </div>

        {aiSuggestion && (
          <Card className="bg-[#1a1625] border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-400 mb-1">
                    AI Suggestion
                  </p>
                  <p className="text-sm text-gray-300">{aiSuggestion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <label className="block text-lg font-medium text-white mb-4">Game Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gameTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setGameType(type.value)}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors',
                  gameType === type.value
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-purple-500/20 hover:border-purple-500/50 text-white'
                )}
              >
                <span className="text-2xl mb-2">{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-2">Genre</label>
          <Select value={genre} onValueChange={setGenre} required>
            <SelectTrigger className="w-full bg-[#1a1625] border-purple-500/20 text-white">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1625] border-purple-500/20">
              {genres.map((g) => (
                <SelectItem 
                  key={g.value} 
                  value={g.value}
                  className="text-white focus:bg-purple-500/10 focus:text-purple-400"
                >
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Additional Details <span className="text-sm font-normal text-gray-400">(Optional)</span>
          </label>
          <Textarea
            placeholder="Add any specific requirements, mechanics, or features you'd like to include..."
            value={additionalDetails}
            onChange={handleTextareaChange}
            className="h-24 bg-[#1a1625] border-purple-500/20 focus:border-purple-500 text-white placeholder:text-gray-400"
          />
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