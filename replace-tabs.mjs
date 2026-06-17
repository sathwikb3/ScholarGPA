import fs from 'fs';

// GRADE CALCULATOR TAB (Sage Green)
const gradeFiles = ['components/GradeCalculator.tsx', 'components/GradeSummary.tsx', 'components/GradeConverter.tsx'];

const sageReplacements = {
  'blue-950': 'emerald-950',
  'blue-900': 'emerald-800',
  'blue-800': 'emerald-700',
  'blue-700': 'emerald-600',
  'blue-600': 'emerald-500',
  'blue-300': 'emerald-300',
  'blue-100': 'emerald-100',
  'blue-50': 'emerald-50',
  'text-blue-900': 'text-[#196e1f]',
  'bg-blue-900': 'bg-[#196e1f]',
  'border-blue-300': 'border-[#196e1f]/30',
};

gradeFiles.forEach(file => {
  if(fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/blue-950/g, 'emerald-950');
    content = content.replace(/blue-900/g, 'emerald-800');
    content = content.replace(/blue-800/g, 'emerald-700');
    content = content.replace(/blue-700/g, 'emerald-600');
    content = content.replace(/blue-600/g, 'emerald-500');
    content = content.replace(/blue-300/g, 'emerald-300');
    content = content.replace(/blue-100/g, 'emerald-100');
    content = content.replace(/blue-50/g, 'emerald-50');
    content = content.replace(/text-emerald-800/g, 'text-[#196e1f]');
    content = content.replace(/bg-emerald-800/g, 'bg-[#196e1f]');
    fs.writeFileSync(file, content, 'utf8');
  }
});

// GRADING GUIDE TAB (Burgundy)
const guideFiles = ['components/GradingGuide.tsx'];
guideFiles.forEach(file => {
  if(fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/blue-950/g, 'rose-950');
    content = content.replace(/blue-900/g, 'rose-900');
    content = content.replace(/blue-800/g, 'rose-800');
    content = content.replace(/blue-700/g, 'rose-700');
    content = content.replace(/blue-600/g, 'rose-600');
    content = content.replace(/blue-300/g, 'rose-300');
    content = content.replace(/blue-100/g, 'rose-100');
    content = content.replace(/blue-50/g, 'rose-50');
    fs.writeFileSync(file, content, 'utf8');
  }
});

// APP.TSX Tabs
let appContent = fs.readFileSync('App.tsx', 'utf8');

// The active states in App.tsx
// Grading Calc: activeView === 'grade' ? 'bg-blue-900 shadow-blue-300'
appContent = appContent.replace(
  /activeView === 'grade' \? 'bg-blue-900 shadow-blue-300'/g, 
  "activeView === 'grade' ? 'bg-[#196e1f] shadow-emerald-300'"
);
appContent = appContent.replace(
  /activeView === 'grade' \? 'bg-white text-blue-900 shadow-sm font-semibold'/g, 
  "activeView === 'grade' ? 'bg-white text-[#196e1f] shadow-sm font-semibold'"
);

// Grading Guide active state: currently 'bg-blue-900 shadow-blue-300' in the fallback (since it was just blue-900 for both before possibly)
appContent = appContent.replace(
  /: 'bg-blue-900 shadow-blue-300'}/g, 
  ": activeView === 'guide' ? 'bg-rose-900 shadow-rose-300' : 'bg-blue-900 shadow-blue-300'}"
);
appContent = appContent.replace(
  /activeView === 'guide' \? 'bg-white text-blue-900 shadow-sm font-semibold'/g, 
  "activeView === 'guide' ? 'bg-white text-rose-900 shadow-sm font-semibold'"
);

fs.writeFileSync('App.tsx', appContent, 'utf8');

