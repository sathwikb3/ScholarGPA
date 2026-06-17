import fs from 'fs';

let content = fs.readFileSync('components/AdmissionsProfileTab.tsx', 'utf8');

// We want to avoid replacing the trash icon red colors if possible, but let's see. 
// The trash icon in AdmissionsProfileTab:
// text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-200

content = content.replace(/bg-red-50/g, 'bg-amber-50');
content = content.replace(/text-red-800/g, 'text-amber-600');
content = content.replace(/focus:ring-red-700/g, 'focus:ring-amber-500');
content = content.replace(/hover:text-red-900/g, 'hover:text-amber-700');
content = content.replace(/bg-red-800/g, 'bg-amber-600');
content = content.replace(/hover:bg-red-900/g, 'hover:bg-amber-700');
content = content.replace(/shadow-red-300/g, 'shadow-amber-300');
content = content.replace(/border-red-100/g, 'border-amber-100');

// Fix the trash icon back to red if it was changed
content = content.replace(/hover:text-amber-500/g, 'hover:text-red-500');
content = content.replace(/hover:border-amber-200/g, 'hover:border-red-200');

fs.writeFileSync('components/AdmissionsProfileTab.tsx', content, 'utf8');

let appContent = fs.readFileSync('App.tsx', 'utf8');
appContent = appContent.replace(/activeView === 'admissions' \? 'bg-red-800 shadow-red-300'/g, 'activeView === \'admissions\' ? \'bg-amber-500 shadow-amber-300\'');
appContent = appContent.replace(/activeView === 'admissions' \? 'bg-white text-red-800 shadow-sm font-semibold'/g, 'activeView === \'admissions\' ? \'bg-white text-amber-600 shadow-sm font-semibold\'');
appContent = appContent.replace(/activeView === 'admissions' \? 'bg-red-700'/g, 'activeView === \'admissions\' ? \'bg-amber-500\'');
fs.writeFileSync('App.tsx', appContent, 'utf8');
