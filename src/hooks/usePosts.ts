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
        const postModules = import.meta.glob("/src/posts/**/*.md", { as: "raw" });
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

export function usePost(slug: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPost = async () => {
        try {
          const postModule = await import(`../posts/${slug}.md?raw`);
          const rawContent = postModule.default;
          const { data, content } = matter(rawContent);
          setPost({
            slug,
            title: data.title,
            author: data.author,
            date: data.date,
            description: data.description,
            content,
          });
        } catch (error) {
          console.error(`Failed to fetch post: ${slug}`, error);
        } finally {
          setLoading(false);
        }
      };
  
      if (slug) {
        fetchPost();
      } else {
          setLoading(false);
      }
    }, [slug]);
  
    return { post, loading };
  }
