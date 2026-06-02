import matter from "gray-matter";
import { useEffect, useState } from "react";

export interface Post {
  slug: string;
  title: string;
  author: string;
  date: string;
  description: string;
  content: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postModules = import.meta.glob("../posts/**/*.md", { as: "raw" });
        const postPromises = Object.entries(postModules).map(
          async ([path, getPost]) => {
            const rawContent = await getPost();
            const { data, content } = matter(rawContent);
            const slug = path.split("/").pop()?.replace(".md", "") ?? "";
            return {
              slug,
              title: data.title,
              author: data.author,
              date: data.date,
              description: data.description,
              content,
            };
          }
        );

        const fetchedPosts = await Promise.all(postPromises);
        fetchedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(fetchedPosts);
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
