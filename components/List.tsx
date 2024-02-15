async function getData(amount = 3, cursor: string) {
  const results = await fetch(
    "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clifk2kla052e01ui88kyhe0c/master",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 },
      body: JSON.stringify({
        query: `
          query Talks($cursor: String, $amount: Int!) {
            page: talksConnection(after: $cursor, first: $amount, orderBy: date_DESC) {
              talks: edges {
              cursor
                talk: node {
                  conference
                  date
                  link
                  location
                  talk
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
              aggregate {
                count
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
  const { page } = json.data;
  const { endCursor, hasNextPage } = page.pageInfo;

  return {
    talks: page.talks,
    endCursor,
    hasNextPage,
  };
}

export default async function List() {
  const { talks, endCursor, hasNextPage } = await getData(3, "");

  return <pre>{JSON.stringify(talks, null, " ")}</pre>;
}
