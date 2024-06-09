const metadataQuery = `
  query questionTitle($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      titleSlug
      isPaidOnly
      difficulty
      likes
      dislikes
      categoryTitle
    }
  }
`;

const questionContentQuery = `
    query questionContent($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            content
            mysqlSchemas
            dataSchemas
        }
    }
  `;

export async function getLeetcodeQuestionMetadata(title_slug: string) {
  const variables = {
    titleSlug: title_slug,
  };

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: metadataQuery,
      variables: variables,
    }),
  });

  const resJson = await response.json();
  return resJson.data.question;
}


export async function getLeetcodeQuestionContent(title_slug: string) {
    const variables = {
      titleSlug: title_slug,
    };
  
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: questionContentQuery,
        variables: variables,
      }),
    });
  
    const resJson = await response.json();
    return resJson.data;
  }