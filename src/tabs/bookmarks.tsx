import { useEffect, useState } from "react";
import { getLeetcodeQuestionMetadata } from "../api/leetcode";
import { Bookmark, Trash2 } from "lucide-react";

type QuestionMetaDeta = {
  link: string;
  questionId: string;
  title: string;
  titleSlug: string;
};

function BookmarksTab() {
  const [savedQuestionsList, setSavedQuestionsList] = useState<
    null | QuestionMetaDeta[]
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState("");

  const fetchQuestionMetaData = async (title_slug: string) => {
    try {
      setLoading(true);
      return await getLeetcodeQuestionMetadata(title_slug);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrMsg(error.message);
      } else {
        setErrMsg("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = () => {
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

            // https://leetcode.com/problems/<title-slug>/*
            const problemTitleSlug = newUrl.pathname
              .split("/")
              .filter((x) => x !== "")[1];

            if (!problemTitleSlug) {
              return { error: "Open a particular problem" };
            }

            return { problemTitleSlug, link: url };
          },
        },
        async (results) => {
          const [{ result }] = results;
          if (result?.error) {
            setErrMsg(result.error);
          } else {
            chrome.storage.local.get(["savedQuestions"], async (ele) => {
              const savedQuestions = ele.savedQuestions || [];
              const isAlreadySaved = savedQuestions.some(
                (question: QuestionMetaDeta) =>
                  question.titleSlug === result!.problemTitleSlug!
              );

              if (isAlreadySaved) {
                setErrMsg("Question already added");
                return;
              }

              const metaData = await fetchQuestionMetaData(
                result!.problemTitleSlug!
              );
              if (metaData) {
                const data: QuestionMetaDeta = {
                  link: result!.link!,
                  questionId: metaData.questionId,
                  title: metaData.title,
                  titleSlug: metaData.titleSlug,
                };

                const updatedSavedQuestions = [...savedQuestions, data];
                chrome.storage.local.set(
                  { savedQuestions: updatedSavedQuestions },
                  () => {
                    console.log("Question saved with metadata:", data);
                    setSavedQuestionsList(updatedSavedQuestions);
                    setErrMsg("");
                  }
                );
              } else {
                setErrMsg("Failed to fetch metadata for the question");
              }
            });
          }
        }
      );
    });
  };

  const deleteQuestion = (index: number) => {
    chrome.storage.local.get(["savedQuestions"], (result) => {
      const savedQuestions = result.savedQuestions || [];
      savedQuestions.splice(index, 1);
      chrome.storage.local.set({ savedQuestions }, () => {
        console.log("Question deleted");
        setSavedQuestionsList([...savedQuestions]);
      });
    });
  };

  const deleteAllQuestions = () => {
    chrome.storage.local.remove("savedQuestions", () => {
      console.log("All questions deleted");
      setSavedQuestionsList([]);
    });
  };

  useEffect(() => {
    chrome.storage.local.get(["savedQuestions"], (result) => {
      if (!result.savedQuestions) {
        chrome.storage.local.set({ savedQuestions: [] }, () => {
          console.log("Initialized savedQuestions with an empty array");
        });
      } else {
        setSavedQuestionsList(result.savedQuestions);
      }
    });
  }, []);

  return (
    <div className="p-4 rounded-md">
      <button
        className="px-2 py-2 bg-blue-500 rounded hover:bg-blue-700"
        onClick={saveQuestion}
        disabled={loading}
      >
        {loading ? (
          "Saving..."
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Bookmark size={12} />
            Bookmark question
          </span>
        )}
      </button>
      {errMsg && <p className="mt-2 text-red-500">{errMsg}</p>}
      <h2 className="mt-4 text-lg font-bold">Saved Questions</h2>
      {savedQuestionsList && savedQuestionsList.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-red-500 rounded hover:bg-red-700"
          onClick={deleteAllQuestions}
        >
          <span className="flex gap-2 items-center justify-center">
            <Trash2 size={12} /> Delete All
          </span>
        </button>
      )}
      <ul className="my-2 list-disc list-inside">
        {savedQuestionsList &&
          savedQuestionsList.map((question, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b-2 border-gray-500 mt-2"
            >
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {index + 1}. {question.title}
              </a>
              <button
                className="ml-4 px-2 py-1 hover:bg-gray-800"
                onClick={() => deleteQuestion(index)}
              >
                <span className="flex gap-2 items-center justify-center">
                  <Trash2 size={12} />
                </span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default BookmarksTab;
