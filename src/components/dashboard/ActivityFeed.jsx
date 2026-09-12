import React, { useState } from 'react';
import { History, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ActivityItem from './ActivityItem';

export const ActivityFeed = () => {
  const { activityLog } = useApp();
  const [visibleCount, setVisibleCount] = useState(5);

  const displayedActivities = activityLog.slice(0, visibleCount);
  const hasMore = activityLog.length > visibleCount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#0077B5]" />
          <h2 className="text-base font-bold text-slate-900">Recent Distribution Activity</h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {activityLog.length} total recorded broadcasts
        </span>
      </div>

      {/* Feed Items */}
      {activityLog.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sky-50 text-[#0077B5] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">No posts published yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Start by crafting your first AI-generated post or reshare a viral industry update across your managed channels.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0077B5] hover:bg-[#005f8d] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create First Post</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span>Load More Activity</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
