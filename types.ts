
export enum CourseType {
  Regular = 'Regular',
  Honors = 'Honors',
  AP = 'AP',
  IB = 'IB',
  DualEnrollment = 'Dual Enrollment'
}

export interface Course {
  id: string;
  name: string;
  gradePercent: number; // Numeric grade only (e.g. 95)
  type: CourseType;
  credits: number;
}

export interface Assignment {
  id: string;
  name: string;
  score: number;
  weight: number;
}

export interface CalculationResult {
  unweightedGPA: number;
  weightedGPA: number;
  cumulativeWeightedGPA: number;
  cumulativeUnweightedGPA: number;
}

export interface GPASettings {
  weights: {
    [key in CourseType]: number;
  };
  startingCumulativeWeighted: number;
  startingCumulativeUnweighted: number;
  previousCredits: number;
  targetGPA: number;
  school: string;
  city: string;
  gradeLevel: number;
  classSize: number;
  intendedMajor?: string;
  dreamSchools?: string[];
  satScore?: number;
  actScore?: number;
  extracurriculars?: string[];
  additionalComments?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  label: string;
  semester?: string;
  year?: string;
  unweightedGPA: number;
  weightedGPA: number;
  credits?: number;
  isPastSemester?: boolean;
}
