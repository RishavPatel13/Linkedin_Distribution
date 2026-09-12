import React from 'react';
import { Sparkles, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCards from './StatsCards';
import ActivityFeed from './ActivityFeed';
import { useApp } from '../../context/AppContext';

export const Dashboard = () => {
  const { pages, groups } = useApp();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0077B5] to-[#004b75] p-6 sm:p-8 text-white shadow-lg shadow-[#0077B5]/20">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Content Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            LinkedIn Multi-Target Distribution
          </h1>
          <p className="text-sm text-sky-100 leading-relaxed">
            Generate executive-level posts with LangGraph AI, schedule organic broadcasts across company pages, and expand reach into niche discussion groups without triggering spam filters.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-white text-[#0077B5] hover:bg-sky-50 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Content</span>
            </Link>

            <Link
              to="/distribute"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Reshare Existing Post</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-sky-400/10 pointer-events-none" />
      </div>

      {/* Stats Section */}
      <section>
        <StatsCards />
      </section>

      {/* Activity Timeline Section */}
      <section>
        <ActivityFeed />
      </section>
    </div>
  );
};

export default Dashboard;
