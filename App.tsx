import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Marketplace } from './components/Marketplace';
import { Portfolio } from './components/Portfolio';
import { AIAdvisor } from './components/AIAdvisor';
import { Settings } from './components/Settings';
import { AdminPanel } from './components/AdminPanel';
import { Referrals } from './components/Referrals';
import { AppRoute, UserData, InvestmentPlan, WithdrawalRequest, PortfolioItem, ReferralRecord } from './types';
import { Menu } from 'lucide-react';

const MOCK_PLANS: InvestmentPlan[] = [
  {
    id: 'minimal',
    name: 'Minimal Package',
    category: 'Fixed Income',
    riskLevel: 'Low',
    roi: 600, 
    dailyEarning: 100,
    duration: 10,
    minInvestment: 500,
    maxInvestment: 500,
    description: 'The perfect entry point. Invest ₦500 and earn ₦100 every single day.',
    trending: true
  },
  {
    id: 'lite',
    name: 'Lite Package',
    category: 'Fixed Income',
    riskLevel: 'Low',
    roi: 600,
    dailyEarning: 200,
    duration: 20,
    minInvestment: 1000,
    maxInvestment: 1000,
    description: 'Level up your earnings. Invest ₦1,000 and receive ₦200 daily returns.',
    trending: true
  },
  {
    id: 'supreme',
    name: 'Supreme Package',
    category: 'Fixed Income',
    riskLevel: 'Medium',
    roi: 600,
    dailyEarning: 300,
    duration: 30,
    minInvestment: 1500,
    maxInvestment: 1500,
    description: 'High performance returns. Invest ₦1,500 and earn ₦300 every day.',
    trending: true
  },
  {
    id: 'premium',
    name: 'Premium Package',
    category: 'Fixed Income',
    riskLevel: 'High',
    roi: 600,
    dailyEarning: 400,
    duration: 40,
    minInvestment: 2000,
    maxInvestment: 2000,
    description: 'The ultimate investment plan. Invest ₦2,000 for a massive ₦400 daily return.',
    trending: true
  }
];

