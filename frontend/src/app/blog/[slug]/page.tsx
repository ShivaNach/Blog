import { notFound } from "next/navigation";

type Blog = {
  title: string;
  description: string;
  content: string;
  published_at: string;
};

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const {slug} = await params; 

  // If slug is missing, trigger 404
  if (!slug) notFound();

  // Fetch blog data on the server
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`, {
    cache: "no-store",
  });

  // If blog not found, trigger 404
  if (!res.ok) notFound();

  const blog: Blog = await res.json();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-6">
        {new Date(blog.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      <article className="text-xl prose prose-invert">{blog.description}</article>
      <article className="prose prose-invert mt-6">{blog.content}</article>
    </main>
  );
}
