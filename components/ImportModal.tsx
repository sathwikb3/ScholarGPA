
import React, { useState } from 'react';
import { X, ClipboardPaste, Loader2, Info } from 'lucide-react';
import { parseGradesFromText, ExtractedCourse } from '../services/geminiService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (courses: ExtractedCourse[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const extracted = await parseGradesFromText(text);
      onImport(extracted);
      setText('');
      onClose();
    } catch (e) {
      alert("Failed to parse the text. Try copying a smaller or cleaner section from your portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
            <ClipboardPaste size={18} className="text-blue-900" />
            Import from Student Portal
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 flex gap-2 font-semibold">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>Paste the text from your student portal. Our AI will automatically extract course names and grades to average into your current standing.</p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your grades here..."
            className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm font-mono font-medium"
            disabled={loading}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !text.trim()}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-950 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Extracting...
                </>
              ) : (
                'Import Grades'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
