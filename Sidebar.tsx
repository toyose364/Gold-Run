import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Bot, 
  PieChart, 
  Settings, 
  LogOut,
  TrendingUp,
  ShieldAlert,
  Users
} from 'lucide-react';
import { AppRoute } from '../types';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentRoute, 
  onNavigate, 
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navItems = [
    { id: AppRoute.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppRoute.MARKETPLACE, label: 'Marketplace', icon: Store },
    { id: AppRoute.PORTFOLIO, label: 'My Portfolio', icon: PieChart },
    { id: AppRoute.REFERRALS, label: 'Referrals', icon: Users },
    { id: AppRoute.AI_ADVISOR, label: 'AI Advisor', icon: Bot },
    { id: AppRoute.SETTINGS, label: 'Settings', icon: Settings },
    { id: AppRoute.ADMIN, label: 'Admin Panel', icon: ShieldAlert },
  ];

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-dark-surface border-r border-dark-border transition-transform duration-300 ease-in-out shadow-2xl
        md:translate-x-0 md:static md:h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-dark-border">
            <div className="bg-brand-primary p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Lumina Invest</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${currentRoute === item.id 
                    ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-4 border-brand-primary rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${currentRoute === item.id ? 'text-brand-primary' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-dark-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};