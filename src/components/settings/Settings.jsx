import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Building2, Users, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Settings = () => {
  const { pages, groups, connectionStatus } = useApp();

  const tabs = [
    {
      name: 'Company Pages',
      path: '/settings/pages',
      icon: Building2,
      count: pages.length,
    },
    {
      name: 'Groups',
      path: '/settings/groups',
      icon: Users,
      count: groups.length,
    },
    {
      name: 'Connection Status',
      path: '/settings/connection',
      icon: KeyRound,
      badge: connectionStatus === 'active' ? 'Active' : 'Alert',
      badgeColor:
        connectionStatus === 'active'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-red-100 text-red-700',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure LinkedIn publication endpoints, manage target groups, and monitor session authentication.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 py-3 px-3.5 border-b-2 text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-[#0077B5] text-[#0077B5] font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sub-route Outlet */}
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
