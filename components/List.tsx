"use client";
import { useState } from "react";
import Post from "./Post";

type Post = {
  cursor: string;
  post: {
    slug: string;
    id: string;
    createdAt: string;
    content: {
      html: string;
    };
  };
};

async function getData(amount = 3, cursor: string) {
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

export default function List() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (currentCursor: string) => {
    if (loading) {
      return;
    }

    setLoading(true);

    const {
      posts: postsData,
      endCursor,
      hasNextPage,
    } = await getData(3, currentCursor);

    setPosts((prevPosts) => [...prevPosts, ...postsData]);
    setNextCursor(endCursor);
    setHasNext(hasNextPage);
    setLoading(false);
  };

  useState(() => {
    fetchPosts(nextCursor);
  }, []);

  const handleLoadMore = () => {
    fetchPosts(nextCursor);
  };

  return (
    <div>
      {posts.map((post: Post) => (
        <Post post={post} key={post.cursor} />
      ))}
      {loading && (
        <div className="bg-white mb-4 p-4 rounded-md text-center">
          Loading...
        </div>
      )}
      {hasNext && !loading && (
        <button
          className="bg-white mb-4 p-4 rounded-md"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
}
