/* eslint-disable import/no-extraneous-dependencies */
import { useQuery } from '@tanstack/react-query';
import { graphql } from "./gql/gql";
import { request } from "graphql-request";

export function GetPosts(amount = 3, cursor: string) {
  const endpoint =
    "https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clcrreocx0oot01ur229906i3/master";

  const query = graphql(`
  query Posts($cursor: String, $amount: Int!) {
    pages: postsConnection(
      after: $cursor
      first: $amount
      orderBy: createdAt_DESC
    ) {
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
`);

  const variables = {
    amount,
    cursor: cursor || null,
  };

  const { data } = useQuery({
    queryKey: ["Posts"],
    queryFn: async () => {
      request(endpoint, query, variables);
    },
  });

  console.log(data)

  return {
    posts: [],
    endCursor: "",
    hasNextPage: true,
  }
}