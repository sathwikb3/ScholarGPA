
import { Course, GPASettings, CalculationResult, Assignment } from '../types';

export const analyzeGrades = async (
  courses: Course[], 
  results: CalculationResult, 
  settings: GPASettings,
  assignments?: Assignment[]
): Promise<string> => {
  try {
    const res = await fetch("/api/analyze-grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courses, results, settings, assignments }),
    });
    const data = await res.json();
    return data.text || "Insight currently unavailable. Please check your course data.";
  } catch (error) {
    return "The advisor is currently offline. Please try again in a few moments.";
  }
};

export interface ExtractedCourse {
  name: string;
  grade: number;
  type: string;
}

export const suggestColleges = async (
  gpa: number,
  settings: GPASettings
): Promise<string> => {
  try {
    const res = await fetch("/api/suggest-colleges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gpa, settings }),
    });
    const data = await res.json();
    return data.text || "Unable to generate college suggestions.";
  } catch (error) {
    throw new Error("College suggestion failed.");
  }
};

export const parseGradesFromText = async (rawText: string): Promise<ExtractedCourse[]> => {
  const prompt = `
    Extract courses and percentage grades from this student portal snippet.
    Classify Level: "AP", "Honors", "Dual Enrollment", "Regular".
    
    Text: ${rawText}
  `;

  try {
    const res = await fetch("/api/parse-grades-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return JSON.parse(data.result || "[]");
  } catch (error) {
    throw new Error("Parse error.");
  }
};

export const parseGradesFromImage = async (base64Image: string, mimeType: string): Promise<ExtractedCourse[]> => {
  const prompt = `
    Extract grades from the report card image.
    1. Only numeric percentage for "grade" (e.g. 94).
    2. Course name from the first column.
    3. Determine type: AP/Honors/Regular/Dual Enrollment/IB.
  `;

  try {
    const res = await fetch("/api/parse-grades-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, mimeType, prompt }),
    });
    const data = await res.json();
    return JSON.parse(data.result || "[]");
  } catch (error) {
    throw new Error("Processing error.");
  }
};

export const parseAssignmentsFromImage = async (base64Image: string, mimeType: string): Promise<Partial<Assignment>[]> => {
  const prompt = `
    Extract a list of assignments or grading categories from the image. 
    For each item, identify:
    1. The name of the assignment or category (e.g., "Homework 1", "Quizzes").
    2. The score achieved as a percentage (0-100). If only points are listed (e.g., 45/50), calculate the percentage.
    3. The weight of that assignment or category (0-100).
    
    If data is missing for an item, provide reasonable defaults (Score: 100, Weight: 10).
  `;

  try {
    const res = await fetch("/api/parse-assignments-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, mimeType, prompt }),
    });
    const data = await res.json();
    return JSON.parse(data.result || "[]");
  } catch (error) {
    throw new Error("Assignment extraction error.");
  }
};

export const parseAssignmentsFromText = async (rawText: string): Promise<Partial<Assignment>[]> => {
  const prompt = `
    Extract assignments or grading categories from this text.
    Classify each by:
    1. Name (e.g. "Final Project")
    2. Score (0-100 percentage)
    3. Weight (Percentage of total grade)
    
    Text: ${rawText}
  `;

  try {
    const res = await fetch("/api/parse-assignments-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return JSON.parse(data.result || "[]");
  } catch (error) {
    throw new Error("Assignment text parse error.");
  }
};
