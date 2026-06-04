import { Post } from "@/types/post";
import fm from "front-matter";

export const usePosts = () => {
  const postModules = import.meta.glob("../posts/**/*.md", {
    as: "raw",
    eager: true,
  });

  const postList: Post[] = Object.values(postModules).map((rawPost: string) => {
    const { attributes, body } = fm(rawPost);
    return { ...(attributes as Omit<Post, "body">), body };
  });

  postList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
