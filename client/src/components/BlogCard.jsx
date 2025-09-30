import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import { useAuth } from "../context/AuthContext";
import { toggleBookmark, getBookmarks } from "../services/userService";
import { useState, useEffect, useCallback } from "react";
import { notifyError } from "../utils/toast";

export default function BlogCard({ blog }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);

  const checkBookmarked = useCallback(async () => {
    if (!user) {
      setBookmarked(false);
      return;
    }
    try {
      // Could be optimized by global state; simple request for now
      const res = await getBookmarks();
      const list =
        res.data?.bookmarks || res.bookmarks || res.data?.data?.bookmarks || [];
      setBookmarked(list.some((b) => b._id === blog._id));
    } catch (_) {
      /* silent */
    }
  }, [user, blog._id]);

  useEffect(() => {
    checkBookmarked();
  }, [checkBookmarked]);

  const handleBookmark = async () => {
    if (!user) {
      notifyError("Login to bookmark");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const r = await toggleBookmark(blog._id);
      if (r.action === "added") setBookmarked(true);
      else if (r.action === "removed") setBookmarked(false);
    } catch (e) {
      notifyError(e.message || "Failed to toggle bookmark");
    } finally {
      setBusy(false);
    }
  };
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
          {user && (
            <>
              <span>•</span>
              <button
                onClick={handleBookmark}
                disabled={busy}
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition ${
                  bookmarked
                    ? "text-brand-600 border-brand-400 dark:border-brand-500"
                    : ""
                }`}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
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
