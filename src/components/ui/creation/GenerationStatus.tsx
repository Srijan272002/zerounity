'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Code, Image, Loader2 } from 'lucide-react';

export interface AgentStatus {
  id: string;
  name: string;
  status: 'waiting' | 'running' | 'completed' | 'error';
  progress: number;
  message?: string;
}

interface GenerationStatusProps {
  agents: AgentStatus[];
  currentAgent?: string;
}

const agentIcons = {
  narrative: Brain,
  code: Code,
  asset: Image,
};

export function GenerationStatus({ agents, currentAgent }: GenerationStatusProps) {
  return (
    <div className="space-y-4">
      {agents.map((agent) => {
        const Icon = agentIcons[agent.id as keyof typeof agentIcons] || Loader2;
        const isActive = agent.id === currentAgent;

        return (
          <Card key={agent.id} className={agent.status === 'completed' ? 'bg-muted/50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div className="relative">
                    <Icon
                      className={`h-6 w-6 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    {agent.status === 'running' && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <div className="h-1 w-1 rounded-full bg-primary absolute top-0 left-1/2 transform -translate-x-1/2" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{agent.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {agent.progress}%
                    </span>
                  </div>
                  <Progress value={agent.progress} className="h-1" />
                  {agent.message && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {agent.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 