
import React from 'react';
import { CalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BookmarkPlus, Target, ArrowUpCircle, ArrowDownCircle, BookOpen, Layers } from 'lucide-react';

interface GpaSummaryProps {
  result: CalculationResult;
  targetGPA: number;
  onSaveSnapshot: () => void;
}

const GpaSummary: React.FC<GpaSummaryProps> = ({ result, targetGPA, onSaveSnapshot }) => {
  const maxScale = 6.0;
  const currentGPA = result.cumulativeWeightedGPA;
  const value = Math.min(currentGPA, maxScale);
  
  const data = [
    { name: 'GPA', value: value || 0 },
    { name: 'Remaining', value: Math.max(0, maxScale - (value || 0)) },
  ];
  
  const diff = targetGPA - currentGPA;
  const isOnTrack = currentGPA >= targetGPA;
  const COLORS = ['#1E3A8A', '#93C5FD']; // Blue-900 / Blue-300

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 w-full sticky top-24 font-medium">
      <h2 className="text-lg text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
        <Target size={18} className="text-blue-800" />
        Academic Snapshot
      </h2>
      
      <div className="flex justify-center items-center h-48 mb-6 relative">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
         </ResponsiveContainer>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[20%] text-center">
             <div className="text-3xl text-blue-900 font-bold">{currentGPA.toFixed(3)}</div>
             <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Final Cuml. GPA</div>
             <div className="text-[8px] text-slate-400">Past + Current Avg</div>
         </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl border flex flex-col gap-2 ${isOnTrack ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between items-center">
                <span className={`text-[10px] uppercase tracking-widest ${isOnTrack ? 'text-blue-950' : 'text-slate-600'}`}>
                    Target: {targetGPA.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-500">
                    {isOnTrack ? 'Target Exceeded' : `${diff.toFixed(3)} Points Needed`}
                </span>
            </div>
            <div className="w-full bg-slate-200/50 rounded-full h-2 overflow-hidden">
                <div 
                    className="h-full transition-all duration-1000 bg-blue-800" 
                    style={{ width: `${Math.min((currentGPA / targetGPA) * 100, 100)}%` }}
                ></div>
            </div>
            <div className="flex items-center gap-1.5">
                {isOnTrack ? (
                    <ArrowUpCircle size={14} className="text-blue-900" />
                ) : (
                    <ArrowDownCircle size={14} className="text-blue-700" />
                )}
                <span className={`text-xs ${isOnTrack ? 'text-blue-950' : 'text-slate-600'}`}>
                    {isOnTrack ? 'Excellent Standing' : 'Optimization Recommended'}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-900 rounded-xl p-4 text-white shadow-lg shadow-blue-100 group relative overflow-hidden text-center">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                <div className="flex justify-center items-center gap-1.5 mb-1 opacity-80">
                    <BookOpen size={14} />
                    <span className="text-[10px] uppercase tracking-wider">Term Weighted</span>
                </div>
                <div className="text-xl font-bold">{result.weightedGPA.toFixed(3)}</div>
            </div>
            <div className="bg-blue-800 rounded-xl p-4 text-white shadow-lg shadow-blue-100 group relative overflow-hidden text-center">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                <div className="flex justify-center items-center gap-1.5 mb-1 opacity-80">
                    <Layers size={14} />
                    <span className="text-[10px] uppercase tracking-wider">Term Unweighted</span>
                </div>
                <div className="text-xl font-bold">{result.unweightedGPA.toFixed(3)}</div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                    <Layers size={10} /> Final Weighted
                </div>
                <div className="text-sm text-slate-800 font-bold">{result.cumulativeWeightedGPA.toFixed(3)}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                    <Layers size={10} /> Final Unweighted
                </div>
                <div className="text-sm text-slate-800 font-bold">{result.cumulativeUnweightedGPA.toFixed(3)}</div>
            </div>
        </div>

        <button 
          onClick={onSaveSnapshot}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-blue-950 text-white hover:bg-blue-800 rounded-xl transition-all shadow-lg shadow-blue-300 text-sm font-semibold"
        >
          <BookmarkPlus size={16} />
          Log Current Term to Graph
        </button>
      </div>
    </div>
  );
};

export default GpaSummary;
