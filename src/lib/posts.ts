import matter from "gray-matter";
import violenciaContramulher from "@/posts/violencia-contra-mulher-no-brasil-numeros-preocupantes.md?raw";

export interface Post {
  slug: string;
  title: string;
  author: string;
  date: string;
  description: string;
  content: string;
}

const postsRaw = [
  {
    slug: "violencia-contra-mulher-no-brasil-numeros-preocupantes",
    content: violenciaContramulher,
  },
];

const posts: Post[] = postsRaw.map((post) => {
  const { data, content } = matter(post.content);
  return {
    slug: post.slug,
    title: data.title,
    author: data.author,
    date: data.date,
    description: data.description,
    content: content,
  };
});

export default posts;
