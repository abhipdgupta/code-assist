import { useState } from "react";
import { Note as TNote } from "../types/note.type";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const Note = ({
  note,
  index,
  onDelete,
}: {
  note: TNote;
  index: number;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuestionContent, setShowQuestionContent] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [showImportantPoints, setShowImportantPoints] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      },
      () => {
        setCopySuccess("Failed to copy!");
        setTimeout(() => setCopySuccess(""), 2000);
      }
    );
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center border-white border-b-2 mt-2">
        <h1 className="font-semibold flex gap-2 items-center justify-center">
          {index + 1}.{" "}
          <a
            href={`https://leetcode.com/problems/${note.titleSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {note.titleSlug.toUpperCase().split("-").join(" ")}
          </a>
          <button
            className="px-2 py-1     rounded hover:bg-gray-700 text-white flex items-center justify-center"
            onClick={() => {
                setIsExpanded(!isExpanded)
                setShowCodeSnippet(false)
                setShowImportantPoints(false)
                setShowQuestionContent(false)
            }}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </h1>

        <button className="ml-4 px-2 py-1 hover:bg-gray-800" onClick={onDelete}>
          <span className="flex gap-2 items-center justify-center">
            <Trash2 size={12} />
          </span>
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-col mt-2">
          <button
            className="bg-slate-950 mt-2 rounded-lg hover:bg-slate-700 border-white border-2 p-2 text-white"
            onClick={() => setShowQuestionContent(!showQuestionContent)}
          >
            {showQuestionContent
              ? "Hide Question Content"
              : "Show Question Content"}
          </button>
          {showQuestionContent && (
            <div
              className="border rounded p-2 text-white mt-2 overflow-x-auto"
              style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: note.questionContent }}
            />
          )}

          <button
            className="bg-slate-950 mt-2 rounded-lg hover:bg-slate-700 border-white border-2 p-2 text-white"
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
          >
            {showCodeSnippet ? "Hide Code Snippet" : "Show Code Snippet"}
          </button>
          {showCodeSnippet && (
            <div className="relative mt-2">
              <pre className="bg-gray-800 p-2 rounded overflow-x-auto">
                {note.code}
              </pre>
              <button
                className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-900"
                onClick={() => copyToClipboard(note.code)}
              >
                Copy
              </button>
              {copySuccess && (
                <div className="absolute top-0 right-10 m-2 text-green-500">
                  {copySuccess}
                </div>
              )}
            </div>
          )}

          <button
            className="bg-slate-950 mt-2 rounded-lg hover:bg-slate-700 border-white border-2 p-2 text-white"
            onClick={() => setShowImportantPoints(!showImportantPoints)}
          >
            {showImportantPoints
              ? "Hide Important Points"
              : "Show Important Points"}
          </button>
          {showImportantPoints && (
            <div className="list-disc list-inside pl-4 mt-2">
              {note.points.map((point, pointIndex) => (
                <div key={pointIndex}>{pointIndex+1}. {point}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Note;
