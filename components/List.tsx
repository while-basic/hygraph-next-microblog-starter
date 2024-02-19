"use client";
import { useState } from "react";
import Post from "./Post";
import { getData } from "../helpers";

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
