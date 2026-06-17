
import React from 'react';
import { Course, CourseType } from '../types';
import { Trash2 } from 'lucide-react';

interface CourseRowProps {
  course: Course;
  onChange: (id: string, field: keyof Course, value: any) => void;
  onRemove: (id: string) => void;
}

const CourseRow: React.FC<CourseRowProps> = ({ course, onChange, onRemove }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm items-center transition-all hover:shadow-md mb-3 group">
      <div className="flex-grow w-full md:w-auto">
        <label className="block text-[10px] text-slate-400 mb-1 md:hidden uppercase tracking-wider">Course Name</label>
        <input
          type="text"
          value={course.name}
          onChange={(e) => onChange(course.id, 'name', e.target.value)}
          placeholder="e.g. English III"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm font-medium"
        />
      </div>

      <div className="w-full md:w-32">
        <label className="block text-[10px] text-slate-400 mb-1 md:hidden uppercase tracking-wider">Grade (%)</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="120"
            value={course.gradePercent}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
              onChange(course.id, 'gradePercent', val);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm font-medium text-slate-700"
            placeholder="0-100"
          />
          <span className="absolute right-3 top-2 text-slate-400 text-xs font-medium">%</span>
        </div>
      </div>

      <div className="w-full md:w-24">
        <label className="block text-[10px] text-slate-400 mb-1 md:hidden uppercase tracking-wider">Credits</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={course.credits}
          onChange={(e) => {
            const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
            onChange(course.id, 'credits', val);
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm font-medium text-slate-700"
          placeholder="Credits"
        />
      </div>

      <div className="w-full md:w-48">
        <label className="block text-[10px] text-slate-400 mb-1 md:hidden uppercase tracking-wider">Level</label>
         <div className="relative">
            <select
            value={course.type}
            onChange={(e) => onChange(course.id, 'type', e.target.value as CourseType)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm bg-white appearance-none pr-8 font-medium"
            >
            {Object.values(CourseType).map((t) => (
                <option key={t} value={t}>
                {t}
                </option>
            ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
        </div>
      </div>

      <div className="flex justify-end md:justify-center w-full md:w-auto mt-2 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onRemove(course.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          aria-label="Remove grade"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CourseRow;
