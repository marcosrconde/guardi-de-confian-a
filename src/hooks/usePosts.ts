import { useEffect, useState } from "react";
import allPosts, { type Post } from "@/lib/posts";

export type { Post };

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      try {
        const sortedPosts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}

export function usePost(slug?: string) {
  const { posts, loading } = usePosts();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!loading && posts.length > 0 && slug) {
      const foundPost = posts.find((p) => p.slug === slug);
      setPost(foundPost || null);
    }
  }, [loading, posts, slug]);

  return { post, loading };
}
