import React from 'react';
import { Loader2, Sparkles, Cloud, Brain, ShieldCheck, Zap } from 'lucide-react';

interface UpgradeViewProps {
  handleUpgrade: () => void;
  isCheckoutLoading: boolean;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ handleUpgrade, isCheckoutLoading }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Unlock ScholarGPA <span className="text-amber-500">Premium</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Take your academic journey to the next level with advanced AI insights, seamless cloud synchronization, and exclusive tools designed for top achievers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Cloud size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Cloud Sync</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Automatically backup and sync your academic profile across all your devices securely.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Brain size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">AI Insights</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Get personalized recommendations and predictive GPA modeling from our advanced AI advisor.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Advanced Analytics</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Visualize your progress with in-depth grade trends and comprehensive statistical reports.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Priority Support</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Experience faster response times and dedicated assistance for your academic questions.</p>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 text-center overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Lifetime Access</h3>
          <div className="flex items-end justify-center gap-1 mb-6">
            <span className="text-5xl font-extrabold text-slate-900">$5</span>
            <span className="text-slate-500 font-medium mb-1.5">.00</span>
          </div>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm">
            One-time payment for unrestricted access to all current and future premium features.
          </p>
          <button 
            onClick={handleUpgrade}
            disabled={isCheckoutLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isCheckoutLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="text-amber-400" />}
            {isCheckoutLoading ? 'Connecting to Secure Checkout...' : 'Get Started Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeView;
