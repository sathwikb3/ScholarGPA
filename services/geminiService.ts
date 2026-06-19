
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
  courseName: string;
  grade: number;
  level: string;
  credits?: number;
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
    Analyze this text from a high school transcript and extract the courses using this exact schema:
    [{"courseName": "String", "grade": Number (0-100), "credits": Number, "level": "Regular" | "Honors" | "AP" | "IB" | "Dual Enrollment"}]

    Rules:
    1. Extract full academic title of the class.
    2. Grade must be a final percentage (e.g. 94). Prefer final or semester over progress or quarter.
    3. Extract credits (e.g. 0.5, 1.0). Default to 1.0 if not listed.
    4. Level rules:
       - Starts/contains "AP", "Advanced Placement", "‡" -> AP
       - Contains/ends "Honors", "Hon", "H", "*" -> Honors
       - "IB" or "International Baccalaureate" -> IB
       - "DE" or "Dual Enroll" -> Dual Enrollment
       - Otherwise -> Regular
    
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
    Analyze this report card image and extract the courses.
    Return using exactly this JSON array schema:
    [{"courseName": "String", "grade": Number (0-100), "credits": Number, "level": "Regular" | "Honors" | "AP" | "IB" | "Dual Enrollment"}]

    Rules:
    1. Extract full academic title of the class.
    2. Grade must be a final percentage. Look for the final/semester grade column (e.g., "Sem 1", "Final").
    3. Extract credits. Default to 1.0 if missing.
    4. Level rules:
       - Starts/contains "AP", "Advanced Placement", "‡" -> AP
       - Contains/ends "Honors", "Hon", "H", "*" -> Honors
       - "IB" or "International Baccalaureate" -> IB
       - "DE" or "Dual Enroll" -> Dual Enrollment
       - Otherwise -> Regular
  `;

  try {
    const res = await fetch("/api/parse-grades-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, mimeType, prompt }),
    });
    if (!res.ok) {
        throw new Error("Failed server response");
    }
    const data = await res.json();
    let resultJSON = data.result || "[]";
    // clean markdown blocks if any
    resultJSON = resultJSON.replace(/```json/g, "").replace(/```/g, "");
    const parsed = JSON.parse(resultJSON);
    if (!parsed || parsed.length === 0) {
      console.warn("Gemini returned empty array for image. Raw response:", data.result);
    }
    return parsed;
  } catch (error) {
    console.error("parseGradesFromImage Error:", error);
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
