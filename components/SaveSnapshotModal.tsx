import React, { useState } from 'react';
import { X, BookmarkPlus } from 'lucide-react';

interface SaveSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: string, semester: string, year: string) => void;
}

const SaveSnapshotModal: React.FC<SaveSnapshotModalProps> = ({ isOpen, onClose, onSave }) => {
  const currentYear = new Date().getFullYear();
  const [semester, setSemester] = useState('Fall');
  const [year, setYear] = useState(`${currentYear}-${currentYear + 1}`);
  const [customLabel, setCustomLabel] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const finalLabel = customLabel.trim() || `${semester} ${year}`;
    onSave(finalLabel, semester, year);
    setCustomLabel('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-medium">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg text-slate-800 flex items-center gap-2 font-semibold">
            <BookmarkPlus size={20} className="text-blue-900" />
            Save GPA Snapshot
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Semester</label>
            <select 
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
            >
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Academic Year</label>
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
            >
              <option value={`${currentYear - 1}-${currentYear}`}>{currentYear - 1}-{currentYear}</option>
              <option value={`${currentYear}-${currentYear + 1}`}>{currentYear}-{currentYear + 1}</option>
              <option value={`${currentYear + 1}-${currentYear + 2}`}>{currentYear + 1}-{currentYear + 2}</option>
              <option value={`${currentYear + 2}-${currentYear + 3}`}>{currentYear + 2}-{currentYear + 3}</option>
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Custom Label (Optional)</label>
            <input 
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder={`e.g. ${semester} ${year} Midterms`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-800 outline-none text-sm font-medium"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full mt-4 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-950 transition-colors shadow-lg shadow-blue-300"
          >
            Save Snapshot
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSnapshotModal;
