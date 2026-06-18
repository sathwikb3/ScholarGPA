
export enum CourseType {
  Regular = 'Regular',
  Honors = 'Honors',
  AP = 'AP',
  IB = 'IB',
  DualEnrollment = 'Dual Enrollment'
}

export enum GradingScale {
  FourPoint = '4.0',
  FivePoint = '5.0',
  Percentage = 'Percentage'
}

export enum WeightingMethod {
  Weighted = 'Weighted',
  Unweighted = 'Unweighted'
}

export interface Course {
  id: string;
  name: string;
  gradePercent: number; // Numeric grade only (e.g. 95)
  gradeLetter?: string; // Letter grade e.g. A, B, C+, F
  type: CourseType;
  credits: number;
  studyTimeLogged?: number; // In seconds
  subject?: string;
  semester?: string;
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
  gradingScale?: GradingScale;
  weightingMethod?: WeightingMethod;
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
