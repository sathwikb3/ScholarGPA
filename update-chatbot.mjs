import fs from 'fs';

let content = fs.readFileSync('components/AIChatBot.tsx', 'utf8');

// Update props
content = content.replace(
  /interface AIChatBotProps \{((?:.|\n)*?)\}/, 
  `interface AIChatBotProps {
  courses: Course[];
  result: CalculationResult;
  settings: GPASettings;
  activeView?: 'calculator' | 'grade' | 'admissions' | 'guide';
}`
);

content = content.replace(
  /const AIChatBot: React.FC<AIChatBotProps> = \(\{ courses, result, settings \}\) => \{/,
  "const AIChatBot: React.FC<AIChatBotProps> = ({ courses, result, settings, activeView = 'calculator' }) => {"
);

const colorHelper = `
  const getThemeVars = () => {
    switch(activeView) {
      case 'grade': return { bg: 'bg-[#196e1f]', shadow: 'shadow-emerald-300', lightBg: 'bg-emerald-50', lightText: 'text-[#196e1f]', ring: 'focus:ring-[#196e1f]', dot: 'bg-[#196e1f]' };
      case 'admissions': return { bg: 'bg-amber-500', shadow: 'shadow-amber-300', lightBg: 'bg-amber-50', lightText: 'text-amber-950', ring: 'focus:ring-amber-500', dot: 'bg-amber-500' };
      case 'guide': return { bg: 'bg-rose-900', shadow: 'shadow-rose-300', lightBg: 'bg-rose-50', lightText: 'text-rose-950', ring: 'focus:ring-rose-900', dot: 'bg-rose-700' };
      case 'calculator':
      default: return { bg: 'bg-blue-900', shadow: 'shadow-blue-300', lightBg: 'bg-blue-50', lightText: 'text-blue-950', ring: 'focus:ring-blue-800', dot: 'bg-blue-700' };
    }
  };
  const theme = getThemeVars();
`;

content = content.replace(
  /const \[isTyping, setIsTyping\] = useState\(false\);/,
  "const [isTyping, setIsTyping] = useState(false);\n" + colorHelper
);

content = content.replace(
  /className="bg-blue-900 p-4 text-white flex items-center justify-between shadow-lg"/,
  "className={`p-4 text-white flex items-center justify-between shadow-lg ${theme.bg}`}"
);

content = content.replace(
  /'bg-blue-900 text-white rounded-tr-none'/,
  "`${theme.bg} text-white rounded-tr-none`"
);

content = content.replace(
  /<div className="w-1 h-1 bg-blue-700 rounded-full animate-bounce"><\/div>/g,
  "<div className={`w-1 h-1 rounded-full animate-bounce ${theme.dot}`}></div>"
);
content = content.replace(
  /<div className="w-1 h-1 bg-blue-700 rounded-full animate-bounce delay-75"><\/div>/,
  "<div className={`w-1 h-1 rounded-full animate-bounce delay-75 ${theme.dot}`}></div>"
);
content = content.replace(
  /<div className="w-1 h-1 bg-blue-700 rounded-full animate-bounce delay-150"><\/div>/,
  "<div className={`w-1 h-1 rounded-full animate-bounce delay-150 ${theme.dot}`}></div>"
);

content = content.replace(
  /className="text-\[10px\] bg-blue-50 text-blue-950 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-bold"/g,
  "className={`text-[10px] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-bold ${theme.lightBg} ${theme.lightText}`}"
);

content = content.replace(
  /focus:ring-blue-800/,
  "${theme.ring}"
);

content = content.replace(
  /className="p-2 bg-blue-900 text-white rounded-xl hover:bg-blue-950 disabled:opacity-50 transition-all shadow-md shadow-blue-300"/,
  "className={`p-2 text-white rounded-xl disabled:opacity-50 transition-all shadow-md ${theme.bg} ${theme.shadow} hover:opacity-90`}"
);

content = content.replace(
  /isOpen \? 'bg-slate-800 text-white scale-90' : 'bg-blue-900 text-white hover:scale-110 shadow-blue-300'/,
  "isOpen ? 'bg-slate-800 text-white scale-90' : `${theme.bg} text-white hover:scale-110 ${theme.shadow}`"
);

fs.writeFileSync('components/AIChatBot.tsx', content, 'utf8');

let appStr = fs.readFileSync('App.tsx', 'utf8');
appStr = appStr.replace(
  /<AIChatBot \s+courses=\{courses\} \s+result=\{calculationResult\} \s+settings=\{settings\} \s+\/>/m,
  `<AIChatBot 
        courses={courses} 
        result={calculationResult} 
        settings={settings} 
        activeView={activeView}
      />`
);
fs.writeFileSync('App.tsx', appStr, 'utf8');
