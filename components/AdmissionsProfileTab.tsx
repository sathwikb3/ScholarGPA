import React, { useState } from 'react';
import { Target, School, MapPin, User, Sparkles, Building2, Brain, Check, Plus, Trash2, Activity, MessageSquare } from 'lucide-react';
import { GPASettings } from '../types';
import Markdown from 'react-markdown';
import { suggestColleges } from '../services/geminiService';

interface Props {
  settings: GPASettings;
  setSettings: (s: GPASettings) => void;
  gpa: number;
}

const AdmissionsProfileTab: React.FC<Props> = ({ settings, setSettings, gpa }) => {
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSuggestColleges = async () => {
    setLoading(true);
    try {
      const result = await suggestColleges(gpa, settings);
      setSuggestions(result);
    } catch (error) {
      setSuggestions("Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-8">
      {/* Admissions Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Target size={28} />
          </div>
          <div>
            <h2 className="text-2xl tracking-tight text-slate-800 font-semibold">Admissions Profile</h2>
            <p className="text-slate-500 text-sm">Your academic context for AI college targeting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-slate-100 pb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" /> High School Context
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">High School</label>
                <input 
                  type="text"
                  value={settings.school}
                  onChange={(e) => setSettings({...settings, school: e.target.value})}
                  placeholder="e.g. Stuyvesant High"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Location (City)</label>
                <input 
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({...settings, city: e.target.value})}
                  placeholder="e.g. New York City"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Grade Level</label>
                <select 
                  value={settings.gradeLevel}
                  onChange={(e) => setSettings({...settings, gradeLevel: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium appearance-none"
                >
                  {[9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>{num}th Grade</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-semibold">Final Cumulative Average</div>
                <div className="text-3xl font-semibold text-slate-800">{gpa.toFixed(3)}</div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Brain size={16} className="text-slate-400" /> College Preferences
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Intended Major</label>
                <input 
                  type="text"
                  value={settings.intendedMajor}
                  onChange={(e) => setSettings({...settings, intendedMajor: e.target.value})}
                  placeholder="e.g. Computer Science, Pre-Med"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Dream Schools (Comma separated)</label>
                <input 
                  type="text"
                  value={settings.dreamSchools?.join(', ')}
                  onChange={(e) => setSettings({...settings, dreamSchools: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                  placeholder="e.g. Stanford, MIT"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">SAT Score</label>
                  <input 
                    type="number"
                    value={settings.satScore || ''}
                    onChange={(e) => setSettings({...settings, satScore: parseInt(e.target.value) || undefined})}
                    placeholder="400-1600"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">ACT Score</label>
                  <input 
                    type="number"
                    value={settings.actScore || ''}
                    onChange={(e) => setSettings({...settings, actScore: parseInt(e.target.value) || undefined})}
                    placeholder="1-36"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 border-b border-slate-100 pb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Activity size={16} className="text-slate-400" /> Extracurricular Activities
            </h3>
            <div className="space-y-3">
              {(settings.extracurriculars || []).map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-0.5"></div>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => {
                      const newEcs = [...(settings.extracurriculars || [])];
                      newEcs[index] = e.target.value;
                      setSettings({ ...settings, extracurriculars: newEcs });
                    }}
                    placeholder="e.g. Debate Club President, Varsity Tennis"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                  />
                  <button
                    onClick={() => {
                      const newEcs = [...(settings.extracurriculars || [])];
                      newEcs.splice(index, 1);
                      setSettings({ ...settings, extracurriculars: newEcs });
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-amber-50 rounded-lg border border-slate-200 hover:border-red-200"
                    aria-label="Remove extracurricular"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSettings({ ...settings, extracurriculars: [...(settings.extracurriculars || []), ''] })}
                className="mt-2 text-[12px] text-amber-600 hover:text-amber-700 px-3 py-2 hover:bg-amber-50 rounded-lg border border-amber-100 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Extracurricular
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-400" /> Additional Comments
            </h3>
            <div className="space-y-2">
              <textarea
                value={settings.additionalComments || ''}
                onChange={(e) => setSettings({ ...settings, additionalComments: e.target.value })}
                placeholder="Any special circumstances, challenges, or additional context you want the AI to consider..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium min-h-[120px] resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-3">AI Discovery</p>
          <button 
            onClick={handleSuggestColleges}
            disabled={loading}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-300 font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2"><Sparkles size={18} className="animate-pulse" /> Analyzing Profile...</span>
            ) : (
              <span className="flex items-center gap-2"><Sparkles size={18} /> Suggest Target Colleges</span>
            )}
          </button>
        </div>

        {suggestions && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
             <div className="markdown-body">
              <Markdown>{suggestions}</Markdown>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionsProfileTab;
