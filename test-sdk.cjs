async function test() {
  try {
    const ai = new (require('@google/genai').GoogleGenAI)({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-preview',
      contents: { parts: [{ text: "Extract course Name: Math, Grade: 94, Level: Honors" }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: require('@google/genai').Type.ARRAY,
          items: {
            type: require('@google/genai').Type.OBJECT,
            properties: { 
              courseName: { type: require('@google/genai').Type.STRING }, 
              grade: { type: require('@google/genai').Type.NUMBER }, 
              level: { type: require('@google/genai').Type.STRING }, 
              credits: { type: require('@google/genai').Type.NUMBER } 
            },
            required: ["courseName", "grade", "level"]
          }
        }
      }
    });
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}
test();
