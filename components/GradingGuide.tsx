
import React from 'react';
import { BookOpen, Info, Scale, Award, HelpCircle, ChevronRight, Hash } from 'lucide-react';

const GradingGuide: React.FC = () => {
  const gradeScale = [
    { letter: 'A', percent: '90-100', points: '4.0', points5: '5.0', description: 'Excellent' },
    { letter: 'B', percent: '80-89', points: '3.0', points5: '4.0', description: 'Good' },
    { letter: 'C', percent: '70-79', points: '2.0', points5: '3.0', description: 'Average' },
    { letter: 'D', percent: '60-69', points: '1.0', points5: '2.0', description: 'Below Average' },
    { letter: 'F', percent: '0-59', points: '0.0', points5: '0.0', description: 'Failure' },
  ];

  const weightInfo = [
    { type: 'Regular', boost: '+0.0', max: '4.0', desc: 'Standard college-prep classes.' },
    { type: 'Honors', boost: '+0.5', max: '4.5', desc: 'Advanced courses, moderate rigor.' },
    { type: 'AP / IB', boost: '+1.0', max: '5.0', desc: 'College-level, high rigor.' },
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
            Because grading systems vary across the United States, understanding how different scales are calculated is crucial for accurately tracking your academic progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Grading Scales */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Scale size={20} className="text-rose-900" />
            <h3 className="font-bold text-slate-800">The Standard 4.0 Scale</h3>
          </div>
          <div className="p-4 space-y-5 flex-1">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><span className="w-5 h-5 rounded bg-blue-100 text-blue-900 flex items-center justify-center text-xs">4.0</span> 4.0 Scale (Standard)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">The most common unweighted scale. A=4, B=3, C=2, D=1, F=0. Plus/Minus (+/-) variants add or subtract 0.3 points (e.g. B+ = 3.3, B- = 2.7, A = 4.0).</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><span className="w-5 h-5 rounded bg-emerald-100 text-[#196e1f] flex items-center justify-center text-xs">5.0</span> 5.0 Scale</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Used by some high schools to build weight into the base system. A=5, B=4, C=3, D=2, F=0.</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><span className="w-5 h-5 rounded bg-amber-100 text-amber-800 flex items-center justify-center text-xs">%</span> 100-Point (Percentage)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Instead of converting to 4.0 scale points, GPA is calculated as the average of exact numeric percentages (e.g. 95, 88).</p>
            </div>
          </div>
          
          <div className="bg-slate-50 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-slate-400 border-t border-b border-slate-200 bg-slate-100/50">
                  <th className="px-4 py-2 font-semibold">Grade</th>
                  <th className="px-4 py-2 font-semibold text-center">4.0 Scale</th>
                  <th className="px-4 py-2 font-semibold text-center">5.0 Scale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gradeScale.map((row) => (
                  <tr key={row.letter} className="hover:bg-white transition-colors">
                    <td className="px-4 py-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                          row.letter === 'A' ? 'bg-rose-100 text-rose-900 border border-rose-200' :
                          row.letter === 'B' ? 'bg-rose-300 text-rose-900' :
                          row.letter === 'C' ? 'bg-slate-200 text-slate-900' :
                          row.letter === 'D' ? 'bg-slate-300 text-slate-800' :
                          'bg-slate-400 text-white'
                        }`}>
                          {row.letter}
                        </span>
                    </td>
                    <td className="px-4 py-2 text-xs font-bold text-slate-900 text-center">{row.points}</td>
                    <td className="px-4 py-2 text-xs font-bold text-slate-900 text-center">{row.points5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weighted vs Unweighted */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Award size={20} className="text-rose-900" />
            <h3 className="font-bold text-slate-800">Weighted GPA (Course Rigor)</h3>
          </div>
          <div className="p-6 space-y-6 flex-1">
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Unweighted:</strong> The rigor or difficulty level of the class is completely ignored. An "A" in a regular course equals an "A" in an AP course.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Weighted:</strong> High schools apply a "boost" to harder courses to reward students for academic rigor.
            </p>
            <div className="space-y-4 border-t border-slate-100 pt-4">
              {weightInfo.map((info) => (
                <div key={info.type} className="flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{info.type}</span>
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
            <h3 className="text-xl font-bold">Calculation Formulas</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold mb-4">1. Unweighted 4.0 Scale</div>
                <div className="font-mono font-bold tracking-tight text-white/90 mb-4 text-center">
                  <div className="border-b border-white/20 pb-2 mb-2 inline-block px-4">Σ GradePoints</div><br/>
                  <div className="inline-block px-4">NumberOfCourses</div>
                </div>
                <p className="text-xs text-slate-400">Simply add up the base points for each letter grade (e.g., A=4, B=3) and divide by the total number of courses taken.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold mb-4">2. Credit-Hour Weighted</div>
                <div className="font-mono font-bold tracking-tight text-white/90 mb-4 text-center">
                  <div className="border-b border-white/20 pb-2 mb-2 inline-block px-4">Σ (GradePoints × Credits)</div><br/>
                  <div className="inline-block px-4">Σ Credits</div>
                </div>
                <p className="text-xs text-slate-400">Multiply each class's grade points by its credit value. Sum those up, then divide by the total credits attempted.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold mb-4">3. Weighted GPA</div>
                <div className="font-mono font-bold text-white/90 mb-4 text-center text-sm md:text-base">
                  <div className="mb-2 text-rose-200">WeightedPoints = BasePoints + CourseWeight</div>
                  <div className="border-b border-white/20 pb-2 mb-2 inline-block px-4">Σ WeightedPoints</div><br/>
                  <div className="inline-block px-4">Courses</div>
                </div>
                <p className="text-xs text-slate-400">Add a bonus to advanced courses (e.g., +1.0 for AP, +0.5 for Honors) before finding the cumulative average.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold mb-4">4. Percentage Average (100 Scale)</div>
                <div className="font-mono font-bold tracking-tight text-white/90 mb-4 text-center">
                  <div className="border-b border-white/20 pb-2 mb-2 inline-block px-4">Σ Grades</div><br/>
                  <div className="inline-block px-4">Courses</div>
                </div>
                <p className="text-xs text-slate-400">Directly average the raw numeric percentages without converting them to a 4.0 or 5.0 scale first.</p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                 <div className="text-sm font-bold text-slate-100 mb-2">Cumulative GPA</div>
                 <p className="text-xs text-slate-400 leading-relaxed">Includes all quality points and credits earned across every semester and year you have attended high school.</p>
              </div>
              <div>
                 <div className="text-sm font-bold text-slate-100 mb-2">Semester GPA</div>
                 <p className="text-xs text-slate-400 leading-relaxed">Calculates only the grades and credits from a specific grading period or semester.</p>
              </div>
              <div>
                 <div className="text-sm font-bold text-slate-100 mb-2">Core GPA</div>
                 <p className="text-xs text-slate-400 leading-relaxed">Includes only core academic subjects (English, Math, Science, Social Studies, Foreign Language) and excludes electives/PE.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-rose-900 shadow-sm shrink-0">
          <Hash size={20} />
        </div>
        <div>
          <h4 className="text-rose-900 font-bold mb-1">Credits vs. Units</h4>
          <p className="text-sm text-rose-950 leading-relaxed">
            Whether your school uses <strong>Carnegie Units</strong> (e.g. 0.5 for a semester, 1.0 for a year) or <strong>Credit Hours</strong> (e.g. 3.0 or 4.0 for college classes), the math works exactly the same way. The GPA weights courses proportionally by their assigned credit value.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradingGuide;
