const { GoogleGenAI } = require("@google/genai");

exports.generateQuestions = async (contentText, requirements, api_key) => {
  const ai = new GoogleGenAI({ apiKey: api_key });

  const promptText = `
You are generating exam questions from the following academic content.

CONTENT:
${contentText}

REQUIREMENTS:
- MCQ count: ${requirements.mcqCount}
- Short answer count: ${requirements.shortCount}
- Long answer count: ${requirements.longCount}
- Language: ${requirements.language}
- Syllabus topics (if any): ${requirements.syllabus || "N/A - use entire content"}

Respond ONLY with valid JSON in exactly this shape, no extra text, no markdown fences:
{
  "mcq": [{ "question": "", "options": [], "answer": "", "marks": 0 }],
  "shortAnswer": [{ "question": "", "answer": "", "marks": 0 }],
  "longAnswer": [{ "question": "", "answer": "", "marks": 0 }],
  "coverageNotes": [{ "topic": "", "status": "covered" }]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ text: promptText }],
  });

  try {
    const rawText = response.text;
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Error parsing generated content:", error);
    throw error;
  }
};

