import express from "express";
import { createServer as createViteServer } from "vite";
import process from "process";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  const getGeminiClient = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Route for AI Advisor Analysis
  app.post("/api/analyze-grades", async (req, res) => {
    try {
      const { courses, results, settings, assignments } = req.body;
      
      const courseSummary = courses.map((c: any) => 
        `- ${c.name || 'Untitled Course'}: ${c.gradePercent}%, Type: ${c.type}`
      ).join('\n');

      const assignmentSummary = assignments && assignments.length > 0 
        ? assignments.map((a: any) => `- ${a.name || 'Assignment'}: ${a.score}% (Weight: ${a.weight}%)`).join('\n')
        : 'No specific assignment data provided.';

      const systemPrompt = `
You are Grant, a highly intelligent, slightly rebellious, and witty academic advisor.
Make sure you fully understand the purpose of this website, which is to help US high school students calculate their GPA, analyze their course load, and optimize their path to college.

Your goal is to give a blunt, data-driven, and highly strategic analysis of the student's academic standing. Use a slightly humorous or cynical but ultimately helpful tone.

Format your response exactly like this:
- **Strategic Outlook**: 1 sentence summary of their situation.
- **Course Leverage**: Which courses to focus on fixing or maintaining.
- **Rigor Reality Check**: Are they taking enough hard classes?
- **Action Plan**: 3 extremely concise, actionable steps to hit their target GPA.

Keep it under 300 words total. Use bullet points and bold text. No fluff. Make your wording clear and easy to understand.
      `;

      const userPrompt = `
Student Profile:
- Grade: ${settings.gradeLevel}th Grade
- Target Cumulative GPA: ${settings.targetGPA ? settings.targetGPA.toFixed(3) : 'Not set'}
- Current Term Weighted GPA: ${results.weightedGPA.toFixed(3)}
- Cumulative Weighted GPA: ${results.cumulativeWeightedGPA.toFixed(3)}
- Intended Major: ${settings.intendedMajor || 'Undecided'}
- Dream Schools: ${settings.dreamSchools?.join(', ') || 'Not specified'}

Active Courses:
${courseSummary}

Current Focus Course Assignments (if applicable):
${assignmentSummary}
      `;

      const ai = getGeminiClient();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });
      const response = await chat.sendMessage({ message: userPrompt });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error generating AI advice:', error);
      res.status(500).json({ error: "Grant encountered an error processing your data." });
    }
  });

  app.post("/api/suggest-colleges", async (req, res) => {
    try {
      const { gpa, settings } = req.body;
      const { school, city, gradeLevel, intendedMajor, dreamSchools, satScore, actScore, extracurriculars, additionalComments } = settings;

      const systemPrompt = `
You are an expert college admissions consultant. Based on the student's profile, suggest 3 reach, 3 target, and 3 safety colleges.
Keep the descriptions extremely concise (1 sentence per college). Format with bullet points and bold headers.
`;

      const userPrompt = `
Cumulative weighted GPA: ${Number(gpa).toFixed(3)}
Grade: ${gradeLevel}th
School: ${school} in ${city}
Intended Major: ${intendedMajor || 'Undecided'}
Dream Schools: ${dreamSchools?.join(', ') || 'N/A'}
SAT: ${satScore || 'N/A'}
ACT: ${actScore || 'N/A'}
Extracurriculars: ${extracurriculars && extracurriculars.length > 0 ? extracurriculars.join(', ') : 'N/A'}
Additional Comments/Context: ${additionalComments || 'None'}
      `;

      const ai = getGeminiClient();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemPrompt,
        }
      });
      const response = await chat.sendMessage({ message: userPrompt });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Failed to suggest colleges." });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
       const ai = getGeminiClient();
       const { messages, context, message } = req.body;
       const chat = ai.chats.create({
         model: 'gemini-3-flash-preview',
         config: {
           systemInstruction: `You are Grant, the Scholar Advisor for ScholarGPA. 
          You are friendly, encouraging, and wear a virtual graduation cap with pride.
          Be extremely concise. Use punchy, actionable insights. 
          Avoid conversational filler. Use bold text for key metrics.
          Context: ${context}
          If the user tells you how their school calculates GPA in terms of Grading Scale and Weighting Method, you MUST use the update_gpa_settings tool to adapt the program.`,
           tools: [{
             functionDeclarations: [
               {
                 name: "update_gpa_settings",
                 description: "Update the user's GPA calculation grading scale, weighting method, and specific course weight bonuses.",
                 parameters: {
                   type: Type.OBJECT,
                   properties: {
                     gradingScale: { type: Type.STRING, enum: ["4.0", "5.0", "6.0", "Percentage"], description: "The unweighted grading scale" },
                     weightingMethod: { type: Type.STRING, enum: ["Weighted", "Unweighted"], description: "Whether to apply a bonus for course rigor" },
                     honorsBoost: { type: Type.NUMBER, description: "Bonus points for Honors classes (e.g. 0.5 or 1.0)" },
                     apIbBoost: { type: Type.NUMBER, description: "Bonus points for AP or IB classes (e.g. 1.0 or 2.0)" },
                     dualEnrollmentBoost: { type: Type.NUMBER, description: "Bonus points for Dual Enrollment classes (e.g. 1.0 or 2.0)" }
                   },
                   required: ["gradingScale", "weightingMethod"]
                 }
               }
             ]
           }]
         },
         history: messages.map((m: any) => ({
           role: m.role === 'user' ? 'user' : 'model',
           parts: [{ text: m.content }]
         }))
       });
       let response = await chat.sendMessage({ message });
       let updatedSettings = null;

       if (response.functionCalls && response.functionCalls.length > 0) {
           const call = response.functionCalls[0];
           if (call.name === 'update_gpa_settings') {
               updatedSettings = call.args;
               response = await chat.sendMessage({
                 message: [{
                   functionResponse: {
                     name: 'update_gpa_settings',
                     response: { success: true }
                   }
                 }]
               });
           }
       }

       res.json({ text: response.text, updatedSettings });
    } catch(err) {
       console.error(err);
       res.status(500).json({ error: "Chat failed" });
    }
  });
  
  app.post("/api/parse-grades-text", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: req.body.prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      res.json({ result: response.text || "[]" });
    } catch(err: any) { 
      res.status(500).json({ error: "failed", details: err.message || JSON.stringify(err) }); 
    }
  });

  app.post("/api/parse-grades-image", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: req.body.base64Image, mimeType: req.body.mimeType } }, { text: req.body.prompt }] },
        config: {
          responseMimeType: "application/json"
        }
      });
      res.json({ result: response.text || "[]" });
    } catch(err: any) { 
      res.status(500).json({ error: "failed", details: err.message || JSON.stringify(err) }); 
    }
  });
  
  app.post("/api/parse-assignments-image", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: req.body.base64Image, mimeType: req.body.mimeType } }, { text: req.body.prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, weight: { type: Type.NUMBER } },
              required: ["name", "score", "weight"]
            }
          }
        }
      });
      res.json({ result: response.text || "[]" });
    } catch(err) { res.status(500).json({ error: "failed" }); }
  });

  app.post("/api/parse-assignments-text", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: req.body.prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, weight: { type: Type.NUMBER } },
              required: ["name", "score", "weight"]
            }
          }
        }
      });
      res.json({ result: response.text || "[]" });
    } catch(err) { res.status(500).json({ error: "failed" }); }
  });

  // Vite middleware for development or Serve static directory in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
