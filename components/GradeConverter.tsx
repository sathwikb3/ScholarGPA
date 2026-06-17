import React, { useState } from 'react';
import { ArrowRightLeft, Percent, Type } from 'lucide-react';

const GradeConverter: React.FC = () => {
  const [numInput, setNumInput] = useState<string>('');
  const [letterInput, setLetterInput] = useState<string>('A');

  // Conversion logic
  const convertNumToLetter = (num: number) => {
    if (isNaN(num)) return { letter: '-', gpa: '-' };
    if (num >= 97) return { letter: 'A+', gpa: '4.0' };
    if (num >= 93) return { letter: 'A', gpa: '4.0' };
    if (num >= 90) return { letter: 'A-', gpa: '3.7' };
    if (num >= 87) return { letter: 'B+', gpa: '3.3' };
    if (num >= 83) return { letter: 'B', gpa: '3.0' };
    if (num >= 80) return { letter: 'B-', gpa: '2.7' };
    if (num >= 77) return { letter: 'C+', gpa: '2.3' };
    if (num >= 73) return { letter: 'C', gpa: '2.0' };
    if (num >= 70) return { letter: 'C-', gpa: '1.7' };
    if (num >= 67) return { letter: 'D+', gpa: '1.3' };
    if (num >= 63) return { letter: 'D', gpa: '1.0' };
    if (num >= 60) return { letter: 'D-', gpa: '0.7' };
    return { letter: 'F', gpa: '0.0' };
  };

  const convertLetterToNum = (letter: string) => {
    const l = letter.toUpperCase();
    if (l === 'A+') return { gpa: '4.0', range: '97-100%' };
    if (l === 'A') return { gpa: '4.0', range: '93-96%' };
    if (l === 'A-') return { gpa: '3.7', range: '90-92%' };
    if (l === 'B+') return { gpa: '3.3', range: '87-89%' };
    if (l === 'B') return { gpa: '3.0', range: '83-86%' };
    if (l === 'B-') return { gpa: '2.7', range: '80-82%' };
    if (l === 'C+') return { gpa: '2.3', range: '77-79%' };
    if (l === 'C') return { gpa: '2.0', range: '73-76%' };
    if (l === 'C-') return { gpa: '1.7', range: '70-72%' };
    if (l === 'D+') return { gpa: '1.3', range: '67-69%' };
    if (l === 'D') return { gpa: '1.0', range: '63-66%' };
    if (l === 'D-') return { gpa: '0.7', range: '60-62%' };
    if (l === 'F') return { gpa: '0.0', range: '0-59%' };
    return { gpa: '-', range: '-' };
  };

  const numResult = convertNumToLetter(parseFloat(numInput));
  const letterResult = convertLetterToNum(letterInput);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-8">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <ArrowRightLeft size={16} className="text-[#196e1f]" />
        <h3 className="font-bold text-slate-800 text-sm">Quick Grade Converter</h3>
      </div>
      
      <div className="p-5 space-y-6">
        {/* Number to Letter */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
            <Percent size={12} className="text-emerald-700" /> Percentage to Letter
          </label>
          <div className="flex gap-4 items-center">
            <div className="relative w-24">
              <input 
                type="number"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder="e.g. 85"
                min="0"
                max="100"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-emerald-700 outline-none font-bold text-center"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</div>
            </div>
            
            <ArrowRightLeft size={16} className="text-slate-300 flex-shrink-0" />
            
            <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100 flex justify-around items-center">
              <div className="text-center">
                <div className={`text-xl font-bold ${numResult.letter.includes('A') ? 'text-amber-600' : numResult.letter.includes('B') ? 'text-emerald-500' : numResult.letter.includes('C') ? 'text-yellow-600' : numResult.letter.includes('D') ? 'text-red-800' : numResult.letter === 'F' ? 'text-red-600' : 'text-slate-300'}`}>
                  {numResult.letter}
                </div>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{numResult.gpa}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Letter to Number/GPA */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
            <Type size={12} className="text-emerald-700" /> Letter to GPA
          </label>
          <div className="flex gap-4 items-center">
            <div className="w-24">
              <select
                value={letterInput}
                onChange={(e) => setLetterInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-emerald-700 outline-none font-bold text-center appearance-none text-xl"
              >
                {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].map(letter => (
                  <option key={letter} value={letter}>{letter}</option>
                ))}
              </select>
            </div>

            <ArrowRightLeft size={16} className="text-slate-300 flex-shrink-0" />

            <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100 flex justify-around items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{letterResult.gpa}</div>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-sm font-bold text-slate-500">{letterResult.range}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeConverter;
