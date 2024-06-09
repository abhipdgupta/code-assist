import { useEffect, useState } from "react";
import { getLeetcodeQuestionContent } from "../api/leetcode";
import { Note } from "../types/note.type";
import { MessageSquarePlus } from "lucide-react";

type AddNoteProps = {
  onSaveNote: (note: Note) => Promise<undefined | string>;
};

const AddNote = ({ onSaveNote }: AddNoteProps) => {
  const [titleSlug, setTitleSlug] = useState<string | null>(null);
  const [questionContent, setQuestionContent] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [points, setPoints] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(false);

  const fetchQuestionData = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id! },
          func: () => {
            const url = window.location.href;
            const newUrl = new URL(url);
            if (!url.startsWith("https://leetcode.com")) {
              return { error: `Extension doesn't work in ${newUrl.origin}` };
            }

            const problemTitleSlug = newUrl.pathname
              .split("/")
              .filter((x) => x !== "")[1];

            if (!problemTitleSlug) {
              return { error: "Open a particular problem" };
            }

            return { problemTitleSlug };
          },
        },
        async (results) => {
          const [{ result }] = results;
          if (result?.error) {
            setErrMsg(result.error);
          } else {
            setTitleSlug(result!.problemTitleSlug!);
            try {
              setLoading(true);
              const questionData = await getLeetcodeQuestionContent(
                result!.problemTitleSlug!
              );
              if (questionData) {
                setQuestionContent(questionData.question.content);
              } else {
                setErrMsg("Failed to fetch question content");
              }
            } catch (error) {
              setErrMsg("Failed to fetch question content");
            } finally {
              setLoading(false);
            }
          }
        }
      );
    });
  };

  const handleSaveNotes = async () => {
    if (!questionContent || !titleSlug) {
      setErrMsg("No question loaded");
      return;
    }

    const note: Note = {
      titleSlug,
      questionContent,
      code,
      points,
    };

    const res = await onSaveNote(note);
    console.log(res);

    if (res !== undefined) {
      setErrMsg(res);
    } else {
      setErrMsg("");
    }
    setTitleSlug(null);
    // setQuestionContent(null);
    setCode("");
    setPoints([""]);
  };

  const handlePointChange = (index: number, value: string) => {
    const updatedPoints = [...points];
    updatedPoints[index] = value;
    setPoints(updatedPoints);
  };

  const handleAddPoint = () => {
    setPoints([...points, ""]);
  };

  useEffect(() => {
    if (expanded) {
      fetchQuestionData();
    }
  }, [expanded]);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        <span className="flex gap-2 items-center justify-center">
          <MessageSquarePlus size={12} />
          Add Note
        </span>
      </button>
      {expanded && (
        <>
          <h2 className="mt-4 text-lg font-bold">Notes for Current Question</h2>
          {loading && <p className="mt-2 text-white">Loading...</p>}
          {errMsg && <p className="mt-2 text-red-500">{errMsg}</p>}
          <textarea
            className="w-full mt-2 p-2 border-2 border-white rounded bg-slate-950 text-white "
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
          />
          <div className="mt-4">
            <h3 className="font-semibold">Important Points</h3>
            {points.map((point, index) => (
              <input
                key={index}
                className="w-full mt-2 p-2 border-2 border-white rounded-md bg-slate-950 text-white "
                placeholder={`Point ${index + 1}`}
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                disabled={loading}
              />
            ))}
            <button
              className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 text-white"
              onClick={handleAddPoint}
              disabled={loading}
            >
              Add Point
            </button>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-700 text-white"
            onClick={handleSaveNotes}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Notes"}
          </button>
        </>
      )}
    </div>
  );
};

export default AddNote;
