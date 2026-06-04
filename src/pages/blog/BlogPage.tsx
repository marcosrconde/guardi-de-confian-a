import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import PublicHeader from "@/components/app/PublicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            <Card key={post.slug}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <div
                      key={tag}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  to={`/blog/${post.slug}`}
                  className={cn(buttonVariants({ variant: "link" }), "p-0")}
                >
                  Leia mais
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
