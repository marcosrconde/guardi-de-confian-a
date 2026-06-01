import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { usePost } from "@/hooks/usePosts";
import PublicHeader from "@/components/app/PublicHeader";

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
      <PublicHeader />
      <div className="container py-12">
        <article className="prose lg:prose-xl mx-auto">
          <h1>{post.title}</h1>
          <p className="text-muted-foreground">
            {new Date(post.date).toLocaleDateString()} por {post.author}
          </p>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    PreTag="div"
                    language={match[1]}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default PostPage;
