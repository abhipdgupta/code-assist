import jsPDF from "jspdf";
import { getSavedNotes } from "../api/notes";
import { Note as TNote } from "../types/note.type";
import { Download } from "lucide-react";
import { formatDate } from "../utils/helper";

function NotesPdfExport() {
  const downloadPDF = async () => {
    const notes = await getSavedNotes();
    const pdfContent = notesPdfTemplate(notes);

    const html = `
          <html>
            <head>
              <title>Print</title>
            </head>
            <body>${pdfContent}</body>
          </html>`;

    const jspdf = new jsPDF("p", "pt", "a4");

    jspdf.html(html, {
      windowWidth: 1080,
      callback: function () {
        jspdf.save(`code-assist-${formatDate(Date.now())}.pdf`)
      },
    });
  };

  return (
    <div>
      <button
        className="px-4 py-1 bg-purple-500 rounded hover:bg-purple-700 text-white"
        onClick={() => downloadPDF()}
      >
        <span className="flex gap-2 items-center justify-center">
          <Download size={12} />
          Pdf Export
        </span>
      </button>
    </div>
  );
}

export default NotesPdfExport;

const notesPdfTemplate = (savedNotes: TNote[]) => {
  const watermarkStyle = `
      position: absolute;
      opacity: 0.1;
      font-size: 5em;
      color: #d3d3d3;
      pointer-events: none
    `;

  const numWatermarks = 0;
  let watermarkContent = "";
  for (let i = 0; i < numWatermarks; i++) {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const watermark = `<div style="${watermarkStyle}; top: ${top}%; left: ${left}%; transform: translate(-50%, -50%); poin">CODE-ASSIST</div>`;
    watermarkContent += watermark;
  }

  return savedNotes
    .map(
      (note, index) =>
        `<div 
            key=${index} 
            style="position: relative; width: 595.28px; margin: 0 auto; padding: 20px; font-family: Arial; font-size: 10px; margin:10px auto;">
            <h1 style="font-size: 2em; font-weight: bold;">
              ${index + 1}. ${note.titleSlug}
            </h1>
            
            <div 
              style="border: 1px solid #e2e8f0; border-radius: 0.25rem; padding: 10px; color: black; background-color: white; margin: 10px auto; overflow-wrap: break-word; width:100%;">
              ${note.questionContent}
            </div>
            
            <div >
              <h2 style="font-size: 1.5em; font-weight: bold;">Code :</h2>
              <pre style="padding: 10px; border-radius: 0.25rem; margin-top: 10px; background: #f5f5f5; color: black; overflow-wrap: break-word;width:100%;">
                ${note.code.trim()}
              </pre>
            </div>
            
            <div>
              <h2 style="font-size: 1.5em; font-weight: bold;">Important Points:</h2>
              ${note.points
                .map(
                  (point, pointIndex) => `<div key=${pointIndex}>${point}</div>`
                )
                .join("")}
            </div>
            ${watermarkContent}
          </div>`
    )
    .join("");
};
