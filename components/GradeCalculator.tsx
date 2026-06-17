
import React, { useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Assignment } from '../types';
import { 
  Plus, Trash2, ArrowRight, Info, Calculator, Percent, 
  Scale, Camera, Loader2, Target, TrendingUp, Sparkles,
  ClipboardList, AlertCircle, CheckCircle2, RefreshCcw, ExternalLink
} from 'lucide-react';
import { parseAssignmentsFromImage } from '../services/geminiService';

interface GradeCalculatorProps {
  assignments: Assignment[];
  onUpdate: (assignments: Assignment[]) => void;
  onPushToGpa: (grade: number) => void;
}

const GradeCalculator: React.FC<GradeCalculatorProps> = ({ assignments, onUpdate, onPushToGpa }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalWeight = 0;
    assignments.forEach(a => {
      totalWeightedPoints += (a.score * a.weight);
      totalWeight += a.weight;
    });

    const currentGrade = totalWeight > 0 ? totalWeightedPoints / totalWeight : 0;

    return {
      currentGrade,
      totalWeight,
    };
  }, [assignments]);

  const addAssignment = () => {
    onUpdate([
      ...assignments,
      { id: uuidv4(), name: '', score: 100, weight: 10 }
    ]);
  };

  const updateAssignment = (id: string, field: keyof Assignment, value: any) => {
    onUpdate(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAssignment = (id: string) => {
    onUpdate(assignments.filter(a => a.id !== id));
  };

  const clearAll = () => {
    if(window.confirm("Clear all assignments?")) onUpdate([]);
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setIsScanning(true);
    try {
      const optimized = await resizeImage(file);
      const extracted = await parseAssignmentsFromImage(optimized.base64, optimized.mimeType);
      if (extracted && extracted.length > 0) {
        const newAssignments = extracted.map(item => ({
          id: uuidv4(),
          name: item.name || 'New Category',
          score: item.score || 100,
          weight: item.weight || 10
        }));
        onUpdate([...assignments, ...newAssignments]);
      }
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Try a clearer photo.");
    } finally {
      setIsScanning(false);
    }
  };

  const resizeImage = (file: File, maxWidth = 1000): Promise<{base64: string, mimeType: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  return (
    <div className="font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Grid Header Actions */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-xl text-slate-800 flex items-center gap-2 font-semibold">
                <Calculator size={20} className="text-[#196e1f]" />
                Grade Calculator
              </h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Weighted grading system (Syllabus based)</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600"
              >
                <Camera size={14} /> {isScanning ? 'Scanning...' : 'Auto-Extract'}
              </button>
              <button 
                onClick={clearAll}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-500 font-semibold"
              >
                Clear All
              </button>
              <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files?.[0]) processFile(e.target.files[0]); }} className="hidden" accept="image/*" />
            </div>
          </div>

          {/* Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Assignment / Category</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold w-32">Grade (%)</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold w-32">Weight (%)</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList size={40} className="opacity-20 mb-2" />
                        <p className="text-sm">No items added. Start by adding a category or scanning a syllabus.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  assignments.map((a) => (
                    <tr key={a.id} className="group hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={a.name}
                          onChange={(e) => updateAssignment(a.id, 'name', e.target.value)}
                          placeholder="e.g. Midterm, Homework..."
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-800 placeholder-slate-300"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 group-hover:bg-white transition-colors">
                          <input
                            type="number"
                            value={a.score}
                            onChange={(e) => updateAssignment(a.id, 'score', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-slate-700 text-right"
                          />
                          <span className="text-slate-400 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 group-hover:bg-white transition-colors">
                          <input
                            type="number"
                            value={a.weight}
                            onChange={(e) => updateAssignment(a.id, 'weight', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-slate-700 text-right"
                          />
                          <span className="text-slate-400 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => removeAssignment(a.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Grid Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <button 
              onClick={addAssignment} 
              className="w-full md:w-auto px-6 py-2.5 bg-white border border-emerald-300 text-[#196e1f] rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-500 transition-all text-xs font-semibold shadow-sm"
            >
              <Plus size={16} /> Add New Row
            </button>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Weight Total:</span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${stats.totalWeight === 100 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-100 text-red-900 border border-red-200'}`}>
                  {stats.totalWeight}% 
                  {stats.totalWeight === 100 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Button - Bottom area */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onPushToGpa(stats.currentGrade)}
            className="group px-12 py-4 bg-[#196e1f] text-white rounded-2xl flex items-center gap-3 hover:bg-emerald-950 transition-all text-sm font-semibold shadow-xl shadow-emerald-300 tracking-wide"
          >
            Finalize & Transfer to GPA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
    </div>
  );
};

export default GradeCalculator;
