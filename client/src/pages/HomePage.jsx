import { useEffect, useState, useCallback } from "react";
import { getBlogs } from "../services/blogService";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/Spinner";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { notifyError } from "../utils/toast";

export default function HomePage() {
  const { data, loading, error, run } = useApi();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const load = useCallback(
    (p = page, q = search, g = genre) => {
      const params = { page: p, q, minimal: true, signal: undefined };
      if (g) params.genre = g;
      run((signal) => getBlogs({ ...params, signal })).catch((err) =>
        notifyError(err.message || "Failed to load blogs")
      );
    },
    [run, page, search, genre]
  );

  useEffect(() => {
    load(1, search, genre); /* eslint-disable-next-line */
  }, [search, genre]);
  useEffect(() => {
    load(page, search, genre); /* eslint-disable-next-line */
  }, [page]);
  useEffect(() => {
    load(1, search, genre); /* initial */
  }, []); // initial load

  const blogs = data?.data?.blogs || data?.blogs || []; // depending on interceptor shape
  const meta = data?.metadata;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-display-lg text-gray-900 dark:text-gray-100 mb-4">
          Discover Amazing Stories
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto">
          Explore insights, tutorials, and stories from our community of writers
          and developers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query.trim());
            setPage(1);
          }}
          className="space-y-4"
          role="search"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search posts
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  id="search"
                  type="text"
                  placeholder="Search posts by title, content, or tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-base pl-10 pr-4"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="min-w-[140px]">
                <label htmlFor="genre" className="sr-only">
                  Filter by genre
                </label>
                <input
                  id="genre"
                  type="text"
                  placeholder="Genre filter"
                  value={genre}
                  onChange={(e) => {
                    setGenre(e.target.value.trim());
                    setPage(1);
                  }}
                  className="input-base"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>

          {(search || genre) && (
            <div className="flex items-center gap-2">
              <span className="text-body-sm">Active filters:</span>
              {search && (
                <span className="badge-primary">Search: "{search}"</span>
              )}
              {genre && <span className="badge-primary">Genre: {genre}</span>}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearch("");
                  setGenre("");
                  setPage(1);
                }}
                className="btn-ghost btn-sm ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="skeleton h-6 w-32"></div>
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
      )}

      {/* Error State */}
      {error && !loading && (
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
                Failed to load posts
              </h3>
              <p className="text-error-600 dark:text-error-300 text-sm">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && blogs.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {search || genre ? "No posts found" : "No posts yet"}
          </h3>
          <p className="text-body-sm mb-4">
            {search || genre
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Be the first to share your story with the community."}
          </p>
          {(search || genre) && (
            <button
              onClick={() => {
                setQuery("");
                setSearch("");
                setGenre("");
                setPage(1);
              }}
              className="btn-outline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Blog Posts Grid */}
      {!loading && !error && blogs.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-body-sm">
              {meta?.totalItems ? (
                <>
                  Showing {blogs.length} of {meta.totalItems} posts
                </>
              ) : (
                <>{blogs.length} posts</>
              )}
            </p>
            {meta?.totalPages > 1 && (
              <p className="text-body-sm">
                Page {meta.currentPage} of {meta.totalPages}
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id || blog.slug} blog={blog} />
            ))}
          </div>

          <Pagination
            page={meta?.currentPage || page}
            totalPages={meta?.totalPages || 1}
            onChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
