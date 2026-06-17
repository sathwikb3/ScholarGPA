import fs from 'fs';

let content = fs.readFileSync('components/AIAdvisor.tsx', 'utf8');

content = content.replace(
  /interface AIAdvisorProps \{/,
  "interface AIAdvisorProps \{\n  variant?: 'emerald' | 'blue';"
);

content = content.replace(
  /const AIAdvisor: React.FC<AIAdvisorProps> = \(\{ courses, results, settings, assignments \}\) => \{/,
  "const AIAdvisor: React.FC<AIAdvisorProps> = ({ courses, results, settings, assignments, variant = 'blue' }) => {"
);

content = content.replace(
  /className="bg-gradient-to-r from-\[#0C380F\] to-\[#196e1f\] p-6 text-white"/,
  "className={`p-6 text-white ${variant === 'emerald' ? 'bg-gradient-to-r from-[#0C380F] to-[#196e1f]' : 'bg-gradient-to-r from-blue-950 to-blue-800'}`}"
);

content = content.replace(
  /<p className="text-emerald-50 text-xs">Personalized optimization path<\/p>/,
  "<p className={`${variant === 'emerald' ? 'text-emerald-50' : 'text-blue-50'} text-xs`}>Personalized optimization path</p>"
);

content = content.replace(
  /className="px-4 py-2 bg-white text-\[#196e1f\] rounded-xl text-sm shadow-lg shadow-emerald-900\/20 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"/,
  "className={`px-4 py-2 bg-white rounded-xl text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold ${variant === 'emerald' ? 'text-[#196e1f] shadow-emerald-900/20 hover:bg-emerald-50' : 'text-blue-900 shadow-blue-900/20 hover:bg-blue-50'}`}"
);

// Loading spinner borders
content = content.replace(
  /className="w-12 h-12 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin"/,
  "className={`w-12 h-12 border-4 rounded-full animate-spin ${variant === 'emerald' ? 'border-emerald-100 border-t-emerald-800' : 'border-blue-100 border-t-blue-900'}`}"
);

content = content.replace(
  /className="absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 text-blue-900"/,
  "className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${variant === 'emerald' ? 'text-emerald-800' : 'text-blue-900'}`}"
);

content = content.replace(
  /className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-900"/,
  "className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === 'emerald' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-900'}`}"
);

content = content.replace(
  /className="text-xs text-blue-900 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-lg transition-colors font-semibold"/,
  "className={`text-xs px-3 py-1 rounded-lg transition-colors font-semibold ${variant === 'emerald' ? 'text-emerald-800 hover:text-emerald-900 bg-emerald-50' : 'text-blue-900 hover:text-blue-800 bg-blue-50'}`}"
);

fs.writeFileSync('components/AIAdvisor.tsx', content, 'utf8');

// Now update App.tsx to pass variant="emerald" for the grade view
let appContent = fs.readFileSync('App.tsx', 'utf8');

appContent = appContent.replace(
  /<GradeCalculator([\s\S]*?)<AIAdvisor courses=\{courses\} results=\{calculationResult\} settings=\{settings\} assignments=\{assignments\} \/>/,
  "<GradeCalculator$1<AIAdvisor courses=\{courses\} results=\{calculationResult\} settings=\{settings\} assignments=\{assignments\} variant=\"emerald\" />"
);

fs.writeFileSync('App.tsx', appContent, 'utf8');
