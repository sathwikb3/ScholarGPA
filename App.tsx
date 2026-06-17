
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Course, CourseType, GPASettings, CalculationResult, HistoryEntry, Assignment } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { parseGradesFromImage, ExtractedCourse } from './services/geminiService';
import CourseRow from './components/CourseRow';
import GpaSummary from './components/GpaSummary';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import ImportModal from './components/ImportModal';
import SaveSnapshotModal from './components/SaveSnapshotModal';
import AddPastGpaModal from './components/AddPastGpaModal';
import AIAdvisor from './components/AIAdvisor';
import GradeCalculator from './components/GradeCalculator';
import GradeSummary from './components/GradeSummary';
import AIChatBot from './components/AIChatBot';
import GradeConverter from './components/GradeConverter';
import GradingGuide from './components/GradingGuide';
import TrendChart from './components/TrendChart';
import AdmissionsProfileTab from './components/AdmissionsProfileTab';
import { initAuth, googleSignIn, logout, getAccessToken } from './firebase';
import { User } from 'firebase/auth';
import { exportGpaReportAsPdf } from './services/pdfExportService';
import { useFirestoreSync } from './services/useFirestoreSync';
import { 
  Plus, Settings, Calculator, BookOpen, GraduationCap, 
  Camera, Loader2, History, ClipboardPaste, RotateCcw, 
  FileSpreadsheet, Target, School, User as UserIcon, MapPin, Trophy,
  ListTodo, Info, Sparkles, ArrowRightLeft, LogOut, LogIn, Download
} from 'lucide-react';

