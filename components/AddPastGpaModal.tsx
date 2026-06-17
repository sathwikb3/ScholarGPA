import React, { useState } from 'react';
import { X, Plus, Calendar } from 'lucide-react';

interface AddPastGpaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string, semester: string, year: string, weighted: number, unweighted: number, credits: number) => void;
}

const AddPastGpaModal: React.FC<AddPastGpaModalProps> = ({ isOpen, onClose, onAdd }) => {
  const currentYear = new Date().getFullYear();
  const [semester, setSemester] = useState('Fall');
  const [year, setYear] = useState(`${currentYear - 1}-${currentYear}`);
  const [customLabel, setCustomLabel] = useState('');
  const [weighted, setWeighted] = useState('');
  const [unweighted, setUnweighted] = useState('');
  const [credits, setCredits] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    const w = parseFloat(weighted);
    const u = parseFloat(unweighted);
    const c = parseFloat(credits) || 1; // Default to 1 if empty
    if (isNaN(w) || isNaN(u)) {
      alert("Please enter valid GPA numbers.");
      return;
    }
    const finalLabel = customLabel.trim() || `${semester} ${year}`;
    onAdd(finalLabel, semester, year, w, u, c);
    setCustomLabel('');
    setWeighted('');
    setUnweighted('');
    setCredits('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-medium">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg text-slate-800 flex items-center gap-2 font-semibold">
            <Calendar size={20} className="text-blue-900" />
            Add Past GPA
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Semester</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
              >
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Year</label>
              <select 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
              >
                <option value={`${currentYear - 4}-${currentYear - 3}`}>{currentYear - 4}-{currentYear - 3}</option>
                <option value={`${currentYear - 3}-${currentYear - 2}`}>{currentYear - 3}-{currentYear - 2}</option>
                <option value={`${currentYear - 2}-${currentYear - 1}`}>{currentYear - 2}-{currentYear - 1}</option>
                <option value={`${currentYear - 1}-${currentYear}`}>{currentYear - 1}-{currentYear}</option>
                <option value={`${currentYear}-${currentYear + 1}`}>{currentYear}-{currentYear + 1}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Weighted GPA</label>
              <input 
                type="number"
                step="0.001"
                value={weighted}
                onChange={(e) => setWeighted(e.target.value)}
                placeholder="e.g. 4.2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Unweighted GPA</label>
              <input 
                type="number"
                step="0.001"
                value={unweighted}
                onChange={(e) => setUnweighted(e.target.value)}
                placeholder="e.g. 3.8"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Custom Label (Optional)</label>
              <input 
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder={`e.g. Freshman Year`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Credits (Optional)</label>
              <input 
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="e.g. 30 (Default: 1)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full mt-4 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-950 transition-colors shadow-lg shadow-blue-300 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add to History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPastGpaModal;
