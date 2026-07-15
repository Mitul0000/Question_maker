const { assemblePaper } = require("../Utils/paperAssembler");

const { buildPaperHTML,buildAnswerSheetHTML } = require("../Utils/htmlTemplate");
const { renderPdf } = require("../Utils/pdfRenderer");

exports.postGeneratePdf = async (request, response) => {
  try {
    const { selectedQuestions, metadata } = request.body;
    const formatedObject = assemblePaper(selectedQuestions, metadata);
    const htmlPaper = buildPaperHTML(formatedObject);
    const pdfBuffer = await renderPdf(htmlPaper);
    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="question-paper.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    response.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    response
      .status(500)
      .json({ error: "Failed to generate question paper PDF" });
  }
};

exports.postGenerateAnswerSheet = async (request, response) => {
  try {
    const { selectedQuestions, metadata } = request.body;

    const formatedObject = assemblePaper(selectedQuestions, metadata);
    const htmlAnswerSheet = buildAnswerSheetHTML(formatedObject);
    const pdfBuffer = await renderPdf(htmlAnswerSheet);

    response.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="answer-key.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    response.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating answer sheet PDF:", error);
    response.status(500).json({ error: "Failed to generate answer sheet PDF" });
  }
};