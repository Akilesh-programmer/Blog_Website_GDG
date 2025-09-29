import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { getBlogBySlug } from "../services/blogService";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/Spinner";
import { notifyError } from "../utils/toast";
import { ROUTES } from "../routes/paths";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data, loading, error, run } = useApi();

  useEffect(() => {
    if (slug) {
      run(() => getBlogBySlug(slug)).catch((err) =>
        notifyError(err.message || "Failed to load post")
      );
    }
  }, [slug, run]);

  const blog = data?.data?.blog || data?.blog || data?.data?.data; // various response shapes

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (error)
    return (
      <div className="max-w-2xl">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load: {error.message}
        </p>
        <Link to={ROUTES.HOME} className="btn-outline">
          Back to posts
        </Link>
      </div>
    );
  if (!blog) return null;

  return (
    <article className="prose-blog max-w-3xl">
      <header className="not-prose mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3">
          {blog.title}
        </h1>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 flex flex-wrap gap-x-2 items-center">
          <span>{blog.author}</span>
          <span>•</span>
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </time>
          {blog.estimatedReadTime && (
            <>
              <span>•</span>
              <span>{blog.estimatedReadTime} min read</span>
            </>
          )}
        </div>
        {blog.tags?.length ? (
          <ul className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((t) => (
              <li
                key={t}
                className="text-[10px] uppercase tracking-wide bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{
          __html: blog.content
            .split("\n")
            .map((p) => `<p>${p.replace(/</g, "&lt;")}</p>`)
            .join(""),
        }}
      />
    </article>
  );
}
