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
                <img
                  src={post.image}
                  alt={post.title}
                  className="rounded-lg mb-4"
                />
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
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
