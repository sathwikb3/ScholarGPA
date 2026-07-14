
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
    Analyze the provided high school transcript or report card image and extract the grades. You MUST return EXACTLY a JSON array of objects representing courses. 
    Each object MUST strictly follow this schema: 
    { 
      "name": "string", 
      "grade": number, 
      "type": "string" 
    }
    
    Rules for extraction:
    1. "grade": Extract the numeric percentage grade as a NUMBER (e.g., 94). DO NOT return letter grades or strings. If only a fraction is given (e.g., 45/50), compute it to a percentage out of 100.
    2. "name": Extract the clear name of the course (e.g., "Biology", "World History").
    3. "type": Determine the course level strictly as one of the following exact string values: "AP", "Honors", "Dual Enrollment", "IB", or "Regular".
       Logic for mapping courses to levels:
       - If course name contains "AP" or "Adv Placement", use "AP".
       - If course name contains "Dual", "DC", or "Dual Credit", use "Dual Enrollment".
       - If course name contains "Honors", "Pre-AP", "PreAP", or "Adv", use "Honors".
       - If course name contains "IB", use "IB".
       - Otherwise, if no specific designation is found, use "Regular".
  `;

  try {
    const res = await fetch("/api/parse-grades-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, mimeType, prompt }),
    });
    
    if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    let rawResult = data.result || "[]";
    
    if (rawResult.startsWith("\`\`\`")) {
      rawResult = rawResult.replace(/^\`\`\`(?:json)?\n?/i, "").replace(/\n?\`\`\`$/i, "").trim();
    }
    
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawResult);
    } catch (parseError) {
      console.error("JSON parsing error on raw result:", rawResult, parseError);
      throw new Error("Failed to parse the response as JSON.");
    }

    if (!Array.isArray(parsedData)) {
      console.error("Parsed data is not an array:", parsedData);
      throw new Error("API did not return a JSON array as expected.");
    }

    const validTypes = ["AP", "Honors", "Dual Enrollment", "IB", "Regular"];
    const validatedData: ExtractedCourse[] = [];
    for (let i = 0; i < parsedData.length; i++) {
      const item = parsedData[i];
      if (
        item &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        typeof item.grade === "number" &&
        typeof item.type === "string" &&
        validTypes.includes(item.type)
      ) {
        validatedData.push({
          name: item.name.trim(),
          grade: item.grade,
          type: item.type
        });
      } else {
        console.warn(`Skipping invalid course object at index ${i}:`, item);
      }
    }

    if (validatedData.length === 0 && parsedData.length > 0) {
      throw new Error("No valid course structures found in the response.");
    }
    
    return validatedData;
  } catch (error: any) {
    console.error("Image parsing error:", error);
    throw new Error(error.message || "Failed to process the image. Please try again.");
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
