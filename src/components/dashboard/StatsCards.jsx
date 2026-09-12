import React from 'react';
import { BarChart3, Building2, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const StatsCards = () => {
  const { pages, groups, activityLog } = useApp();

  // Compute posts published this week (past 7 days)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const postsThisWeek = activityLog.filter((act) => {
    try {
      return new Date(act.timestamp) >= oneWeekAgo;
    } catch {
      return true;
    }
  }).length;

  const cards = [
    {
      id: 'posts',
      title: 'Posts This Week',
      value: postsThisWeek,
      label: 'Broadcasted updates',
      icon: BarChart3,
      iconBg: 'bg-sky-50 text-[#0077B5]',
      link: '/create',
      actionText: 'Create post',
    },
    {
      id: 'pages',
      title: 'Active Pages',
      value: pages.length,
      label: 'LinkedIn company pages',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-600',
      link: '/settings/pages',
      actionText: 'Manage pages',
    },
    {
      id: 'groups',
      title: 'Active Groups',
      value: groups.length,
      label: 'Target discussion groups',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600',
      link: '/settings/groups',
      actionText: 'Manage groups',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{card.label}</div>
              </div>

              <div className={`p-3 rounded-xl ${card.iconBg} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Synced
              </span>

              <Link
                to={card.link}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B5] hover:text-[#005f8d] transition-colors"
              >
                <span>{card.actionText}</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
