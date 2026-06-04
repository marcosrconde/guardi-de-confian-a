import { Post } from "@/types/post";
import fm from "front-matter";
import { useEffect, useState } from "react";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const postModules = import.meta.glob("../posts/**/*.md");
      const postPromises = Object.entries(postModules).map(async ([path, getPost]) => {
        const postUrl = (await getPost()).default;
        const response = await fetch(postUrl);
        const rawContent = await response.text();
        const { attributes, body } = fm(rawContent);
        return { ...(attributes as Omit<Post, "body">), body };
      });
      const fetchedPosts = await Promise.all(postPromises);
      fetchedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(fetchedPosts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
  };
};

export const usePost = (slug?: string) => {
  const { posts, loading } = usePosts();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!loading && posts.length > 0 && slug) {
      const foundPost = posts.find((p) => p.slug === slug);
      setPost(foundPost || null);
    }
  }, [loading, posts, slug]);

  return {
    post,
    loading,
  };
};