const INITIAL_USER_DATA: UserData = {
  balance: 10000,
  totalInvested: 0,
  totalEarnings: 0,
  portfolio: [],
  referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
  referralCount: 2,
  referralEarnings: 150,
  referrals: [
    { id: 'XJ29', date: '2023-10-12', amountInvested: 1000, commissionEarned: 100, status: 'Invested' },
    { id: 'BK44', date: '2023-11-05', amountInvested: 500, commissionEarned: 50, status: 'Invested' },
  ]
};

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [routeHistory, setRouteHistory] = useState<AppRoute[]>([AppRoute.DASHBOARD]);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [plans, setPlans] = useState<InvestmentPlan[]>(MOCK_PLANS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Simulation: Check for expired investments
  useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      let changed = false;
      const updatedPortfolio = userData.portfolio.map(item => {
        if (item.status === 'Active') {
          const startDate = new Date(item.startDate);
          const plan = plans.find(p => p.id === item.planId);
          if (plan) {
            const expiryDate = new Date(startDate);
            expiryDate.setDate(expiryDate.getDate() + plan.duration);
            
            if (now >= expiryDate) {
              changed = true;
              return { ...item, status: 'Completed' as const };
            }
          }
        }
        return item;
      });

      if (changed) {
        setUserData(prev => {
          const activeInvestments = updatedPortfolio.filter(p => p.status === 'Active');
          const totalInvested = activeInvestments.reduce((sum, p) => sum + p.amountInvested, 0);
          return {
            ...prev,
            portfolio: updatedPortfolio,
            totalInvested
          };
        });
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000);
    return () => clearInterval(interval);
  }, [userData.portfolio, plans]);

  const handleNavigate = (route: AppRoute) => {
    if (route !== currentRoute) {
      setRouteHistory(prev => [...prev, route]);
      setCurrentRoute(route);
    }
  };

  const handleBack = () => {
    if (routeHistory.length > 1) {
      const newHistory = [...routeHistory];
      newHistory.pop();
      const previousRoute = newHistory[newHistory.length - 1];
      setRouteHistory(newHistory);
      setCurrentRoute(previousRoute);
    } else {
      setCurrentRoute(AppRoute.DASHBOARD);
      setRouteHistory([AppRoute.DASHBOARD]);
    }
  };

  const handleInvest = (plan: InvestmentPlan, amount: number) => {
    const investmentAmount = amount || plan.minInvestment;

    if (userData.balance < investmentAmount) {
      alert("Insufficient funds!");
      return;
    }

    const newPortfolioItem: PortfolioItem = {
      id: Date.now().toString(),
      planId: plan.id,
      amountInvested: investmentAmount,
      startDate: new Date().toISOString(),
      projectedReturn: plan.dailyEarning * plan.duration,
      dailyEarning: plan.dailyEarning,
      status: 'Active' as const
    };

    // Calculate Referral Commission Simulation
    // In a real app, this would be applied to the 'referrer' account.
    // For this simulation, we'll imagine a new referral just joined and invested
    // and we give a bonus to the current user to show the system works.
    const referralBonus = investmentAmount * 0.1; // 10% commission

    setUserData(prev => ({
      ...prev,
      balance: prev.balance - investmentAmount + referralBonus, // Added bonus for simulation
      totalInvested: prev.totalInvested + investmentAmount,
      portfolio: [...prev.portfolio, newPortfolioItem],
      referralEarnings: prev.referralEarnings + referralBonus,
      // Adding a fake log of the referral that just "invested"
      referrals: [{
        id: Math.random().toString(36).substring(7).toUpperCase(),
        date: new Date().toISOString().split('T')[0],
        amountInvested: investmentAmount,
        commissionEarned: referralBonus,
        status: 'Invested'
      }, ...prev.referrals]
    }));

    handleNavigate(AppRoute.PORTFOLIO);
    alert(`Success! ₦${referralBonus} commission added for the mock referral!`);
  };

  const handleWithdrawalRequest = (details: Omit<WithdrawalRequest, 'id' | 'status' | 'timestamp'>) => {
    const newRequest: WithdrawalRequest = {
      ...details,
      id: Math.random().toString(36).substring(7).toUpperCase(),
      status: 'Pending',
      timestamp: new Date()
    };
    
    setUserData(prev => ({
      ...prev,
      balance: prev.balance - details.amount
    }));

    setWithdrawalRequests(prev => [newRequest, ...prev]);
  };

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawalRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  const handleRejectWithdrawal = (id: string) => {
    const request = withdrawalRequests.find(r => r.id === id);
    if (!request) return;

    setWithdrawalRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));

    setUserData(prev => ({
      ...prev,
      balance: prev.balance + request.amount
    }));
  };

  const showBackButton = routeHistory.length > 1;

  const renderContent = () => {
    const props = { onBack: handleBack, showBack: showBackButton };

    switch (currentRoute) {
      case AppRoute.DASHBOARD:
        return <Dashboard 
          userData={userData} 
          plans={plans} 
          onInvest={(plan) => handleNavigate(AppRoute.MARKETPLACE)} 
          onWithdrawal={handleWithdrawalRequest}
          onNavigate={handleNavigate}
        />;
      case AppRoute.MARKETPLACE:
        return <Marketplace 
          plans={plans} 
          userBalance={userData.balance} 
          onInvest={handleInvest} 
          {...props}
        />;
      case AppRoute.PORTFOLIO:
        return <Portfolio userData={userData} plans={plans} {...props} />;
      case AppRoute.REFERRALS:
        return <Referrals userData={userData} {...props} />;
      case AppRoute.AI_ADVISOR:
        return <AIAdvisor userData={userData} plans={plans} {...props} />;
      case AppRoute.ADMIN:
        return <AdminPanel 
          requests={withdrawalRequests} 
          onApprove={handleApproveWithdrawal}
          onReject={handleRejectWithdrawal}
          {...props}
        />;
      case AppRoute.SETTINGS:
        return <Settings {...props} />;
      default:
        return <Dashboard userData={userData} plans={plans} onInvest={(plan) => handleNavigate(AppRoute.MARKETPLACE)} onWithdrawal={handleWithdrawalRequest} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        currentRoute={currentRoute} 
        onNavigate={handleNavigate} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-dark-border bg-dark-surface z-10">
          <span className="font-bold text-lg text-white">Lumina Invest</span>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;