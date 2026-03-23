import React, { useState, useEffect } from 'react';
import { InvestmentPlan } from '../types';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowLeft, 
  Copy, 
  Loader2, 
  XCircle,
  Building2,
  User,
  Hash,
  ShieldCheck,
  Globe,
  Database,
  SearchCode
} from 'lucide-react';

interface MarketplaceProps {
  plans: InvestmentPlan[];
  userBalance: number;
  onInvest: (plan: InvestmentPlan, amount: number) => void;
  onBack?: () => void;
  showBack?: boolean;
}

type PaymentStep = 'confirm' | 'payment' | 'verifying' | 'success' | 'error';

export const Marketplace: React.FC<MarketplaceProps> = ({ plans, userBalance, onInvest, onBack, showBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('confirm');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [referenceNum, setReferenceNum] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const categories = ['All', 'Fixed Income', 'Crypto', 'Stocks', 'Real Estate', 'AI Startups'];

  const filteredPlans = plans.filter(plan => {
    const matchesCategory = selectedCategory === 'All' || plan.category === selectedCategory;
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInvestClick = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setPaymentStep('confirm');
    setSenderName('');
    setReferenceNum('');
    setScanLogs([]);
  };

  const startPayment = () => {
    setPaymentStep('payment');
  };

  const addLog = (msg: string) => {
    setScanLogs(prev => [...prev.slice(-4), msg]);
  };

  const simulateVerification = () => {
    if (!senderName.trim() || !referenceNum.trim()) {
      alert("Please enter both Sender Name and Transfer Reference to proceed with automatic detection.");
      return;
    }
    
    setPaymentStep('verifying');
    setScanLogs([]);
    
    // High-speed log sequence for "Very Fast" feel
    const logSteps = [
      "Connecting to Moniepoint Secure Gateway...",
      "Searching account 9033856757 ledger...",
      "Analyzing reference: " + referenceNum,
      "Matching identity: " + senderName,
      "Validating ₦" + selectedPlan?.minInvestment.toLocaleString() + " deposit...",
      "Finalizing bank verification...",
    ];

    // Reduced interval to 500ms per log for high-speed effect
    logSteps.forEach((log, index) => {
      setTimeout(() => addLog(log), index * 500);
    });

    // Total verification time reduced to ~3.5 seconds
    setTimeout(() => {
      // Simulation Logic: '0000' reference fails, otherwise 95% success
      const isSuccess = referenceNum !== '0000' && Math.random() > 0.05;
      
      if (isSuccess) {
        setPaymentStep('success');
        setTimeout(() => {
          if (selectedPlan) {
            onInvest(selectedPlan, selectedPlan.minInvestment);
            setSelectedPlan(null);
          }
        }, 2500);
      } else {
        setPaymentStep('error');
      }
    }, 3500);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in relative">
      {showBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white font-black hover:text-brand-primary transition-colors mb-2 group"
        >
          <ArrowLeft className="w-5 h-5 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investment Packages</h1>
          <p className="text-slate-400">Secure plans with high-speed automatic payout detection.</p>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-brand-primary text-white shadow-lg shadow-blue-500/20' : 'bg-dark-surface text-slate-400 hover:bg-dark-border'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map(plan => (
          <div key={plan.id} className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden hover:border-brand-primary/50 transition-all group hover:-translate-y-1 duration-300 flex flex-col shadow-lg">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                  {plan.category}
                </span>
                <div className="text-right">
                  <p className="text-xl font-black text-brand-primary">₦{plan.dailyEarning}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Daily Earn</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-xs mb-6 h-12 line-clamp-2">{plan.description}</p>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-dark-bg p-3 rounded-lg flex justify-between items-center">
                  <p className="text-xs text-slate-500">Capital Required</p>
                  <p className="text-sm font-bold text-white">₦{plan.minInvestment.toLocaleString()}</p>
                </div>
                <div className="bg-dark-bg p-3 rounded-lg flex justify-between items-center">
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-sm font-bold text-white">{plan.duration} Days</p>
                </div>
              </div>
              <div className="pt-4 border-t border-dark-border">
                <button onClick={() => handleInvestClick(plan)} className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Activate Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl">
          <div className="bg-dark-surface rounded-[2.5rem] w-full max-w-md border border-dark-border shadow-2xl overflow-hidden relative">
            
            {paymentStep === 'confirm' && (
              <div className="animate-fade-in p-8">
                <h2 className="text-2xl font-black text-white mb-6">Activate Plan</h2>
                <div className="p-6 bg-dark-bg rounded-3xl border border-dark-border space-y-4 mb-8">
                   <div className="flex justify-between items-center">
                     <span className="text-slate-500 text-xs font-bold uppercase">Package</span>
                     <span className="text-white font-bold">{selectedPlan.name}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-500 text-xs font-bold uppercase">Activation Cost</span>
                     <span className="text-xl font-black text-brand-primary">₦{selectedPlan.minInvestment.toLocaleString()}</span>
                   </div>
                </div>
                <button onClick={startPayment} className="w-full py-5 bg-white text-dark-bg font-black rounded-2xl hover:bg-slate-200 uppercase tracking-widest text-sm mb-4">
                  Proceed to Payment
                </button>
                <button onClick={() => setSelectedPlan(null)} className="w-full text-slate-500 font-bold text-xs">Cancel Activation</button>
              </div>
            )}

            {paymentStep === 'payment' && (
              <div className="animate-fade-in p-8 space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="text-brand-primary w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Bank Transfer Details</h2>
                  <p className="text-slate-400 text-sm">Transfer <span className="text-white font-black">₦{selectedPlan.minInvestment.toLocaleString()}</span> to the details below.</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-dark-bg p-4 rounded-2xl border border-dark-border flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Account Number</p>
                      <p className="text-xl font-black text-white tracking-widest">9033856757</p>
                    </div>
                    <button onClick={() => copyToClipboard('9033856757', 'acc')} className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                      {copiedField === 'acc' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-bg p-4 rounded-2xl border border-dark-border">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Bank</p>
                      <p className="text-sm font-bold text-white">Moniepoint</p>
                    </div>
                    <div className="bg-dark-bg p-4 rounded-2xl border border-dark-border">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Name</p>
                      <p className="text-sm font-bold text-white">David Ayinde</p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-2">Sender Name</label>
                    <input type="text" placeholder="Full name on your bank account" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-2">Reference ID</label>
                    <input type="text" placeholder="Reference from your bank app" value={referenceNum} onChange={(e) => setReferenceNum(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-primary" />
                  </div>
                  <button onClick={simulateVerification} className="w-full py-4 bg-brand-primary text-white font-black rounded-xl hover:shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    High-Speed Verification
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'verifying' && (
              <div className="p-12 text-center space-y-8 animate-fade-in">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-brand-primary/10 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-t-brand-primary rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <SearchCode className="text-brand-primary w-10 h-10 animate-pulse" />
                   </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white italic">Scanning Inter-bank Network...</h3>
                  <div className="bg-black/40 rounded-2xl p-4 border border-dark-border text-left font-mono text-[10px] h-32 overflow-hidden shadow-inner">
                    {scanLogs.map((log, i) => (
                      <div key={i} className="text-brand-primary mb-1 animate-fade-in">
                        <span className="text-slate-600 mr-2">&gt;</span>
                        {log}
                      </div>
                    ))}
                    <div className="w-2 h-4 bg-brand-primary inline-block animate-pulse ml-1"></div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Processing Speed: Optimal</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-16 text-center animate-fade-in space-y-8 bg-green-500/5">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 animate-bounce">
                  <CheckCircle2 className="text-white w-20 h-20" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Transactions Approved ✅</h2>
                  <p className="text-green-400 font-black text-sm uppercase tracking-widest">Instant Detection Successful</p>
                </div>
                <div className="bg-dark-bg/80 p-4 rounded-2xl border border-green-500/20">
                  <p className="text-slate-400 text-xs mt-1 italic">Activation in progress...</p>
                </div>
              </div>
            )}

            {paymentStep === 'error' && (
              <div className="p-16 text-center animate-fade-in space-y-8 bg-red-500/5">
                <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/30">
                  <XCircle className="text-white w-20 h-20" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Transactions Declined ❌</h2>
                  <p className="text-red-400 font-black text-sm uppercase tracking-widest">Verification Failed</p>
                </div>
                <div className="bg-dark-bg/80 p-4 rounded-2xl border border-red-500/20">
                  <p className="text-slate-400 text-xs mt-1">No matching transfer found on Moniepoint network for this reference.</p>
                </div>
                <button onClick={() => setPaymentStep('payment')} className="w-full py-4 bg-white text-dark-bg font-black rounded-xl uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors">Retry Verification</button>
                <button onClick={() => setSelectedPlan(null)} className="text-slate-500 font-bold text-xs block mx-auto hover:text-white">Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};