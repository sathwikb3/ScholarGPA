
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { analyzeGrades } from '../services/geminiService';
import { Course, GPASettings, CalculationResult, Assignment } from '../types';
import { Sparkles, MessageSquareQuote, TrendingUp, Target } from 'lucide-react';
import GrantIcon from './GrantIcon';

interface AIAdvisorProps {
  variant?: 'emerald' | 'blue';
  courses: Course[];
  results: CalculationResult;
  settings: GPASettings;
  assignments: Assignment[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ courses, results, settings, assignments, variant = 'blue' }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAnalyze = async () => {
    if (courses.length === 0) return;
    setLoading(true);
    setError(false);
    try {
      const text = await analyzeGrades(courses, results, settings, assignments);
      setAdvice(text);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden transition-all hover:shadow-md font-medium">
      <div className={`p-6 text-white ${variant === 'emerald' ? 'bg-gradient-to-r from-[#0C380F] to-[#196e1f]' : 'bg-gradient-to-r from-blue-950 to-blue-800'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
               <GrantIcon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Grant's Strategic Insights</h3>
              <div className="flex items-center gap-2">
                <p className={`${variant === 'emerald' ? 'text-emerald-50' : 'text-blue-50'} text-xs`}>Personalized optimization path</p>
                {assignments.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[8px] uppercase tracking-wider font-bold">
                    + Assignment Data
                  </span>
                )}
              </div>
            </div>
          </div>
          {!advice && !loading && (
            <button
              onClick={handleAnalyze}
              disabled={courses.length === 0}
              className={`px-4 py-2 bg-white rounded-xl text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold ${variant === 'emerald' ? 'text-[#196e1f] shadow-emerald-900/20 hover:bg-emerald-50' : 'text-blue-900 shadow-blue-900/20 hover:bg-blue-50'}`}
            >
              <Sparkles size={16} />
              Analyze Path
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {!advice && !loading && (
          <div className="text-center py-6">
            <div className="bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={28} className="text-slate-300" />
            </div>
            <h4 className="text-slate-900 mb-1 font-semibold">Ready for Grant's Analysis?</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Grant will analyze your {courses.length} courses {assignments.length > 0 ? `and ${assignments.length} assignments ` : ''}to find the optimal path to your {settings.targetGPA.toFixed(3)} GPA goal.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className={`w-12 h-12 border-4 rounded-full animate-spin ${variant === 'emerald' ? 'border-emerald-100 border-t-emerald-800' : 'border-blue-100 border-t-blue-900'}`}></div>
              <Sparkles size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${variant === 'emerald' ? 'text-emerald-800' : 'text-blue-900'}`} />
            </div>
            <div className="text-center">
              <span className="text-slate-800 block font-semibold">Analyzing Academic Trends</span>
              <span className="text-xs text-slate-500">Calculating averaged impact...</span>
            </div>
          </div>
        )}

        {advice && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex gap-4">
              <div className="hidden sm:block">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === 'emerald' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-900'}`}>
                   <MessageSquareQuote size={20} />
                </div>
              </div>
              <div className="flex-1">
                <div className="prose prose-purple prose-sm max-w-none text-slate-700 leading-relaxed font-medium">
                  <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                    <Target size={14} />
                    Target: {settings.targetGPA.toFixed(3)}
                  </div>
                  <button 
                    onClick={() => setAdvice(null)}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors font-semibold ${variant === 'emerald' ? 'text-emerald-800 hover:text-emerald-900 bg-emerald-50' : 'text-blue-900 hover:text-blue-800 bg-blue-50'}`}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
