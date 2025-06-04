'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';
import type { GenerationStep } from '@/lib/websocket';
import { cn } from '@/lib/utils';

interface GenerationStepsProps {
  steps: GenerationStep[];
  currentStep?: string;
  onRetry: (stepId: string) => void;
}

export function GenerationSteps({ steps, currentStep, onRetry }: GenerationStepsProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPending = step.status === 'pending';
        const isCompleted = step.status === 'completed';
        const isError = step.status === 'error';
        const isInProgress = step.status === 'in_progress';

        return (
          <Card
            key={step.id}
            className={cn(
              'relative overflow-hidden transition-colors duration-200',
              isCompleted && 'bg-muted/50',
              isError && 'border-red-200 bg-red-50/50'
            )}
          >
            <CardContent className="p-4">
              {/* Progress line connecting steps */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-7 top-12 h-full w-0.5 -translate-x-1/2 bg-border',
                    isCompleted && 'bg-primary'
                  )}
                />
              )}

              <div className="flex items-start gap-4">
                <div className="relative mt-1">
                  {isInProgress ? (
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-primary/20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ) : null}
                  <div className="relative">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : isError ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : isInProgress ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium leading-none">{step.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                    {isError && step.retryCount < 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetry(step.id)}
                        className="h-8 px-2"
                      >
                        <RefreshCcw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>

                  {isError && step.error && (
                    <p className="text-sm text-red-500 mt-2">{step.error}</p>
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