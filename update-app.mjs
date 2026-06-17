import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// Add imports
content = content.replace(
  /import \{ Plus, Settings, Calculator/,
  "import { initAuth, googleSignIn, logout, getAccessToken } from './firebase';\nimport { User } from 'firebase/auth';\nimport { LogOut, LogIn } from 'lucide-react';\nimport { Plus, Settings, Calculator"
);

// Add auth state
content = content.replace(
  /const \[activeView, setActiveView\] = useState<ViewType>\('calculator'\);/,
  "const [activeView, setActiveView] = useState<ViewType>('calculator');\n  const [user, setUser] = useState<User | null>(null);\n  const [token, setToken] = useState<string | null>(null);"
);

// Add init effect
content = content.replace(
  /useEffect\(\(\) => \{\n    const savedHistory = localStorage.getItem/,
  "useEffect(() => {\n    initAuth((u, t) => {\n      setUser(u);\n      setToken(t);\n    }, () => {\n      setUser(null);\n      setToken(null);\n    });\n\n    const savedHistory = localStorage.getItem"
);

// Add header button
content = content.replace(
  /<button onClick=\{\(\) => setIsSettingsOpen\(true\)\} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">\n              <Settings size=\{22\} \/>\n            <\/button>/,
  "<button onClick={() => setIsSettingsOpen(true)} className=\"p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors\">\n              <Settings size={22} />\n            </button>\n            {user ? (\n              <button onClick={logout} className=\"flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors\" title=\"Sign out\">\n                <LogOut size={22} />\n              </button>\n            ) : (\n              <button onClick={googleSignIn} className=\"flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-900 font-semibold hover:bg-blue-200 rounded-full transition-colors\" title=\"Sign in with Google\">\n                <LogIn size={18} />\n                <span className=\"hidden sm:inline text-xs\">Sign In</span>\n              </button>\n            )}"
);

fs.writeFileSync('App.tsx', content, 'utf8');
