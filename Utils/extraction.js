import { GoogleGenAI } from "@google/genai";

const extractTextFromFiles = async (files, api_key) => {
  const ai = new GoogleGenAI({ apiKey: api_key });

  const fileParts = files.map((file) => ({
    inlineData: {
      data: file.buffer.toString("base64"),
      mimeType: file.mimetype,
    },
  }));

  const promptText = `
    Extract all text content from the provided files, in the order given.
    Preserve headings and section structure.
    Represent mathematical notation clearly (e.g. using LaTeX-style formatting).
    Respond ONLY with valid JSON in exactly this shape, with no extra commentary and no markdown code fences:

    {
      "sections": [
        { "heading": "string", "text": "string", "order": number }
      ]
    }
  `;

  const contents = [...fileParts, { text: promptText }];

  const response = await ai.model.generateContent({
    model: "gemini-2.5-flash",
    content: contents,
  });

  const rawText = response.text;

  let parsedData;
  try {
    parsedData = JSON.parse(rawText);
  } catch (error) {
    throw new Error(
      "Failed to parse JSON from AI response. Raw response: " + error.message,
    );
  }
  return parsedData;
};
