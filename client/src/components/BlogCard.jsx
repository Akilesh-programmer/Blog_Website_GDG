import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

export default function BlogCard({ blog }) {
  return (
    <article className="card flex flex-col gap-3">
      <header>
        <h2 className="text-lg font-semibold leading-snug line-clamp-2 mb-1">
          <Link
            to={ROUTES.BLOG_DETAIL(blog.slug)}
            className="hover:underline underline-offset-2"
          >
            {blog.title}
          </Link>
        </h2>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-x-2 items-center">
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
      </header>
      {blog.excerpt && (
        <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
          {blog.excerpt}
        </p>
      )}
      {blog.tags?.length ? (
        <ul className="flex flex-wrap gap-2 mt-auto pt-2">
          {blog.tags.slice(0, 4).map((t) => (
            <li
              key={t}
              className="text-[10px] uppercase tracking-wide bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
