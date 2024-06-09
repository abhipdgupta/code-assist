import { getApiKey } from "../utils/apiKey";

export async function YoutubeSearch(query: string) {
  const API_KEY = getApiKey();

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}&type=video&part=snippet`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resJson = await response.json();

  if (resJson.error) throw new Error(resJson.error.message);

  return resJson.items;
}
