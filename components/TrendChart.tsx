
import React, { useState } from 'react';
import { HistoryEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Brush } from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TrendChartProps {
  history: HistoryEntry[];
  onViewHistory: () => void;
  onOpenAddPastGpa: () => void;
}

const TrendChart: React.FC<TrendChartProps> = ({ history, onViewHistory, onOpenAddPastGpa }) => {
  if (history.length < 2) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
          <TrendingUp size={24} />
        </div>
        <h3 className="text-slate-800 font-semibold mb-1">GPA Trend</h3>
        <p className="text-slate-500 text-xs max-w-[200px]">
          Log your past semesters or save at least two snapshots to visualize your academic growth.
        </p>
        <div className="flex gap-3 mt-4">
          <button 
            onClick={onOpenAddPastGpa}
            className="text-[10px] uppercase tracking-widest text-blue-900 font-bold hover:underline"
          >
            Log Past GPA
          </button>
          <div className="w-px bg-slate-200 h-4"></div>
          <button 
            onClick={onViewHistory}
            className="text-[10px] uppercase tracking-widest text-slate-500 font-bold hover:underline"
          >
            View History
          </button>
        </div>
      </div>
    );
  }

  const chartData = [...history]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(entry => ({
      date: entry.semester && entry.year ? `${entry.semester.substring(0, 2)} '${entry.year.split('-')[1].substring(2)}` : new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      fullDate: new Date(entry.timestamp).toLocaleDateString(),
      weighted: parseFloat(entry.weightedGPA.toFixed(3)),
      unweighted: parseFloat(entry.unweightedGPA.toFixed(3)),
      label: entry.label,
    }));
    
  const firstGpa = chartData[0].weighted;
  const lastGpa = chartData[chartData.length - 1].weighted;
  const delta = lastGpa - firstGpa;
  const hasImproved = delta > 0;
  const hasDeclined = delta < 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all font-medium">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-900">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 font-semibold">Academic Growth</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Historical Performance</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-blue-900">
              <span className="w-2 h-2 rounded-full bg-blue-900"></span>
              Weighted
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Unweighted
            </div>
          </div>
          {delta !== 0 && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${hasImproved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {hasImproved ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(delta).toFixed(2)} {hasImproved ? 'Improvement' : 'Decline'}
            </div>
          )}
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeighted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                fontSize: '12px',
                padding: '12px'
              }} 
              itemStyle={{ padding: '2px 0' }}
            />
            <Area 
              type="monotone" 
              dataKey="weighted" 
              stroke="#1E3A8A" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorWeighted)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="unweighted" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
            />
            <Brush dataKey="date" height={30} stroke="#1E3A8A" fill="#f8fafc" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={14} className="text-slate-400" />
          <span>Last updated {chartData[chartData.length - 1].fullDate}</span>
        </div>
        <button 
          onClick={onViewHistory}
          className="text-xs font-bold text-blue-900 hover:text-blue-800 transition-colors"
        >
          View Full History
        </button>
      </div>
    </div>
  );
};

export default TrendChart;
