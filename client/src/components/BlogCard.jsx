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
    <div className="relative">
      {/* Main Card - Fully Clickable */}
      <Link to={ROUTES.BLOG_DETAIL(blog.slug)} className="block">
        <article className="card-interactive p-6 h-full flex flex-col group hover-lift relative">
          {/* Bookmark Button - Positioned absolutely to not interfere with link */}
          {user && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBookmark();
              }}
              disabled={busy}
              className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-all hover:scale-105 active-press focus-ring ${
                bookmarked
                  ? "text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-400"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800"
              }`}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <svg
                className="w-4 h-4"
                fill={bookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          )}

          <header className="mb-4">
            <div className="mb-3 pr-8">
              {" "}
              {/* Add right padding to avoid bookmark button */}
              <h2 className="text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {blog.title}
              </h2>
              {/* Genre Badge */}
              {blog.genre && (
                <span className="badge-secondary text-xs">{blog.genre}</span>
              )}
            </div>

            {/* Author and Meta */}
            <div className="flex items-center gap-2 text-caption">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex-center text-white text-xs font-semibold">
                {blog.author?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {blog.author}
              </span>
              <span className="text-gray-400">•</span>
              <time
                dateTime={blog.createdAt}
                className="text-gray-500 dark:text-gray-400"
              >
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {blog.estimatedReadTime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {blog.estimatedReadTime} min read
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-body-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
              {blog.excerpt}
            </p>
          )}

          {/* Tags and Stats */}
          <footer className="mt-auto space-y-3">
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Engagement Stats - Always visible inside card */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4 text-caption">
                {/* Likes */}
                <div className="flex items-center gap-1">
                  <svg
                    className={`w-4 h-4 ${
                      blog.likesCount > 0
                        ? "text-red-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill={blog.likesCount > 0 ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span
                    className={`font-medium ${
                      blog.likesCount > 0
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {blog.likesCount || 0}
                  </span>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-1">
                  <svg
                    className={`w-4 h-4 ${
                      blog.commentsCount > 0
                        ? "text-blue-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span
                    className={`font-medium ${
                      blog.commentsCount > 0
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {blog.commentsCount || 0}
                  </span>
                </div>
              </div>

              {/* Read time indicator */}
              {blog.estimatedReadTime && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {blog.estimatedReadTime} min read
                </span>
              )}
            </div>
          </footer>
        </article>
      </Link>
    </div>
  );
}
