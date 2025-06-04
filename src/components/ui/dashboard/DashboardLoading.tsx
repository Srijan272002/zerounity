import { Loader2 } from 'lucide-react';

export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#130d28] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );
} 