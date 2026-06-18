
import { CourseType, GPASettings, GradingScale, WeightingMethod } from './types';

export const DEFAULT_SETTINGS: GPASettings = {
  gradingScale: GradingScale.FourPoint,
  weightingMethod: WeightingMethod.Weighted,
  weights: {
    [CourseType.Regular]: 5.0,
    [CourseType.Honors]: 5.5,
    [CourseType.AP]: 6.0,
    [CourseType.IB]: 6.0,
    [CourseType.DualEnrollment]: 6.0,
  },
  startingCumulativeWeighted: 0,
  startingCumulativeUnweighted: 0,
  previousCredits: 0,
  targetGPA: 4.0,
  school: '',
  city: '',
  gradeLevel: 9,
  classSize: 400,
  intendedMajor: '',
  dreamSchools: [],
  satScore: undefined,
  actScore: undefined,
};
