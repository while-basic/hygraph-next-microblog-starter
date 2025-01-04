"use client";
import { useState, useEffect } from "react";
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
    "https://us-west-2.cdn.hygraph.com/content/cm5hsqet7013y07wadmqo5je6/master",
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
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (cursor: string | null = null) => {
    setLoading(true);
    try {
      const { posts: newPosts, endCursor, hasNextPage } = await getData(3, cursor || "");
      if (cursor) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      setNextCursor(hasNextPage ? endCursor : null);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Only run on mount

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchPosts(nextCursor);
    }
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
      {nextCursor && !loading && (
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
