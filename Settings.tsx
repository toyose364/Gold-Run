import React from 'react';
import { Bell, Shield, Moon, User, ArrowLeft } from 'lucide-react';

interface SettingsProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, showBack }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {showBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white font-black hover:text-brand-primary transition-colors mb-2 group"
        >
          <ArrowLeft className="w-5 h-5 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      )}

      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and notifications.</p>
      </header>

      <div className="max-w-2xl space-y-4">
        <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Investor Profile</h2>
              <p className="text-slate-400 text-sm">Update your personal information</p>
            </div>
            <button className="ml-auto px-4 py-2 text-sm bg-dark-bg border border-dark-border rounded-lg text-slate-300 hover:text-white hover:border-brand-primary transition-colors">
              Edit
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-dark-border">
              <span className="text-slate-400">Email</span>
              <span className="text-white">user@example.com</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-dark-border">
              <span className="text-slate-400">Currency</span>
              <span className="text-white">NGN (₦)</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-400">Region</span>
              <span className="text-white">Nigeria</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden shadow-xl">
          <button className="w-full flex items-center justify-between p-4 hover:bg-dark-bg/50 transition-colors border-b border-dark-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="text-white">Notifications</span>
            </div>
            <div className="w-10 h-5 bg-brand-primary rounded-full relative">
              <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-dark-bg/50 transition-colors border-b border-dark-border">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="text-white">Privacy & Security</span>
            </div>
            <span className="text-slate-500 text-sm">Manage</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-dark-bg/50 transition-colors">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-slate-400" />
              <span className="text-white">Appearance</span>
            </div>
            <span className="text-slate-500 text-sm font-bold text-brand-primary">Dark Mode Active</span>
          </button>
        </div>
      </div>
    </div>
  );
};