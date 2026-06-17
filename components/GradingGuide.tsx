
import React from 'react';
import { BookOpen, Info, Scale, Award, HelpCircle, ChevronRight } from 'lucide-react';

const GradingGuide: React.FC = () => {
  const gradeScale = [
    { letter: 'A', percent: '90-100', points: '4.0', description: 'Excellent' },
    { letter: 'B', percent: '80-89', points: '3.0', description: 'Good' },
    { letter: 'C', percent: '70-79', points: '2.0', description: 'Average' },
    { letter: 'D', percent: '60-69', points: '1.0', description: 'Below Average' },
    { letter: 'F', percent: '0-59', points: '0.0', description: 'Failure' },
  ];

  const weightInfo = [
    { type: 'Regular', boost: '+0.0', max: '4.0', desc: 'Standard college-prep courses.' },
    { type: 'Honors', boost: '+0.5', max: '4.5', desc: 'Advanced courses with moderate rigor.' },
    { type: 'AP / IB', boost: '+1.0', max: '5.0', desc: 'College-level courses with high rigor.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 text-rose-900 rounded-xl">
              <Info size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">US Grading Systems Explained</h2>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            Understanding how your grades translate into a Grade Point Average (GPA) is crucial for tracking your academic progress and college readiness.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard 4.0 Scale */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Scale size={20} className="text-rose-900" />
            <h3 className="font-bold text-slate-800">The Standard 4.0 Scale</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">Grade</th>
                  <th className="px-6 py-3 font-semibold">Percent</th>
                  <th className="px-6 py-3 font-semibold">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {gradeScale.map((row) => (
                  <tr key={row.letter} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          row.letter === 'A' ? 'bg-rose-100 text-rose-900 border border-rose-200' :
                          row.letter === 'B' ? 'bg-rose-300 text-rose-900' :
                          row.letter === 'C' ? 'bg-rose-500 text-white' :
                          row.letter === 'D' ? 'bg-rose-700 text-rose-50' :
                          'bg-rose-900 text-rose-100'
                        }`}>
                          {row.letter}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{row.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{row.percent}%</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weighted GPA Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Award size={20} className="text-rose-900" />
            <h3 className="font-bold text-slate-800">Weighted GPA (Course Rigor)</h3>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Many US high schools use a weighted scale to reward students for taking more challenging courses.
            </p>
            <div className="space-y-4">
              {weightInfo.map((info) => (
                <div key={info.type} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-rose-300 transition-colors group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-rose-900 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{info.type}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-950 rounded-full font-bold">{info.boost} Boost</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Formula */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-800/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={24} className="text-rose-700" />
            <h3 className="text-xl font-bold">How is GPA Calculated?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-slate-400 text-sm leading-relaxed">
                Your GPA is the mathematical average of all your final course grades. To calculate it manually:
              </p>
              <ol className="space-y-3">
                {[
                  'Convert each letter grade to its point value.',
                  'Add all the point values together.',
                  'Divide the total by the number of courses taken.'
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-rose-700 font-bold">The Formula</div>
                <div className="text-2xl font-mono font-bold tracking-tight py-4">
                  Σ Grade Points / Σ Courses
                </div>
                <div className="pt-4 border-t border-white/10 text-xs text-slate-400 italic">
                  Example: (4.0 + 3.0 + 3.5) / 3 = 3.50 GPA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-rose-900 shadow-sm shrink-0">
          <Award size={20} />
        </div>
        <div>
          <h4 className="text-rose-900 font-bold mb-1">Scholar Tip: Cumulative vs. Term GPA</h4>
          <p className="text-sm text-rose-950 leading-relaxed">
            Your <strong>Term GPA</strong> only includes grades from the current semester, while your <strong>Cumulative GPA</strong> is the average of every grade you've earned throughout high school. Colleges look most closely at your cumulative weighted GPA!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradingGuide;
