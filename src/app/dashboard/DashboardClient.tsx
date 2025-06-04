'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Gamepad2, Clock, Settings, ArrowRight, Brain, Zap, Code } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User } from '@supabase/auth-helpers-nextjs';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'draft';
  updated_at: string;
  slug: string;
}

interface Activity {
  id: string;
  type: string;
  project_title: string;
  project_slug: string;
  created_at: string;
}

interface DashboardClientProps {
  user: User;
  projects: Project[];
  activities: Activity[];
}

function ProjectCard({ 
  title, 
  description, 
  status, 
  lastUpdated, 
  href 
}: { 
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'draft';
  lastUpdated: string;
  href: string;
}) {
  return (
    <Link href={href} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full bg-[#1a1033] border-gray-800 hover:border-purple-500/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white/90">{title}</h3>
              <p className="text-gray-400 line-clamp-2">{description}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {lastUpdated}
                </span>
                <span className={cn(
                  "text-sm capitalize px-2.5 py-1 rounded-full font-medium",
                  status === 'completed' ? "bg-green-500/10 text-green-400" :
                  status === 'in_progress' ? "bg-purple-500/10 text-purple-400" :
                  "bg-gray-500/10 text-gray-400"
                )}>
                  {status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickStartCard() {
  return (
    <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 shadow-xl shadow-purple-500/10">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="p-3 bg-white/10 rounded-lg w-fit">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Quick Start</h3>
            <p className="text-lg text-white/80">
              Create a new game project in minutes using AI assistance
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-yellow-400 bg-white/5 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400 bg-white/5 px-3 py-1.5 rounded-full">
                <Code className="w-4 h-4" />
                <span className="text-sm">Export Ready</span>
              </div>
            </div>
            <Link href="/create">
              <Button className="mt-2 bg-white/10 hover:bg-white/20 text-white border-0 font-medium text-lg">
                Start Creating <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? 'Yesterday' : `${diffInDays}d ago`;
}

export function DashboardClient({ user, projects, activities }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1f] to-[#1a1033]">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
              </h1>
              <p className="text-xl text-gray-300">
                Create and manage your game projects
              </p>
            </div>
            <Link href="/create">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg px-6 py-6 rounded-full shadow-lg shadow-purple-500/25">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Quick Start and Projects Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <QuickStartCard />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      title={project.title}
                      description={project.description}
                      status={project.status}
                      lastUpdated={formatDate(project.updated_at)}
                      href={`/preview/${project.slug}`}
                    />
                  ))
                ) : (
                  <Card className="col-span-2 bg-[#1a1033] border-gray-800">
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-400 text-lg">No projects yet. Start creating one!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="grid gap-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <Card key={activity.id} className="bg-[#1a1033] border-gray-800 hover:border-purple-500/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <Settings className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-gray-300">
                            {activity.type} for{' '}
                            <Link href={`/preview/${activity.project_slug}`} className="text-purple-400 hover:text-purple-300 font-medium">
                              {activity.project_title}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-[#1a1033] border-gray-800">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-400">No recent activity</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 