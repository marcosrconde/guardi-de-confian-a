import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import PublicHeader from "@/components/app/PublicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BlogPage = () => {
  const { posts, loading } = usePosts();

  if (loading) {
    return <div>Carregando posts...</div>;
  }

  return (
    <div className="min-h-screen bg-warm">
      <PublicHeader />
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.slug}>
              <Card>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString()} por {post.author}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
