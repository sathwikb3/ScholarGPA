
import React from 'react';
import { HistoryEntry } from '../types';
import { X, Trash2, TrendingUp, Calendar, Plus, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onDelete: (id: string) => void;
  onOpenAddPastGpa: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onDelete, onOpenAddPastGpa }) => {
  if (!isOpen) return null;

  const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
  const chartData = sortedHistory.map(entry => ({
      date: entry.semester && entry.year ? `${entry.semester.substring(0, 2)} '${entry.year.split('-')[1].substring(2)}` : new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      unweighted: parseFloat(entry.unweightedGPA.toFixed(3)),
      weighted: parseFloat(entry.weightedGPA.toFixed(3)),
      label: entry.label,
    }));

  const sortedDesc = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-medium">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg text-slate-800 flex items-center gap-2 font-semibold">
            <TrendingUp size={20} className="text-blue-900" />
            GPA Performance Trends
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenAddPastGpa}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-950 hover:bg-blue-300 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus size={14} /> Add Past GPA
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <TrendingUp size={48} className="mb-4 opacity-20" />
              <p>No snapshots saved yet.</p>
              <p className="text-xs mt-1">Save your results or add past GPAs to track growth over time.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-6 font-semibold">Historical Progress</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                      <Legend verticalAlign="top" align="right" iconType="circle" />
                      <Line type="monotone" dataKey="weighted" stroke="#9333ea" strokeWidth={3} name="Weighted" activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                      <Line type="monotone" dataKey="unweighted" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Unweighted" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid gap-3">
                {sortedDesc.map((entry, index) => {
                  const prevEntry = sortedDesc[index + 1];
                  const weightedDiff = prevEntry ? entry.weightedGPA - prevEntry.weightedGPA : 0;
                  const unweightedDiff = prevEntry ? entry.unweightedGPA - prevEntry.unweightedGPA : 0;
                  
                  return (
                  <div key={entry.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 group hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="bg-blue-50 p-2.5 rounded-xl text-blue-800"><Calendar size={18} /></div>
                      <div>
                        <div className="text-slate-900 font-semibold">{entry.label}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {entry.semester && entry.year ? `${entry.semester} ${entry.year} • ` : ''}
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end font-medium">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-lg text-blue-900 leading-tight font-bold">{entry.weightedGPA.toFixed(3)}</div>
                          {prevEntry && (
                            <div className={`flex items-center text-[10px] font-bold ${weightedDiff > 0 ? 'text-emerald-500' : weightedDiff < 0 ? 'text-red-500' : 'text-slate-300'}`}>
                              {weightedDiff > 0 ? <ArrowUpRight size={12} /> : weightedDiff < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                              {Math.abs(weightedDiff).toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-[8px] uppercase text-slate-400 tracking-widest font-semibold">Weighted</div>
                      </div>
                      <div className="text-right border-l border-slate-100 pl-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-lg text-slate-500 leading-tight font-bold">{entry.unweightedGPA.toFixed(3)}</div>
                          {prevEntry && (
                            <div className={`flex items-center text-[10px] font-bold ${unweightedDiff > 0 ? 'text-emerald-500' : unweightedDiff < 0 ? 'text-red-500' : 'text-slate-300'}`}>
                              {unweightedDiff > 0 ? <ArrowUpRight size={12} /> : unweightedDiff < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                              {Math.abs(unweightedDiff).toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-[8px] uppercase text-slate-400 tracking-widest font-semibold">Unweighted</div>
                      </div>
                      <button onClick={() => onDelete(entry.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
