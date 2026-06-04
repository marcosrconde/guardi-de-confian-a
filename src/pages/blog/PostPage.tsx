import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { usePost } from "@/hooks/usePosts";
import PublicHeader from "@/components/app/PublicHeader";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = usePost(slug!);

  if (loading) {
    return <div>Carregando post...</div>;
  }

  if (!post) {
    return <div>Post não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-warm">
      <Helmet>
        <title>{post.title} · Jusmulher</title>
        <meta name="description" content={post.description} />
      </Helmet>
      <PublicHeader />
      <div className="container py-12">
        <article className="prose lg:prose-xl mx-auto">
          <h1>{post.title}</h1>
          <p className="text-muted-foreground">
            {new Date(post.date).toLocaleDateString()} por {post.author}
          </p>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.body}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default PostPage;
