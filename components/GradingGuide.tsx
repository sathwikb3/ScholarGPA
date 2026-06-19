
import React from 'react';
import { BookOpen, Info, Scale, Award, Percent } from 'lucide-react';

const GradingGuide: React.FC = () => {
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
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">GPA Calculation Models</h2>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            The GPA Calculator allows you to switch between five different calculation models. Here is exactly what each option in the dropdown menu means and how it affects your grades.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Unweighted 4.0 Scale */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl shrink-0 mt-1">
            <Scale size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unweighted 4.0 Scale</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              The most common grading model in the US. The rigor or difficulty level of your classes is completely ignored. An "A" in a regular course equals the exact same points as an "A" in an AP course.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs font-mono text-slate-700">
              <strong>Base Points:</strong> A = 4.0 | B = 3.0 | C = 2.0 | D = 1.0 | F = 0.0
            </div>
          </div>
        </div>

        {/* Weighted 4.0 Scale */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-rose-50 text-rose-900 rounded-xl shrink-0 mt-1">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Weighted 4.0 Scale</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              A strict 4.0-capped weighted model where the highest possible GPA across all courses is 4.0. Regular classes are tracked out of a 3.0 maximum, allowing room for Honors and AP bonuses.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 text-xs font-mono text-slate-700">
              <div><strong>Regular:</strong> Max 3.0 (e.g. 100 = 3.0)</div>
              <div><strong>Honors:</strong> Max 3.5 (+0.5 Boost)</div>
              <div><strong>AP/IB:</strong> Max 4.0 (+1.0 Boost)</div>
            </div>
          </div>
        </div>

        {/* Weighted 5.0 Scale */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl shrink-0 mt-1">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Weighted 5.0 Scale</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              The standard US weighted model (often referred to mathematically as a 5.0 max scale). Regular classes are tracked out of a 4.0, and bonus points are given for advanced courses.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 text-xs font-mono text-slate-700">
                 <div><strong>Regular:</strong> Max 4.0</div>
                 <div><strong>Honors:</strong> Max 4.5 (+0.5 Boost)</div>
                 <div><strong>AP/IB:</strong> Max 5.0 (+1.0 Boost)</div>
               </div>
            </div>
          </div>
        </div>

        {/* Weighted 6.0 Scale */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl shrink-0 mt-1">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Weighted 6.0 Scale</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Similar to the 5.0 scale, the highest possible GPA is often a 6.0. Regular classes are graded out of 5.0, Honors classes receive a +0.5 boost, and AP/IB classes receive a full +1.0 boost.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 text-xs font-mono text-slate-700">
              <div><strong>Regular:</strong> A = 5.0</div>
              <div><strong>Honors:</strong> A = 5.5 (+0.5 Boost)</div>
              <div><strong>AP/IB:</strong> A = 6.0 (+1.0 Boost)</div>
            </div>
          </div>
        </div>

        {/* 100-Point Unweighted */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-amber-50 text-amber-900 rounded-xl shrink-0 mt-1">
            <Percent size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">100-Point (% Numeric Average)</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Instead of converting your grades to 4.0 scale points, your GPA is calculated purely as the average of your exact numeric percentages (e.g. 95%, 88%). The difficulty of the courses is <strong>not</strong> factored into the final numeric average.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs font-mono text-slate-700">
              <strong>Example:</strong> Average of 90% and 80% = 85.0 GPA
            </div>
          </div>
        </div>

        {/* 100-Point Weighted */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-amber-50 text-amber-900 rounded-xl shrink-0 mt-1">
            <Percent size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">100-Point (% Weighted Numeric)</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Calculates your GPA using exact numeric percentages, but adds a flat point bonus directly to the percentage grade for advanced courses before averaging.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 text-xs font-mono text-slate-700">
              <div><strong>Regular:</strong> Grade = 90% (No Boost)</div>
              <div><strong>Honors:</strong> Grade = 90% + 5 = 95% (+5 point Boost)</div>
              <div><strong>AP/IB:</strong> Grade = 90% + 10 = 100% (+10 point Boost)</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GradingGuide;

