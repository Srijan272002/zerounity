'use client';

import React from 'react';
import { GameIdeaForm } from '@/components/ui/creation/GameIdeaForm';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Monitor, Bot, Zap } from 'lucide-react';

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-6 rounded-lg bg-[#1a1625] border border-purple-500/20">
      <div className="shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="font-medium mb-1 text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function CreatePage() {
  const handleSubmit = (data: {
    prompt: string;
    gameType: string;
    genre: string;
    additionalDetails: string;
  }) => {
    console.log('Form submitted:', data);
    // TODO: Integrate with game generation pipeline
  };

  return (
    <div className="min-h-screen bg-[#130d28] text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Build Games with
            <span className="block text-purple-400">Just Words</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your game ideas into reality using plain English. GameForge leverages
            cutting-edge AI to generate complete, exportable games—no coding required.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 bg-[#1a1625] shadow-xl shadow-purple-500/5">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Gamepad2 className="w-7 h-7 text-purple-400" />
                <h2 className="text-2xl font-semibold">Create Your Game</h2>
              </div>
              <GameIdeaForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>

          <div className="mt-16 space-y-3">
            <h2 className="text-3xl font-bold text-center mb-8">
              Everything You Need to Create Games
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Monitor className="w-5 h-5 text-blue-400" />}
                title="Unity & Godot Export"
                description="Export your game to popular engines"
              />
              <FeatureCard
                icon={<Bot className="w-5 h-5 text-purple-400" />}
                title="AI-Powered"
                description="Advanced AI generates everything for you"
              />
              <FeatureCard
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
                title="No Coding Required"
                description="Create games with just descriptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 