import Link from "next/link";

const BLOG_API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"}/blogs`;

async function getBlog(id) {
  const response = await fetch(`${BLOG_API_BASE}/${id}`, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { error: data?.message || "Failed to fetch blog" };
  }

  const blog = data?.data || data;
  if (!blog) {
    return { error: "Blog not found" };
  }

  return { blog };
}

export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  const { blog, error } = await getBlog(id);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl font-bold text-slate-700 mb-4">404</p>
          <h1 className="text-2xl font-semibold text-slate-200 mb-3">Blog not found</h1>
          <p className="text-red-400 mb-8 text-sm">{error}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all text-sm font-medium"
          >
            ← Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-28 pb-20 px-4">
      <article className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all text-sm font-medium mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Blogs
        </Link>

        {/* Image — fully visible, contained, compact */}
        {blog.image ? (
          <div className="w-full rounded-2xl  border border-white/10 bg-white/5 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              className="w-full max-h-130 "
            />
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 mb-8 h-36 flex items-center justify-center text-slate-600 text-sm">
            No image
          </div>
        )}

        {/* Tags */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {blog.tags.map((tag) => (
              <span
                key={`${blog.id || id}-${tag}`}
                className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Accent divider */}
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-6" />

        {/* Description */}
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {blog.description}
        </p>

      </article>
    </main>
  );
}