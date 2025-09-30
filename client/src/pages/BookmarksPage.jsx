import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getBookmarks } from "../services/userService";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/Spinner";
import BlogCard from "../components/BlogCard";
import { notifyError } from "../utils/toast";

export default function BookmarksPage() {
  const { data, loading, error, run } = useApi();

  useEffect(() => {
    run(() => getBookmarks()).catch((e) =>
      notifyError(e.message || "Failed to load bookmarks")
    );
  }, [run]);

  const bookmarks =
    data?.data?.bookmarks ||
    data?.bookmarks ||
    data?.data?.data?.bookmarks ||
    [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-2/3"></div>
              <div className="flex gap-2">
                <div className="skeleton h-5 w-16"></div>
                <div className="skeleton h-5 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950/20">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-error-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-error-800 dark:text-error-200 mb-1">
              Failed to load bookmarks
            </h3>
            <p className="text-error-600 dark:text-error-300 text-sm">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mobile-padding">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-md text-gray-900 dark:text-gray-100">
              Bookmarked Posts
            </h1>
            <p className="text-body-sm mt-2">
              Your saved articles for later reading
            </p>
          </div>
          {bookmarks.length > 0 && (
            <div className="flex items-center gap-2 text-body-sm">
              <svg
                className="w-4 h-4 text-brand-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              <span>
                {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {bookmarks.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-100 dark:bg-brand-950/50 flex-center">
              <svg
                className="w-8 h-8 text-brand-500"
                fill="none"
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
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-body-sm mb-6 max-w-md mx-auto">
              Start bookmarking posts you'd like to read later. You can bookmark
              posts by clicking the bookmark icon on any post.
            </p>
            <Link to="/" className="btn-primary">
              Explore Posts
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <BlogCard key={bookmark._id} blog={bookmark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
