import React from 'react';
import { UserData, InvestmentPlan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Clock, Wallet, ArrowLeft, RefreshCw } from 'lucide-react';

interface PortfolioProps {
  userData: UserData;
  plans: InvestmentPlan[];
  onBack?: () => void;
  showBack?: boolean;
}

export const Portfolio: React.FC<PortfolioProps> = ({ userData, plans, onBack, showBack }) => {
  const categoryData = userData.portfolio.reduce((acc: any[], item) => {
    const plan = plans.find(p => p.id === item.planId);
    if (!plan) return acc;
    
    const existing = acc.find((x: any) => x.name === plan.category);
    if (existing) {
      existing.value += item.amountInvested;
    } else {
      acc.push({ name: plan.category, value: item.amountInvested });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#a855f7', '#06b6d4'];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
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
        <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
        <p className="text-slate-400">Monitor your active packages and daily earnings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border flex flex-col items-center shadow-xl">
          <h2 className="text-lg font-bold text-white w-full mb-4">Investment Split</h2>
          <div className="h-[250px] w-full relative">
            {userData.portfolio.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: '#0d1526', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Wallet className="w-12 h-12 mb-2 opacity-20" />
                <p>No active packages</p>
              </div>
            )}
            {userData.portfolio.length > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Active</p>
                <p className="text-lg font-black text-white">₦{userData.totalInvested.toLocaleString()}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 w-full mt-4">
            {categoryData.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center gap-2 text-sm bg-dark-bg/50 p-2 rounded-lg border border-dark-border">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-slate-400 text-xs font-medium">{item.name}</span>
                <span className="text-white font-bold ml-auto text-xs">₦{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white">Your Packages</h2>
          {userData.portfolio.length === 0 ? (
            <div className="bg-dark-surface rounded-2xl p-12 text-center border border-dark-border border-dashed shadow-inner">
              <TrendingUp className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-400 mb-6">Your portfolio is empty. Start earning today.</p>
              <button className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                Browse Marketplace
              </button>
            </div>
          ) : (
            userData.portfolio.map(item => {
              const plan = plans.find(p => p.id === item.planId);
              if (!plan) return null;
              
              // Calculate real progress
              const start = new Date(item.startDate).getTime();
              const now = new Date().getTime();
              const durationMs = plan.duration * 24 * 60 * 60 * 1000;
              const elapsed = now - start;
              const progress = Math.min(100, Math.max(0, (elapsed / durationMs) * 100));
              const isCompleted = item.status === 'Completed';

              return (
                <div key={item.id} className={`bg-dark-surface p-5 rounded-2xl border border-dark-border transition-all group shadow-lg ${isCompleted ? 'opacity-70 grayscale-[0.5]' : 'hover:border-brand-primary/20'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${isCompleted ? 'bg-slate-800 text-slate-500' : 'bg-brand-primary/10 text-brand-primary group-hover:scale-110'}`}>
                        {isCompleted ? <RefreshCw className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${isCompleted ? 'bg-slate-700 text-slate-400' : 'bg-brand-primary text-white'}`}>
                            {isCompleted ? 'Expired' : 'Active'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium">Started {new Date(item.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase font-black">{isCompleted ? 'Cycle Ended' : 'Daily Earning'}</span>
                        <p className={`font-black text-xl ${isCompleted ? 'text-slate-500' : 'text-brand-primary'}`}>₦{isCompleted ? '0' : item.dailyEarning.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {isCompleted ? 'Plan Cancelled' : 'Growth Cycle'}
                      </span>
                      <span className={isCompleted ? 'text-slate-500' : 'text-brand-primary'}>
                        {isCompleted ? 'Reinvest needed' : `₦${item.amountInvested.toLocaleString()} → ₦${item.projectedReturn.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-bg rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-slate-700' : 'bg-brand-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    {isCompleted && (
                      <p className="text-[10px] text-yellow-500/80 mt-2 font-bold uppercase text-center">Cycle period reached. Reinvest to continue earning.</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};