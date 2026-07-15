// Registry of renderers — one function per question type.
// Each function receives ONE question object and returns the HTML
// that goes BELOW the number/text/marks row (options, blank space, etc.)
const questionTypeRenderers = {
  mcq: (question) => {
    if (!question.options || question.options.length === 0) return "";
    return `
      <div class="options">
        ${question.options
          .map((option, i) => `<span class="option">${String.fromCharCode(97 + i)}) ${option}</span>`)
          .join("")}
      </div>
    `;
  },

  fillInTheBlank: () => {
    // the blank (____) is expected to already be inside question.text
    return "";
  },

  shortAnswer: () => {
    return `<div class="answer-space answer-space-short"></div>`;
  },

  longAnswer: (question) => {
    const lineCount = Math.max(4, Math.min(question.marks || 5, 12));
    return `<div class="answer-space answer-space-long" style="height:${lineCount * 22}px;"></div>`;
  },

  // used when a type has no matching renderer above (safety net)
  default: () => "",
};

// Renders ONE full question block: number, text, marks, plus its type-specific body
const renderQuestion = (question, type) => {
  const renderer = questionTypeRenderers[type] || questionTypeRenderers.default;
  const bodyHTML = renderer(question);

  return `
    <div class="question-block">
      <div class="question-row">
        <span class="question-text"><strong>${question.number}.</strong> ${question.text}</span>
        <span class="question-marks">${question.marks}</span>
      </div>
      ${bodyHTML}
    </div>
  `;
};

// Renders ONE full section: its title, then all its questions in order
const renderSection = (section) => {
  const questionsHTML = section.questions
    .map((question) => renderQuestion(question, section.type))
    .join("");

  return `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      ${questionsHTML}
    </div>
  `;
};

// Main export: takes the full assembled paper object, returns a complete HTML document
exports.buildPaperHTML = (paperData) => {
  const { metadata, sections } = paperData;
  const { institutionName, className, timeAllowed, watermark, totalMarks } = metadata;

  const sectionsHTML = sections.map(renderSection).join("");

  const watermarkHTML = watermark
    ? `<div class="watermark">${institutionName || ""}</div>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Bengali&family=Noto+Sans+Devanagari&display=swap');

          * { box-sizing: border-box; }

          body {
            font-family: 'Noto Sans', 'Noto Sans Bengali', 'Noto Sans Devanagari', sans-serif;
            font-size: 14px;
            color: #111;
            margin: 0;
            padding: 40px;
            position: relative;
          }

          .watermark {
            position: fixed;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 60px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.08);
            z-index: -1;
            white-space: nowrap;
          }

          .header { text-align: center; margin-bottom: 20px; }
          .header .institution-name { font-size: 22px; font-weight: 700; margin: 0; }
          .header .class-name { font-size: 16px; margin: 4px 0 0 0; }

          .meta-row {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
            padding: 8px 0;
            margin-bottom: 24px;
          }

          .section { margin-bottom: 24px; }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            text-decoration: underline;
            margin-bottom: 12px;
          }

          .question-block { margin-bottom: 14px; page-break-inside: avoid; }
          .question-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
          .question-text { flex: 1; }
          .question-marks { white-space: nowrap; font-weight: 600; }

          .options { display: flex; flex-wrap: wrap; gap: 16px; margin: 6px 0 0 20px; }
          .option { min-width: 120px; }

          .answer-space { border-bottom: 1px dashed #999; margin-top: 8px; }
          .answer-space-short { height: 60px; }
        </style>
      </head>
      <body>
        ${watermarkHTML}
        <div class="header">
          <p class="institution-name">${institutionName || ""}</p>
          <p class="class-name">${className || ""}</p>
        </div>
        <div class="meta-row">
          <span>Time: ${timeAllowed || "-"}</span>
          <span>Total Marks: ${totalMarks || "-"}</span>
        </div>
        ${sectionsHTML}
      </body>
    </html>
  `;
};
