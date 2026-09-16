import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PenSquare,
  Share2,
  Settings,
  Building2,
  Users,
  KeyRound,
  X,
  Radio,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connectionStatus } = useApp();
  const { userId, logout } = useAuth();

  const isSettingsActive = location.pathname.startsWith('/settings');

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/login', { replace: true });
    onClose?.();
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Content', path: '/create', icon: PenSquare },
    { name: 'Distribute & Reshare', path: '/distribute', icon: Share2 },
  ];

  const settingsSubItems = [
    { name: 'Company Pages', path: '/settings/pages', icon: Building2 },
    { name: 'Groups', path: '/settings/groups', icon: Users },
    { name: 'Connection Status', path: '/settings/connection', icon: KeyRound },
  ];

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'active':
        return {
          color: 'bg-emerald-500',
          text: 'Connected: Active',
          textColor: 'text-emerald-400',
          border: 'border-emerald-500/20',
          bg: 'bg-emerald-950/40',
        };
      case 'expired':
        return {
          color: 'bg-red-500',
          text: 'Action Needed',
          textColor: 'text-red-400',
          border: 'border-red-500/20',
          bg: 'bg-red-950/40',
        };
      default:
        return {
          color: 'bg-amber-500',
          text: 'Status Unknown',
          textColor: 'text-amber-400',
          border: 'border-amber-500/20',
          bg: 'bg-amber-950/40',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0f172a] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0077B5] flex items-center justify-center text-white shadow-md shadow-[#0077B5]/30">
              <span className="font-bold text-lg leading-none">in</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-tight leading-tight">
                LinkedIn Distribution
              </div>
              <div className="text-slate-400 text-xs">Content Engine</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
          {/* Main sections */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Core Workflow
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800/80 text-white border-l-4 border-[#0077B5] shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Settings sections */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <span>Management</span>
              <NavLink
                to="/settings"
                className="text-slate-500 hover:text-slate-300 text-xs lowercase"
              >
                /settings
              </NavLink>
            </div>
            <nav className="space-y-1">
              <NavLink
                to="/settings"
                end
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800/80 text-white border-l-4 border-[#0077B5]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
                  }`
                }
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Settings Hub</span>
              </NavLink>

              <div className="pl-4 pt-1 space-y-1 border-l border-slate-800/80 ml-4">
                {settingsSubItems.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => onClose?.()}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'text-[#38bdf8] bg-slate-800/70 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                        }`
                      }
                    >
                      <SubIcon className="w-3.5 h-3.5" />
                      <span>{sub.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Footer / Connection Indicator */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Signed in</div>
              <div className="text-xs font-semibold text-slate-200 truncate">{userId || 'Admin'}</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>

          <NavLink
            to="/settings/connection"
            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors hover:border-slate-700 ${status.border} ${status.bg}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                {connectionStatus === 'active' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.color}`}></span>
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">LinkedIn Session</div>
                <div className={`font-semibold ${status.textColor}`}>{status.text}</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
