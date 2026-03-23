import React from 'react';
import { WithdrawalRequest } from '../types';
import { ShieldCheck, CheckCircle, XCircle, Clock, Search, Filter, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  requests: WithdrawalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ requests, onApprove, onReject, onBack, showBack }) => {
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

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-brand-primary w-8 h-8" />
            Admin Control Center
          </h1>
          <p className="text-slate-400">Manual verification and processing of user withdrawal requests.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search User ID..." 
              className="bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-brand-primary outline-none"
            />
          </div>
        </div>
      </header>

      {/* Requests Table */}
      <section className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-dark-border bg-dark-bg/30 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Pending Requests ({requests.filter(r => r.status === 'Pending').length})</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-wider">Manual Verification</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {requests.length === 0 ? (
            <div className="p-20 text-center">
              <Clock className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No pending withdrawal requests</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Holder / Bank</th>
                  <th className="px-6 py-4">Account No.</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <span className="text-xs font-mono text-slate-500">#{request.id.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{request.accountHolderName}</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase">{request.bankName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-300">{request.accountNumber}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base font-black text-brand-primary">₦{request.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`
                        px-2.5 py-1 rounded-lg text-[10px] font-black uppercase
                        ${request.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                          request.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                      `}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {request.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onReject(request.id)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onApprove(request.id)}
                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
      
      {/* Logs section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-primary" />
            Audit Logs
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs p-3 bg-dark-bg rounded-xl border border-dark-border">
              <span className="text-slate-500 font-bold uppercase">System Init</span>
              <span className="text-slate-400">0.0.1 Stable</span>
            </div>
            <p className="text-xs text-slate-600 italic">Financial compliance checks enabled. All withdrawals over ₦50,000 flagged for secondary review.</p>
          </div>
        </div>
        <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border relative overflow-hidden group">
          <ArrowUpRight className="absolute -top-4 -right-4 w-24 h-24 text-brand-primary/10 transition-transform group-hover:scale-110" />
          <h3 className="text-white font-bold mb-2">Payout Queue</h3>
          <p className="text-3xl font-black text-white">₦{requests.filter(r => r.status === 'Approved').reduce((acc, r) => acc + r.amount, 0).toLocaleString()}</p>
          <p className="text-[10px] font-black text-brand-primary uppercase mt-2">Total Disbursed Today</p>
        </div>
      </div>
    </div>
  );
};