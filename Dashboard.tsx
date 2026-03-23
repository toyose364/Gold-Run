import React, { useState } from 'react';
import { UserData, InvestmentPlan, WithdrawalRequest, AppRoute } from '../types';
import { 
  Wallet, 
  Activity, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowDownCircle,
  X,
  AlertTriangle,
  Users
} from 'lucide-react';

interface DashboardProps {
  userData: UserData;
  plans: InvestmentPlan[];
  onInvest: (plan: InvestmentPlan) => void;
  onWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'status' | 'timestamp'>) => void;
  onNavigate: (route: AppRoute) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, plans, onInvest, onWithdrawal, onNavigate }) => {
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [activeMinLimit, setActiveMinLimit] = useState(600);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [withdrawalData, setWithdrawalData] = useState({
    accountNumber: '',
    bankName: '',
    accountHolderName: '',
    amount: ''
  });
  const [error, setError] = useState('');

  const openWithdrawalForPlan = (plan: InvestmentPlan) => {
    let min = 600;
    if (plan.id === 'premium') min = 2400;
    else if (plan.id === 'supreme') min = 1800;
    else if (plan.id === 'lite') min = 1200;
    
    setActiveMinLimit(min);
    setSelectedPlanName(plan.name);
    setIsWithdrawalOpen(true);
    setError('');
  };

  const stats = [
    { 
      id: 'wallet', 
      title: 'Total Wallet', 
      value: `₦${userData.balance.toLocaleString()}`, 
      change: '+4.2%', 
      isPositive: true, 
      icon: Wallet,
      desc: 'Available for withdrawal or reinvestment'
    },
    { 
      id: 'capital', 
      title: 'Active Capital', 
      value: `₦${userData.totalInvested.toLocaleString()}`, 
      change: '+12.5%', 
      isPositive: true, 
      icon: Activity,
      desc: 'Principal currently locked in active cycles'
    },
    { 
      id: 'earnings', 
      title: 'Accumulated Earn', 
      value: `₦${userData.totalEarnings.toLocaleString()}`, 
      change: '+8.1%', 
      isPositive: true, 
      icon: DollarSign,
      desc: 'Net profit generated from all packages'
    },
    { 
      id: 'packages', 
      title: 'Active Packages', 
      value: userData.portfolio.filter(p => p.status === 'Active').length.toString(), 
      change: '+1', 
      isPositive: true, 
      icon: Clock,
      desc: 'Currently running earning structures'
    }
  ];

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(withdrawalData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (amount < activeMinLimit) {
      setError(`Minimum withdrawal for ${selectedPlanName} is ₦${activeMinLimit.toLocaleString()}.`);
      return;
    }

    if (amount > userData.balance) {
      setError('Insufficient balance in your wallet.');
      return;
    }

    if (!withdrawalData.accountNumber || !withdrawalData.bankName || !withdrawalData.accountHolderName) {
      setError('Please fill in all banking details.');
      return;
    }

    onWithdrawal({
      accountNumber: withdrawalData.accountNumber,
      bankName: withdrawalData.bankName,
      accountHolderName: withdrawalData.accountHolderName,
      amount: amount
    });

    setIsWithdrawalOpen(false);
    setWithdrawalData({
      accountNumber: '',
      bankName: '',
      accountHolderName: '',
      amount: ''
    });
    alert('Withdrawal request sent to admin for manual processing.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investor Overview</h1>
          <p className="text-slate-400">Manage your capital and track daily performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(AppRoute.REFERRALS)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary/10 text-brand-primary font-black rounded-2xl hover:bg-brand-primary hover:text-white transition-all border border-brand-primary/20 uppercase text-xs"
          >
            <Users className="w-4 h-4" />
            Referrals
          </button>
          <div className="flex items-center gap-4 bg-dark-surface p-3 rounded-2xl border border-dark-border">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Net Value</p>
              <p className="text-xl font-black text-brand-primary">₦{(userData.balance + userData.totalInvested).toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-dark-border mx-2"></div>
            <button className="bg-brand-primary/10 p-2 rounded-lg border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Financial Summary Table */}
      <section className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-bg/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-primary" />
            Financial Summary
          </h2>
          <span className="text-[10px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Metric</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Balance</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">24h Growth</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Analysis</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.id} className="hover:bg-brand-primary/5 transition-colors group cursor-default">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dark-bg border border-dark-border rounded-lg group-hover:border-brand-primary/30 transition-colors">
                        <stat.icon className="w-5 h-5 text-brand-primary" />
                      </div>
                      <span className="font-bold text-white">{stat.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-lg font-black text-white">{stat.value}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                      {stat.change}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <span className="text-xs text-slate-500 font-medium">{stat.desc}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Investment Packages Table */}
      <section className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-bg/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
            Available Investment Structures
          </h2>
          <button 
            onClick={() => onInvest(plans[0])}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Package Tier</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment Cost</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Daily Payout</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cycle Period</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-brand-primary/5 transition-colors border-b border-dark-border/30 last:border-0 group">
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-base">{plan.name}</span>
                      <span className="text-[10px] font-black text-brand-primary uppercase tracking-tighter mt-1">Guaranteed ROI</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-white font-black">₦{plan.minInvestment.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-brand-primary font-black">₦{plan.dailyEarning.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-slate-400 font-bold">{plan.duration} Days</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openWithdrawalForPlan(plan)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-dark-bg text-[10px] font-black rounded-xl hover:bg-slate-200 transition-all uppercase"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        Withdraw
                      </button>
                      <button 
                        onClick={() => onInvest(plan)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-[10px] font-black rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all uppercase"
                      >
                        Invest Now
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Withdrawal Modal */}
      {isWithdrawalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-dark-surface rounded-3xl w-full max-w-lg border border-dark-border shadow-2xl animate-fade-in overflow-hidden">
            <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-bg/20">
              <div>
                <h2 className="text-xl font-bold text-white">Withdrawal: {selectedPlanName}</h2>
                <p className="text-slate-400 text-xs mt-1">Manual verification required for all payouts.</p>
              </div>
              <button 
                onClick={() => setIsWithdrawalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Holder Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full name"
                    value={withdrawalData.accountHolderName}
                    onChange={(e) => setWithdrawalData({...withdrawalData, accountHolderName: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="10-digit number"
                    value={withdrawalData.accountNumber}
                    onChange={(e) => setWithdrawalData({...withdrawalData, accountNumber: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bank Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Zenith Bank, Kuda, FirstBank"
                  value={withdrawalData.bankName}
                  onChange={(e) => setWithdrawalData({...withdrawalData, bankName: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Withdrawal Amount (Min ₦{activeMinLimit.toLocaleString()})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold">₦</span>
                  <input 
                    type="number" 
                    required
                    min={activeMinLimit}
                    placeholder="0.00"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl pl-8 pr-4 py-3 text-white focus:border-brand-primary outline-none transition-colors"
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Available Wallet: ₦{userData.balance.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-dark-bg font-black rounded-2xl hover:bg-slate-200 transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                  Process Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};