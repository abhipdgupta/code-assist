import { useEffect, useState } from "react";
import { YoutubeSearch } from "../api/youtube";

type YoutubeItem = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
};

function VideoSolutionTab() {
  const [videoLists, setVideoList] = useState<null | YoutubeItem[]>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState("");

  const getYoutubeVideoLists = async (problemTitleSlug: string) => {
    try {
      setLoading(true);
      const lists = await YoutubeSearch(problemTitleSlug);
      setVideoList(lists);
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

  useEffect(() => {
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

            return { problemTitleSlug };
          },
        },
        (results) => {
          const [{ result }] = results;
          if (result?.error) {
            setErrMsg(result.error);
          } else {
            getYoutubeVideoLists(result!.problemTitleSlug!);
          }
        }
      );
    });
  }, []);

  return (
    <>
      {errMsg && (
        <h1 className="font-semibold text-red-500 text-wrap">{errMsg}</h1>
      )}
      <section className="flex flex-col gap-4 mt-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <YoutubeCardSkeleton key={i} />
            ))
          : videoLists &&
            videoLists.map((video, i) => <YoutubeCard item={video} key={i} />)}
      </section>
    </>
  );
}

const YoutubeCardSkeleton = () => {
  return (
    <div className="flex gap-4 bg-gray-900 w-full h-24 items-center p-2 animate-pulse">
      <div className="w-36 h-full bg-gray-700 rounded-md"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

const YoutubeCard = ({ item }: { item: YoutubeItem }) => {
  if (
    !item?.id?.videoId ||
    !item?.snippet?.thumbnails?.medium.url ||
    !item?.snippet?.title ||
    !item?.snippet?.publishedAt ||
    !item?.snippet?.channelTitle
  )
    return null;

  return (
    <a
      href={`https://www.youtube.com/watch/${item.id.videoId}`}
      target="_blank"
      className="flex gap-4 bg-gray-900 w-full h-24 items-center p-2"
    >
      <div className="w-36 h-full overflow-hidden">
        <img
          src={item.snippet.thumbnails.medium.url}
          className="rounded-md object-contain w-full h-full"
        />
      </div>

      <div className="flex-1">
        <h1 className="text-xs font-semibold">{item.snippet.channelTitle}</h1>
        <h1 className="text-xs text-gray-300 " title={item.snippet.title}>
          {item.snippet.title.slice(0, 50)}
          {item.snippet.title.length > 50 ? "..." : null}
        </h1>
        <h3 className="text-xs text-gray-300">
          {new Date(item.snippet.publishedAt)?.toLocaleDateString()}
        </h3>
      </div>
    </a>
  );
};

export default VideoSolutionTab;