type ViewType = 'calculator' | 'grade' | 'admissions' | 'guide';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('calculator');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    { id: uuidv4(), name: 'English III', gradePercent: 95, type: CourseType.Regular, credits: 1 },
    { id: uuidv4(), name: 'AP Statistics', gradePercent: 88, type: CourseType.AP, credits: 1 },
    { id: uuidv4(), name: 'Weightlifting', gradePercent: 100, type: CourseType.Regular, credits: 0.5 },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: uuidv4(), name: 'Homework 1', score: 95, weight: 10 },
    { id: uuidv4(), name: 'Midterm Exam', score: 88, weight: 40 },
  ]);

  const [settings, setSettings] = useState<GPASettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const { isSyncing, lastSyncTime } = useFirestoreSync(
    user,
    { courses, assignments, history, settings },
    (remoteData) => {
      if (remoteData.courses) setCourses(remoteData.courses);
      if (remoteData.assignments) setAssignments(remoteData.assignments);
      if (remoteData.history) setHistory(remoteData.history);
      if (remoteData.settings) setSettings(remoteData.settings);
    }
  );
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSaveSnapshotOpen, setIsSaveSnapshotOpen] = useState(false);
  const [isAddPastGpaOpen, setIsAddPastGpaOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const getTimestampFromSemesterYear = (semester: string, year: string) => {
    const [startYearStr, endYearStr] = year.split('-');
    const startYear = parseInt(startYearStr);
    const endYear = parseInt(endYearStr);
    
    let date;
    switch (semester) {
      case 'Fall': date = new Date(startYear, 8, 1); break; // Sept 1
      case 'Winter': date = new Date(endYear, 0, 1); break; // Jan 1
      case 'Spring': date = new Date(endYear, 4, 1); break; // May 1
      case 'Summer': date = new Date(endYear, 6, 1); break; // July 1
      default: date = new Date();
    }
    // Add a small random offset so multiple entries for the same semester don't overlap completely
    return date.getTime() + Math.floor(Math.random() * 10000);
  };

  useEffect(() => {
    const unsubscribe = initAuth((u, t) => {
      setUser(u);
      setToken(t);
    }, () => {
      setUser(null);
      setToken(null);
    });

    const savedHistory = localStorage.getItem('scholar_gpa_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    const savedSettings = localStorage.getItem('scholar_gpa_settings');
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('scholar_gpa_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('scholar_gpa_settings', JSON.stringify(settings));
  }, [settings]);

  const resizeImage = (file: File, maxWidth = 1000): Promise<{base64: string, mimeType: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: uuidv4(), name: '', gradePercent: 100, type: CourseType.Regular, credits: 1 }
    ]);
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const resetAll = () => {
    if(window.confirm("Clear all current term courses?")) {
        setCourses([]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCsvUpload = () => {
    csvInputRef.current?.click();
  };

  const handleExtracted = (extracted: ExtractedCourse[]) => {
     if (extracted && extracted.length > 0) {
         const newCourses: Course[] = extracted.map(c => ({
             id: uuidv4(),
             name: c.name,
             gradePercent: c.grade,
             type: mapScannedTypeToEnum(c.type),
             credits: 1
         }));
         setCourses(newCourses);
      }
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r?\n/);
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIdx = headers.findIndex(h => h.includes('course name') || h.includes('name'));
      const gradeIdx = headers.findIndex(h => h.includes('grade') || h.includes('%'));
      const typeIdx = headers.findIndex(h => h.includes('type') || h.includes('level'));
      const creditsIdx = headers.findIndex(h => h.includes('credit') || h.includes('hour') || h.includes('unit'));
      
      if (nameIdx === -1 || gradeIdx === -1 || typeIdx === -1) {
        alert("Invalid CSV format. Please ensure you have columns for 'Course Name', 'Grade (%)', and 'Course Type'.");
        return;
      }
      const importedCourses: Course[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',').map(c => c.trim());
        importedCourses.push({
          id: uuidv4(),
          name: cols[nameIdx] || 'Untitled Course',
          gradePercent: parseFloat(cols[gradeIdx]) || 0,
          type: mapScannedTypeToEnum(cols[typeIdx]),
          credits: creditsIdx !== -1 ? parseFloat(cols[creditsIdx]) || 1 : 1
        });
      }
      if (importedCourses.length > 0) {
        if (window.confirm(`Found ${importedCourses.length} courses in CSV. Replace current list?`)) {
          setCourses(importedCourses);
        }
      } else {
        alert("No courses found in the CSV file.");
      }
    };
    reader.readAsText(file);
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setIsScanning(true);
    try {
      const optimized = await resizeImage(file);
      const extracted = await parseGradesFromImage(optimized.base64, optimized.mimeType);
      handleExtracted(extracted);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image quickly. Please check the quality or try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const mapScannedTypeToEnum = (typeStr: string): CourseType => {
      const t = (typeStr || '').toLowerCase().trim();
      if (t.includes('ap') || t.includes('advanced')) return CourseType.AP;
      if (t.includes('dual') || t.includes('dc')) return CourseType.DualEnrollment;
      if (t.includes('honor') || t.includes('pre-ap') || t.includes('preap')) return CourseType.Honors;
      if (t.includes('ib')) return CourseType.IB;
      return CourseType.Regular;
  };

  const calculationResult: CalculationResult = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalUnweightedPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const grade = course.gradePercent;
        const credits = course.credits || 0;
        totalCredits += credits;

        let unweightedBase = 0;
        if (grade >= 90) unweightedBase = 4.0;
        else if (grade >= 80) unweightedBase = 3.0;
        else if (grade >= 70) unweightedBase = 2.0;
        else if (grade >= 60) unweightedBase = 1.0;
        totalUnweightedPoints += (unweightedBase * credits);

        let weightedBase = 0;
        if (course.type === CourseType.AP || course.type === CourseType.IB || course.type === CourseType.DualEnrollment) {
            weightedBase = (grade - 40) / 10;
        } else if (course.type === CourseType.Honors) {
            weightedBase = (grade - 45) / 10;
        } else {
            weightedBase = (grade - 50) / 10;
        }
        totalWeightedPoints += (Math.max(0, weightedBase) * credits);
    });

    const termWeightedGpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
    const termUnweightedGpa = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
    
    let cumulativeWeighted = termWeightedGpa;
    let cumulativeUnweighted = termUnweightedGpa;

    const pastSemesters = history.filter(h => h.isPastSemester);
    const pastWeightedPoints = pastSemesters.reduce((acc, h) => acc + (h.weightedGPA * (h.credits || 1)), 0);
    const pastUnweightedPoints = pastSemesters.reduce((acc, h) => acc + (h.unweightedGPA * (h.credits || 1)), 0);
    const prevCredits = pastSemesters.reduce((acc, h) => acc + (h.credits || 1), 0);

    const totalOverallCredits = prevCredits + totalCredits;

    if (totalOverallCredits > 0) {
        cumulativeWeighted = (pastWeightedPoints + totalWeightedPoints) / totalOverallCredits;
        cumulativeUnweighted = (pastUnweightedPoints + totalUnweightedPoints) / totalOverallCredits;
    }

    return {
      unweightedGPA: termUnweightedGpa,
      weightedGPA: termWeightedGpa,
      cumulativeWeightedGPA: cumulativeWeighted,
      cumulativeUnweightedGPA: cumulativeUnweighted,
    };
  }, [courses, history]);

  const openSaveSnapshotModal = () => {
    if (courses.length === 0) {
      alert("Please add some courses before saving a snapshot.");
      return;
    }
    setIsSaveSnapshotOpen(true);
  };

  const handleSaveSnapshot = (label: string, semester: string, year: string) => {
    setHistory(prev => [...prev, {
      id: uuidv4(),
      timestamp: getTimestampFromSemesterYear(semester, year),
      label: label,
      semester,
      year,
      unweightedGPA: calculationResult.cumulativeUnweightedGPA,
      weightedGPA: calculationResult.cumulativeWeightedGPA,
    }]);
  };

  const handleAddPastGpa = (label: string, semester: string, year: string, weighted: number, unweighted: number, credits: number) => {
    setHistory(prev => [...prev, {
      id: uuidv4(),
      timestamp: getTimestampFromSemesterYear(semester, year),
      label: label,
      semester,
      year,
      unweightedGPA: unweighted,
      weightedGPA: weighted,
      credits: credits,
      isPastSemester: true,
    }]);
    setIsAddPastGpaOpen(false);
  };

  const handlePushToGpa = (grade: number) => {
    const courseName = prompt("Which class is this grade for?", "My New Course");
    if (!courseName) return;
    
    setCourses(prev => [
      ...prev,
      { id: uuidv4(), name: courseName, gradePercent: grade, type: CourseType.Regular, credits: 1 }
    ]);
    setActiveView('calculator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-medium">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white shadow-lg transition-all duration-300 ${activeView === 'admissions' ? 'bg-amber-500 shadow-amber-300' : activeView === 'grade' ? 'bg-[#196e1f] shadow-emerald-300' : activeView === 'guide' ? 'bg-rose-900 shadow-rose-300' : 'bg-blue-900 shadow-blue-300'}`}>
                <GraduationCap size={24} />
            </div>
            <div className="hidden sm:block">
                <h1 className="text-xl text-slate-900 tracking-tight font-semibold">ScholarGPA</h1>
                <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em]">Academic Counselor</p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveView('calculator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeView === 'calculator' ? 'bg-white text-blue-900 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'}`}
            >
              <Calculator size={18} />
              <span className="hidden md:inline">GPA Calc</span>
            </button>
            <button 
              onClick={() => setActiveView('grade')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeView === 'grade' ? 'bg-white text-[#196e1f] shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'}`}
            >
              <ListTodo size={18} />
              <span className="hidden md:inline">Grade Calc</span>
            </button>
            <button 
              onClick={() => setActiveView('admissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeView === 'admissions' ? 'bg-white text-amber-600 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'}`}
            >
              <Trophy size={18} />
              <span className="hidden md:inline">Admissions Profile</span>
            </button>
            <button 
              onClick={() => setActiveView('guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeView === 'guide' ? 'bg-white text-rose-900 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'}`}
            >
              <BookOpen size={18} />
              <span className="hidden md:inline">Grading Guide</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            
            {user && (
              <div className="flex flex-col text-[9px] text-right mr-2 justify-center hidden sm:flex text-slate-400">
                {isSyncing ? (
                  <span className="text-blue-500 animate-pulse">Syncing...</span>
                ) : lastSyncTime ? (
                  <span className="text-emerald-500">Cloud Sync On</span>
                ) : null}
              </div>
            )}
            <button onClick={() => setIsHistoryOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                <History size={22} />
                {history.length > 0 && <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white ${activeView === 'admissions' ? 'bg-amber-500' : 'bg-blue-800'}`}></span>}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Settings size={22} />
            </button>
            {user ? (
              <div className="flex items-center gap-3 bg-slate-50 px-2 py-1 rounded-full border border-slate-200 ml-2">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=random`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-slate-200" 
                  title="Google Account Auth"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-700 leading-tight">{user.displayName || 'Student'}</span>
                  <span className="text-[10px] text-slate-500 leading-tight max-w-[120px] truncate" title="Password secured by Google">{user.email}</span>
                </div>
                <button onClick={logout} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" title="Sign out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={googleSignIn} className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-900 font-semibold hover:bg-blue-200 rounded-full transition-colors ml-2" title="Sign in with Google">
                <LogIn size={18} />
                <span className="hidden sm:inline text-xs">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {activeView === 'calculator' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow lg:w-2/3">
                <div className="bg-blue-900 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-800 rounded-full opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col">
                        <h2 className="text-lg flex items-center gap-2 font-semibold">
                            <Target size={20} className="text-white opacity-80" />
                            Goal & History
                        </h2>
                        <p className="text-[10px] text-blue-100 opacity-80 mt-1 uppercase tracking-wider">Set targets and log past semesters</p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-stretch md:items-center w-full md:w-auto">
                        <div className="flex items-center gap-3 bg-blue-950/50 px-4 py-3 rounded-xl border border-blue-800/50 backdrop-blur-sm">
                            <Target size={18} className="text-white/80" />
                            <div className="flex flex-col">
                                <label className="text-[9px] uppercase tracking-wider text-blue-300 font-bold mb-0.5">Target Cuml. GPA</label>
                                <input 
                                    type="number" step="0.001" value={settings.targetGPA || ''} 
                                    onChange={(e) => setSettings({...settings, targetGPA: parseFloat(e.target.value) || 0})}
                                    className="w-24 bg-transparent border-none p-0 text-white focus:ring-0 font-bold text-lg leading-tight"
                                    placeholder="4.00"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsAddPastGpaOpen(true)}
                            className="flex items-center justify-center gap-2 bg-white text-blue-950 hover:bg-blue-50 px-5 py-3 rounded-xl font-bold shadow-sm transition-all"
                        >
                            Log Past Semester
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-4">
                    <h2 className="text-lg text-slate-800 flex items-center gap-2 font-semibold">
                        <BookOpen size={20} className="text-blue-900" />
                        Current Term Grades
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => exportGpaReportAsPdf(courses, calculationResult, history, user?.email || user?.displayName || undefined)} className="text-[11px] text-blue-900 hover:text-blue-950 px-3 py-1.5 hover:bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors">
                            <Download size={14} /> Export PDF
                        </button>
                        <button onClick={() => setIsImportOpen(true)} className="text-[11px] text-blue-900 hover:text-blue-950 px-3 py-1.5 hover:bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors">
                            <ClipboardPaste size={14} /> Import Portal
                        </button>
                        <button onClick={triggerCsvUpload} className="text-[11px] text-blue-900 hover:text-blue-950 px-3 py-1.5 hover:bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-1.5 uppercase tracking-wide font-semibold transition-colors">
                            <FileSpreadsheet size={14} /> Import CSV
                        </button>
                        <input type="file" ref={csvInputRef} onChange={handleCsvImport} className="hidden" accept=".csv" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div 
                        className={`relative p-8 border-b border-slate-100 transition-all cursor-pointer ${isDragOver ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} 
                        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                        onClick={triggerFileUpload}
                    >
                        <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files?.[0]) processFile(e.target.files[0]); }} className="hidden" accept="image/*" />
                        <div className="flex flex-col items-center justify-center gap-4 py-2 text-center">
                            <div className={`p-4 rounded-full transition-transform duration-300 ${isScanning ? 'bg-blue-100 text-blue-900 animate-spin' : 'bg-slate-50 text-slate-400 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-800'}`}>
                                {isScanning ? <Loader2 size={32} /> : <Camera size={32} />}
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-semibold">Auto-fill via Screenshot</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Drop a report card image here or <button onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }} className="text-blue-900 hover:underline font-semibold">select file</button>.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-1 bg-slate-50/30">
                        {courses.length === 0 ? (
                            <div className="text-center py-12 text-slate-300">
                                <p className="text-sm italic">No courses added.</p>
                            </div>
                        ) : (
                            courses.map(course => (
                            <CourseRow key={course.id} course={course} onChange={updateCourse} onRemove={removeCourse} />
                            ))
                        )}
                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
                        <button onClick={addCourse} className="flex-grow py-3 border-2 border-dashed border-blue-300 text-blue-900 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-700 transition-all font-semibold">
                            <Plus size={20} /> Add New Grade
                        </button>
                        <button onClick={resetAll} className="ml-4 text-xs text-slate-400 hover:text-red-500 uppercase tracking-wider px-4 font-semibold">
                            Reset
                        </button>
                    </div>
                </div>

                <AIAdvisor courses={courses} results={calculationResult} settings={settings} assignments={assignments} />
                <div className="mt-8">
                    <TrendChart history={history} onViewHistory={() => setIsHistoryOpen(true)} onOpenAddPastGpa={() => setIsAddPastGpaOpen(true)} />
                </div>
              </div>

              <aside className="lg:w-1/3">
                <GpaSummary result={calculationResult} targetGPA={settings.targetGPA} onSaveSnapshot={openSaveSnapshotModal} />
                <GradeConverter />
              </aside>
            </div>
          </div>
        )}

        {activeView === 'grade' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow lg:w-2/3">
                <GradeCalculator 
                  assignments={assignments} 
                  onUpdate={setAssignments} 
                  onPushToGpa={handlePushToGpa}
                />
                <div className="mt-8">
                  <AIAdvisor courses={courses} results={calculationResult} settings={settings} assignments={assignments} variant="emerald" />
                </div>
              </div>
              <aside className="lg:w-1/3 space-y-6">
                <GradeSummary assignments={assignments} onPushToGpa={handlePushToGpa} />
                <GradeConverter />
              </aside>
            </div>
          </div>
        )}

        {activeView === 'admissions' && (
          <AdmissionsProfileTab 
            settings={settings}
            setSettings={setSettings}
            gpa={calculationResult.cumulativeWeightedGPA}
          />
        )}

        {activeView === 'guide' && (
          <GradingGuide />
        )}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onUpdate={setSettings} />
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onDelete={(id) => setHistory(h => h.filter(e => e.id !== id))} onOpenAddPastGpa={() => setIsAddPastGpaOpen(true)} />
      <SaveSnapshotModal isOpen={isSaveSnapshotOpen} onClose={() => setIsSaveSnapshotOpen(false)} onSave={handleSaveSnapshot} />
      <AddPastGpaModal isOpen={isAddPastGpaOpen} onClose={() => setIsAddPastGpaOpen(false)} onAdd={handleAddPastGpa} />
      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={handleExtracted} />
      
      {/* Persistent AI Chatbot */}
      <AIChatBot 
        courses={courses} 
        result={calculationResult} 
        settings={settings} 
        activeView={activeView}
      />
    </div>
  );
};

export default App;
