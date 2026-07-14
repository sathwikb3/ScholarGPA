
import { CourseType, GPASettings } from './types';

export const DEFAULT_SETTINGS: GPASettings = {
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
  classRank: undefined,
  classSize: 400,
  phone: '(945)-233-7424',
  email: 'sathwikbavirisetty654@gmail.com',
  intendedMajor: '',
  dreamSchools: [],
  satScore: undefined,
  actScore: undefined,
};
