"use client";

import Image from "next/image";
import Link from "next/link";
import "./animations.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold mb-6 animate-fade-in">Create Your Game with AI</h1>
        <p className="text-xl mb-10 max-w-2xl animate-fade-in-delay">
          Design, build, and deploy your game idea with just a description. 
          Powered by AI, simplified for everyone.
        </p>
        <Link 
          href="/auth/login" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 animate-bounce-gentle"
        >
          Describe Your Game
        </Link>
        
        <div className="mt-20 relative w-full max-w-4xl h-80">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg opacity-20 animate-pulse"></div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <p className="text-2xl font-semibold">Game Preview Animation</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-slate-700 p-8 rounded-lg">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Describe</h3>
              <p className="text-slate-300">
                Tell us about your game idea in detail. What type of game, mechanics, story, and visual style.
              </p>
            </div>
            
            <div className="bg-slate-700 p-8 rounded-lg">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Customize</h3>
              <p className="text-slate-300">
                Our AI generates a prototype you can tweak and customize to match your vision perfectly.
              </p>
            </div>
            
            <div className="bg-slate-700 p-8 rounded-lg">
              <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Play</h3>
              <p className="text-slate-300">
                Deploy your game instantly and share it with friends, family, or the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Games Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-16 text-center">Sample Games</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((game) => (
            <div key={game} className="bg-slate-700 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-600 animate-pulse"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Example Game {game}</h3>
                <p className="text-gray-300 mb-4">A short description of this amazing AI-generated game.</p>
                <button className="text-indigo-400 font-semibold hover:text-indigo-300">
                  Play Demo →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>© 2023 Game Creator AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
