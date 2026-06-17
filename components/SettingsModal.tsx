
import React from 'react';
import { GPASettings } from '../types';
import { X, Settings } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GPASettings;
  onUpdate: (newSettings: GPASettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-medium">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg text-slate-800 flex items-center gap-2">
            <Settings size={18} className="text-slate-500" />
            Grading Reference
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-slate-700">
          <div>
            <h4 className="text-sm text-slate-900 uppercase tracking-wide mb-3">Weighted Scale Formulas</h4>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-blue-900">AP / Dual Credit / IB</p>
                <p className="text-xs mt-1">GPA = (Grade - 40) / 10</p>
                <p className="text-[10px] text-blue-700 mt-2">Example: 100% → 6.0 | 90% → 5.0 | 40% → 0.0</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-slate-900">Honors</p>
                <p className="text-xs mt-1">GPA = (Grade - 45) / 10</p>
                <p className="text-[10px] text-slate-500 mt-2">Example: 100% → 5.5 | 90% → 4.5 | 45% → 0.0</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-slate-900">Regular / On-Level</p>
                <p className="text-xs mt-1">GPA = (Grade - 50) / 10</p>
                <p className="text-[10px] text-slate-500 mt-2">Example: 100% → 5.0 | 90% → 4.0 | 50% → 0.0</p>
              </div>
            </div>
          </div>

          <div>
             <h4 className="text-sm text-slate-900 uppercase tracking-wide mb-3">Unweighted Scale</h4>
             <p className="text-xs mb-2">Based on standard US 4.0 tier conversion:</p>
             <ul className="text-xs space-y-1 bg-slate-50 p-3 rounded border border-slate-100">
                <li>90-100%: 4.0</li>
                <li>80-89%: 3.0</li>
                <li>70-79%: 2.0</li>
                <li>60-69%: 1.0</li>
                <li>Below 60%: 0.0</li>
             </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
