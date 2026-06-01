import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

const LatestPosts = () => {
  const { posts, loading } = usePosts();

  if (loading) {
    return <div>Carregando posts...</div>;
  }

  const latestPosts = posts.slice(0, 3);

  return (
    <section className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Últimos Posts</h2>
        <Button asChild variant="outline">
          <Link to="/blog">Ver todos</Link>
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {latestPosts.map((post) => (
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
    </section>
  );
};

export default LatestPosts;
