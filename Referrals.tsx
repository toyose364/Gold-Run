import React, { useState } from 'react';
import { UserData, AppRoute } from '../types';
import { Users, Copy, CheckCircle2, TrendingUp, DollarSign, ArrowLeft, Share2, Award } from 'lucide-react';

interface ReferralsProps {
  userData: UserData;
  onBack: () => void;
  showBack: boolean;
}

export const Referrals: React.FC<ReferralsProps> = ({ userData, onBack, showBack }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://lumina-invest.io/join?ref=${userData.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { 
      label: 'Total Referrals', 
      value: userData.referralCount.toString(), 
      icon: Users, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    { 
      label: 'Referral Earnings', 
      value: `₦${userData.referralEarnings.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    { 
      label: 'Current Tier', 
      value: 'Silver Partner', 
      icon: Award, 
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
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
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="text-brand-primary w-8 h-8" />
          Partnership Program
        </h1>
        <p className="text-slate-400">Earn 10% instant commission when your friends invest.</p>
      </header>

      {/* Referral Link Card */}
      <section className="bg-dark-surface rounded-3xl border border-dark-border p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-all duration-700"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-primary p-3 rounded-2xl shadow-xl shadow-blue-500/20">
              <Share2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Referral link</h2>
              <p className="text-slate-500 text-sm">Share this unique link to start earning</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 bg-dark-bg border border-dark-border rounded-2xl px-5 py-4 flex items-center justify-between font-mono text-sm text-slate-300">
              <span className="truncate mr-4">{referralLink}</span>
              <span className="text-brand-primary font-bold hidden md:inline">ID: {userData.referralCode}</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`
                flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black uppercase text-xs transition-all duration-300
                ${copied ? 'bg-green-500 text-white' : 'bg-white text-dark-bg hover:bg-slate-200 shadow-xl'}
              `}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
          
          <p className="text-xs text-slate-500 italic">Commissions are automatically added to your wallet balance once a referral completes their first investment.</p>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-dark-surface p-6 rounded-2xl border border-dark-border shadow-lg hover:border-brand-primary/30 transition-colors">
            <div className={`p-3 rounded-xl w-fit ${stat.bg} ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-bg/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
            Partner Activity
          </h2>
          <span className="text-[10px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase tracking-widest">10% Commission</span>
        </div>
        
        <div className="overflow-x-auto">
          {userData.referrals.length === 0 ? (
            <div className="p-20 text-center">
              <Users className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">You haven't referred anyone yet</p>
              <button onClick={copyToClipboard} className="text-brand-primary text-xs font-bold mt-2 hover:underline">Start referring friends</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Deposit</th>
                  <th className="px-6 py-4">Your Reward</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {userData.referrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {ref.id.slice(0, 2)}
                        </div>
                        <span className="text-white font-bold text-sm">User_{ref.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-400">{ref.date}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-300">₦{ref.amountInvested.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base font-black text-green-400">₦{ref.commissionEarned.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${ref.status === 'Invested' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};