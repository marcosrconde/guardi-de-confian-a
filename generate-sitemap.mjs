import fs from "fs";
import path from "path";
import frontMatter from "front-matter";

const getPosts = () => {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { attributes } = frontMatter(fileContents);
    return {
      slug: fileName.replace(/\.md$/, ""),
      ...attributes,
    };
  });
  return allPostsData;
};

const generateSitemap = () => {
  const posts = getPosts();
  const baseUrl = "https://jusmulher.com.br";
  const mainPages = [
    "/",
    "/auth",
    "/reset-password",
    "/app",
    "/app/historico",
    "/app/creditos",
    "/app/faq",
    "/blog"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${mainPages
    .map((page) => {
      return `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.80</priority>
    </url>`;
    })
    .join("")}
  ${posts
    .map((post) => {
      return `
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
      <priority>1.00</priority>
    </url>`;
    })
    .join("")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
};

generateSitemap();
