const { GoogleGenAI } =require("@google/genai");

exports.extractTextFromFiles = async (files, api_key) => {
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

  const contents = [{ role: "user", parts: [...fileParts, { text: promptText }] }];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      responseMimeType: "application/json",
    },
  });

  const rawText = stripCodeFences(response.text);

  console.log("Raw AI response:", rawText);

  let parsedData;
  try {
    parsedData = JSON.parse(fixBadEscapes(rawText));
  } catch (error) {
    throw new Error(
      "Failed to parse JSON from AI response. Raw response: " + rawText,
    );
  }
  return parsedData;
};

function stripCodeFences(text) {
  if (!text) return text;
  return text
    .trim()
    .replace(/^```[a-zA-Z]*\s*/, "")
    .replace(/```\s*$/, "")
    .trim();
}

function fixBadEscapes(text) {
  // Escapes any backslash that isn't part of a valid JSON escape sequence
  // (this happens when the model outputs raw LaTeX like \frac, \int, etc.)
  return text.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
}