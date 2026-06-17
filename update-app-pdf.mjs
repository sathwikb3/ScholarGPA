import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /import \{ User \} from 'firebase\/auth';/,
  "import { User } from 'firebase/auth';\nimport { exportGpaReportAsPdf } from './services/pdfExportService';"
);

content = content.replace(
  /ListTodo, Info, Sparkles, ArrowRightLeft, LogOut, LogIn/,
  "ListTodo, Info, Sparkles, ArrowRightLeft, LogOut, LogIn, Download"
);

content = content.replace(
  /<button onClick=\{\(\) => setIsImportOpen\(true\)\}/,
  `<button onClick={() => exportGpaReportAsPdf(courses, calculationResult, history, user?.email || user?.displayName || undefined)} className="text-[11px] text-blue-900 hover:text-blue-950 px-3 py-1.5 hover:bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors">
                            <Download size={14} /> Export PDF
                        </button>
                        <button onClick={() => setIsImportOpen(true)}`
);

fs.writeFileSync('App.tsx', content, 'utf8');
