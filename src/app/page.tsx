"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Palette, Code, BookOpen, Zap, Monitor } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1f] to-[#1a1033]">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-opacity-90 bg-[#0f0a1f] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">🎮 GameForge</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-300 hover:text-white">Features</Link>
              <Link href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link>
              <Link href="/auth/login" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Build Games with
              <span className="block text-purple-400">Just Words</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your game ideas into reality using plain English.
              GameForge leverages cutting-edge AI to generate complete,
              exportable games in Unity or Godot—no coding required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard" className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors">
                Start Creating Games →
              </Link>
              <Link href="/demo" className="border border-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
                Watch Demo
              </Link>
            </div>
            <div className="flex justify-center space-x-8 mt-12">
              <div className="flex items-center space-x-2 text-yellow-400">
                <span className="text-2xl">⭐</span>
                <span className="text-gray-300">No Code Required</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <span className="text-2xl">⚡</span>
                <span className="text-gray-300">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <span className="text-2xl">📱</span>
                <span className="text-gray-300">Unity & Godot Export</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#130d28]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Everything You Need to Create Games
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16">
            Our AI-powered platform handles every aspect of game development,
            from concept to playable code.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-purple-400" />}
              title="Intelligent Game Logic"
              description="Advanced AI agents automatically generate complex game mechanics, physics, and interactive systems based on your descriptions."
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8 text-pink-400" />}
              title="Visual Asset Generation"
              description="Create stunning sprites, textures, 3D models, and animations that perfectly match your game's vision and style."
            />
            <FeatureCard
              icon={<Code className="w-8 h-8 text-blue-400" />}
              title="Clean, Exportable Code"
              description="Generate production-ready code for Unity or Godot that you can export, modify, and publish to any platform."
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-green-400" />}
              title="Rich Narrative Systems"
              description="Craft compelling storylines, dialogue trees, and character interactions that bring your game world to life."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Rapid Prototyping"
              description="Go from idea to playable prototype in minutes, not months. Iterate quickly and test your concepts instantly."
            />
            <FeatureCard
              icon={<Monitor className="w-8 h-8 text-red-400" />}
              title="Multi-Platform Support"
              description="Deploy your games across PC, mobile, web, and console platforms with optimized builds for each target."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            How GameForge Works
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16">
            Transform your creative vision into a fully playable game in just three simple steps.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Describe Your Game"
              description="Simply describe your game idea in plain English. Tell us about the genre, mechanics, story, characters, and visual style you envision."
              color="bg-purple-500"
            />
            <StepCard
              number="2"
              title="AI Agents Work Their Magic"
              description="Our specialized AI agents analyze your description and collaborate to generate game logic, create visual assets, write narrative content, and produce clean code."
              color="bg-pink-500"
            />
            <StepCard
              number="3"
              title="Play & Export"
              description="Test your game instantly in the browser, make adjustments with natural language, then export the complete project to Unity or Godot for further development and publishing."
              color="bg-blue-500"
            />
          </div>
          <div className="mt-16 text-center">
            <Link href="/dashboard" className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors inline-block">
              Start Building Your Game Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-[#1a1033] border border-gray-800 hover:border-purple-500 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, color }: { number: string; title: string; description: string; color: string }) {
  return (
    <div className="relative">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white text-xl font-bold mb-4`}>
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
