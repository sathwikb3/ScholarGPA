import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Timer, CheckCircle, Coffee, Code, Check } from 'lucide-react';
import { Course } from '../types';

interface PomodoroTimerProps {
  courses: Course[];
  onLogTime: (courseId: string, seconds: number) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ courses, onLogTime }) => {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (!isBreak) {
        if (selectedCourseId) {
          onLogTime(selectedCourseId, WORK_TIME);
        }
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
      } else {
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
        setIsActive(false);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, selectedCourseId, onLogTime]);

  const toggleTimer = () => {
    if (!selectedCourseId && !isBreak) {
      alert("Please select a course to study for first.");
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm mx-auto">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Timer size={24} className="text-blue-900" />
        <h2 className="text-xl font-semibold text-slate-800">Study Session</h2>
      </div>

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Select Course to Log Time</label>
        <select 
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-700 bg-slate-50 font-medium"
        >
          <option value="" disabled>Select a course...</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name || 'Untitled Course'}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-2xl mb-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          {isBreak ? <><Coffee size={16} /> Break Time</> : <><Code size={16} /> Focus Time</>}
        </h3>
        <div className="text-5xl font-mono text-slate-800 font-bold tracking-tight">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={toggleTimer}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-blue-900 text-white hover:bg-blue-950 shadow-md'}`}
        >
          {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> {timeLeft < (isBreak ? BREAK_TIME : WORK_TIME) ? 'Resume' : 'Start'}</>}
        </button>
        <button 
          onClick={resetTimer}
          className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      
      {!isBreak && !isActive && timeLeft < WORK_TIME && (
        <button onClick={() => {
           if (selectedCourseId) {
             onLogTime(selectedCourseId, WORK_TIME - timeLeft);
             resetTimer();
           }
        }} className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-blue-800 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 font-semibold transition-colors">
          <Check size={14} /> Finish early & log time
        </button>
      )}
    </div>
  );
};

export default PomodoroTimer;
