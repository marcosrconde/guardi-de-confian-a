import { Post } from "@/types/post";
import fm from "front-matter";

export const usePosts = () => {
  const postModules = import.meta.glob("../posts/**/*.md", {
    eager: true,
    import: "default",
    query: "?raw",
  });

  const postList: Post[] = Object.values(postModules).map((rawPost: string) => {
    const { attributes, body } = fm(rawPost);
    return { ...(attributes as Omit<Post, "body">), body };
  });

  return {
    posts: postList,
    loading: false,
  };
};

export const usePost = (slug?: string) => {
  const { posts, loading } = usePosts();
  const post = posts.find((p) => p.slug === slug);
  return {
    post,
    loading,
  };
};
