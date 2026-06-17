import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// Add import for sync hook
content = content.replace(
  /import \{ User \} from 'firebase\/auth';/,
  "import { User } from 'firebase/auth';\nimport { useFirestoreSync } from './services/useFirestoreSync';"
);

// Add importing the hook
content = content.replace(
  /const \[history, setHistory\] = useState<HistoryEntry\[\]>\(\[\]\);/,
  `const [history, setHistory] = useState<HistoryEntry[]>([]);

  const { isSyncing, lastSyncTime } = useFirestoreSync(
    user,
    { courses, assignments, history, settings },
    (remoteData) => {
      if (remoteData.courses) setCourses(remoteData.courses);
      if (remoteData.assignments) setAssignments(remoteData.assignments);
      if (remoteData.history) setHistory(remoteData.history);
      if (remoteData.settings) setSettings(remoteData.settings);
    }
  );`
);

// Add Cloud sync icon/indicator next to header buttons
const cloudIndicator = `
            {user && (
              <div className="flex flex-col text-[9px] text-right mr-2 justify-center hidden sm:flex text-slate-400">
                {isSyncing ? (
                  <span className="text-blue-500 animate-pulse">Syncing...</span>
                ) : lastSyncTime ? (
                  <span className="text-emerald-500">Cloud Sync On</span>
                ) : null}
                {user.email?.split('@')[0]}
              </div>
            )}`;

content = content.replace(
  /<button onClick=\{\(\) => setIsHistoryOpen\(true\)\}/,
  cloudIndicator + "\n            <button onClick={() => setIsHistoryOpen(true)}"
);

fs.writeFileSync('App.tsx', content, 'utf8');
