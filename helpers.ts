export async function getData(amount = 3, cursor: string) {
  const results = await fetch(
    "https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clcrreocx0oot01ur229906i3/master",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 },
      body: JSON.stringify({
        query: `
          query Posts($cursor: String, $amount: Int!) {
            pages: postsConnection(after: $cursor, first: $amount, orderBy: createdAt_DESC) {
              pageInfo {
                hasNextPage
                endCursor
              }
              posts: edges {
                cursor
                post: node {
                  slug
                  id
                  createdAt
                  content {
                    html
                  }
                }
              }
            }
          }
        `,
        variables: {
          amount,
          cursor: cursor || null,
        },
      }),
    }
  );

  const json = await results.json();
  const { pages } = json.data;
  const { endCursor, hasNextPage } = pages.pageInfo;

  return {
    posts: pages.posts,
    endCursor,
    hasNextPage,
  };
}