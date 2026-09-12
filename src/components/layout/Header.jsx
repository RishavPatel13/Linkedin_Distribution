import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Plus, Share2, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { connectionStatus, pages, groups } = useApp();

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return [{ label: 'Dashboard' }];
    if (path === '/create') return [{ label: 'Create Content' }];
    if (path === '/distribute') return [{ label: 'Distribute & Reshare' }];
    if (path.startsWith('/settings')) {
      const crumbs = [{ label: 'Settings', to: '/settings' }];
      if (path.includes('/pages')) crumbs.push({ label: 'Company Pages' });
      else if (path.includes('/groups')) crumbs.push({ label: 'Groups' });
      else if (path.includes('/connection')) crumbs.push({ label: 'Connection Status' });
      return crumbs;
    }
    return [{ label: 'Dashboard' }];
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm font-medium">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {index > 0 && <span className="text-slate-400">/</span>}
                {isLast ? (
                  <span className="text-slate-900 font-semibold">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to || '#'} className="text-slate-500 hover:text-slate-800">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right side: Quick stats + Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Targets overview pill */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
          <span>
            <strong className="text-slate-800 font-semibold">{pages.length}</strong> pages
          </span>
          <span className="h-3 w-px bg-slate-300" />
          <span>
            <strong className="text-slate-800 font-semibold">{groups.length}</strong> groups
          </span>
        </div>

        {/* Quick action buttons */}
        <Link
          to="/distribute"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Reshare Post</span>
        </Link>

        <Link
          to="/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0077B5] rounded-lg hover:bg-[#005f8d] transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Post</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
