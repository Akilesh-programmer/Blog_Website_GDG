import { useEffect, useState, useCallback } from "react";
import { getBlogs } from "../services/blogService";
import { useApi } from "../hooks/useApi";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { notifyError } from "../utils/toast";

export default function HomePage() {
  const { data, loading, error, run } = useApi();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [minComments, setMinComments] = useState("");
  const [minReadTime, setMinReadTime] = useState("");
  const [maxReadTime, setMaxReadTime] = useState("");

  const load = useCallback(
    (p = page, q = search, g = genre, sort = sortBy, filters = {}) => {
      const params = {
        page: p,
        q,
        minimal: true,
        sort,
        signal: undefined,
      };

      if (g) params.genre = g;

      // Add advanced filters
      if (filters.dateFrom || dateFrom)
        params.from = filters.dateFrom || dateFrom;
      if (filters.dateTo || dateTo) params.to = filters.dateTo || dateTo;
      if (filters.minLikes || minLikes)
        params.minLikes = filters.minLikes || minLikes;
      if (filters.minComments || minComments)
        params.minComments = filters.minComments || minComments;
      if (filters.minReadTime || minReadTime)
        params.minRead = filters.minReadTime || minReadTime;
      if (filters.maxReadTime || maxReadTime)
        params.maxRead = filters.maxReadTime || maxReadTime;

      run((signal) => getBlogs({ ...params, signal })).catch((err) =>
        notifyError(err.message || "Failed to load blogs")
      );
    },
    [
      run,
      page,
      search,
      genre,
      sortBy,
      dateFrom,
      dateTo,
      minLikes,
      minComments,
      minReadTime,
      maxReadTime,
    ]
  );

  useEffect(() => {
    load(1, search, genre, sortBy); /* eslint-disable-next-line */
  }, [
    search,
    genre,
    sortBy,
    dateFrom,
    dateTo,
    minLikes,
    minComments,
    minReadTime,
    maxReadTime,
  ]);
  useEffect(() => {
    load(page, search, genre, sortBy); /* eslint-disable-next-line */
  }, [page]);
  useEffect(() => {
    load(1, search, genre, sortBy); /* initial */
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
          <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="min-w-[140px]">
                <label htmlFor="sortBy" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="input-base"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="discussion">Most Discussion</option>
                </select>
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
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="btn-secondary whitespace-nowrap"
              >
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-body-md font-medium text-gray-900 dark:text-gray-100">
                Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="dateFrom"
                    className="block text-body-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    From Date
                  </label>
                  <input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setPage(1);
                    }}
                    className="input-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateTo"
                    className="block text-body-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    To Date
                  </label>
                  <input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setPage(1);
                    }}
                    className="input-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minLikes"
                    className="block text-body-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Min Likes
                  </label>
                  <input
                    id="minLikes"
                    type="number"
                    min="0"
                    placeholder="e.g. 10"
                    value={minLikes}
                    onChange={(e) => {
                      setMinLikes(e.target.value);
                      setPage(1);
                    }}
                    className="input-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minComments"
                    className="block text-body-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Min Comments
                  </label>
                  <input
                    id="minComments"
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={minComments}
                    onChange={(e) => {
                      setMinComments(e.target.value);
                      setPage(1);
                    }}
                    className="input-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minReadTime"
                    className="block text-body-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Min Read Time (min)
                  </label>
                  <input
                    id="minReadTime"
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    value={minReadTime}
                    onChange={(e) => {
                      setMinReadTime(e.target.value);
                      setPage(1);
                    }}
                    className="input-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxReadTime"
                    className="block text-body-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Max Read Time (min)
                  </label>
                  <input
                    id="maxReadTime"
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={maxReadTime}
                    onChange={(e) => {
                      setMaxReadTime(e.target.value);
                      setPage(1);
                    }}
                    className="input-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(search ||
            genre ||
            sortBy !== "recent" ||
            dateFrom ||
            dateTo ||
            minLikes ||
            minComments ||
            minReadTime ||
            maxReadTime) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-sm font-medium">Active filters:</span>
              {search && (
                <span className="badge-primary">Search: "{search}"</span>
              )}
              {genre && <span className="badge-primary">Genre: {genre}</span>}
              {sortBy !== "recent" && (
                <span className="badge-secondary">
                  Sort:{" "}
                  {(() => {
                    if (sortBy === "oldest") return "Oldest First";
                    if (sortBy === "popular") return "Most Popular";
                    return "Most Discussion";
                  })()}
                </span>
              )}
              {dateFrom && (
                <span className="badge-secondary">From: {dateFrom}</span>
              )}
              {dateTo && <span className="badge-secondary">To: {dateTo}</span>}
              {minLikes && (
                <span className="badge-secondary">≥{minLikes} likes</span>
              )}
              {minComments && (
                <span className="badge-secondary">≥{minComments} comments</span>
              )}
              {minReadTime && (
                <span className="badge-secondary">≥{minReadTime}min read</span>
              )}
              {maxReadTime && (
                <span className="badge-secondary">≤{maxReadTime}min read</span>
              )}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearch("");
                  setGenre("");
                  setSortBy("recent");
                  setDateFrom("");
                  setDateTo("");
                  setMinLikes("");
                  setMinComments("");
                  setMinReadTime("");
                  setMaxReadTime("");
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
            {Array.from({ length: 6 }, (_, i) => i).map((id) => (
              <div key={`loading-skeleton-${id}`} className="card p-6 space-y-4">
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
