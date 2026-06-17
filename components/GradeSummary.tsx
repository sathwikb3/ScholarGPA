import React, { useMemo, useState } from 'react';
import { Target, TrendingUp, ExternalLink, RefreshCcw, Info } from 'lucide-react';
import { Assignment } from '../types';

interface GradeSummaryProps {
  assignments: Assignment[];
  onPushToGpa: (grade: number) => void;
}

const GradeSummary: React.FC<GradeSummaryProps> = ({ assignments, onPushToGpa }) => {
  const [targetGrade, setTargetGrade] = useState<number>(90);

  const stats = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalWeight = 0;
    assignments.forEach(a => {
      totalWeightedPoints += (a.score * a.weight);
      totalWeight += a.weight;
    });

    const currentGrade = totalWeight > 0 ? totalWeightedPoints / totalWeight : 0;
    const remainingWeight = Math.max(0, 100 - totalWeight);
    const pointsNeeded = (targetGrade * 100) - totalWeightedPoints;
    const requiredOnRemaining = remainingWeight > 0 ? pointsNeeded / remainingWeight : 0;

    return {
      currentGrade,
      totalWeight,
      remainingWeight,
      requiredOnRemaining
    };
  }, [assignments, targetGrade]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-24 space-y-8 animate-in fade-in duration-500">
      
      {/* Main Score Display */}
      <div className="text-center pb-8 border-b border-slate-100">
         <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl text-[#196e1f] mb-4 shadow-inner">
           <TrendingUp size={28} />
         </div>
         <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1 font-semibold">Current Standing</h3>
         <div className="text-5xl font-bold text-slate-900 tracking-tight">
           {stats.currentGrade.toFixed(3)}<span className="text-2xl text-slate-300 ml-1">%</span>
         </div>
         <div className={`mt-2 text-xs font-semibold px-4 py-1 rounded-full inline-block ${stats.currentGrade >= 90 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-[#196e1f] bg-emerald-50'}`}>
           Grade: {stats.currentGrade >= 90 ? 'A' : stats.currentGrade >= 80 ? 'B' : stats.currentGrade >= 70 ? 'C' : stats.currentGrade >= 60 ? 'D' : 'F'}
         </div>

         {/* Sidebar Quick Transfer Button */}
         <button
          onClick={() => onPushToGpa(stats.currentGrade)}
          className="w-full mt-6 py-3 bg-emerald-50 text-emerald-950 border border-emerald-300 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all text-xs font-bold shadow-sm"
         >
           <ExternalLink size={14} /> Push to GPA List
         </button>
      </div>

      {/* Goal Analysis Tool */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2 font-semibold">
            <Target size={14} className="text-emerald-700" />
            Target Analysis
          </h4>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5">
            <input 
              type="number"
              value={targetGrade}
              onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 0)}
              className="w-10 bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:ring-0 text-center"
            />
            <span className="text-[10px] text-slate-400 font-bold">%</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-700/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <RefreshCcw size={10} />
             Requirement on Balance
           </p>
           
           <div className="flex items-baseline gap-2">
             <div className={`text-4xl font-bold ${stats.requiredOnRemaining > 100 ? 'text-red-400' : 'text-emerald-600'}`}>
               {stats.remainingWeight > 0 ? stats.requiredOnRemaining.toFixed(3) : '0.000'}
             </div>
             <div className="text-sm text-slate-500 font-semibold">% Required Avg.</div>
           </div>

           <p className="text-[10px] leading-relaxed text-slate-400 mt-4 bg-white/5 p-3 rounded-xl border border-white/10">
             You have <span className="text-white font-bold">{stats.remainingWeight.toFixed(1)}%</span> of your grade remaining. To achieve a final grade of <span className="text-white font-bold">{targetGrade}%</span>, you must average the score above on all future coursework.
           </p>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-2">
        <div className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
           <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
           <p className="text-[11px] text-emerald-950 leading-relaxed font-semibold">
             Calculations use the <span className="underline decoration-emerald-500">Sum of Weights</span> method. If weights do not total 100%, results are normalized to the current total.
           </p>
        </div>
      </div>
    </div>
  );
};

export default GradeSummary;
