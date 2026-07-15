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
  //
  // Important: this must CONSUME valid escape sequences (e.g. \\, \n, \uXXXX)
  // as whole units. A lookahead-only regex would "peek" at the second
  // character of a valid pair (like \\) without consuming it, causing that
  // character to be re-evaluated on its own as a fresh backslash - which
  // corrupts already-valid escapes such as \\circ (-> \\\circ).
  return text.replace(
    /\\u[0-9a-fA-F]{4}|\\["\\/bfnrt]|\\/g,
    (match) => (match.length === 1 ? "\\\\" : match),
  );
}