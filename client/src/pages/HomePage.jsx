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

  const load = useCallback(
    (p = page, q = search) => {
      run((signal) => getBlogs({ page: p, q, minimal: true, signal })).catch(
        (err) => notifyError(err.message || "Failed to load blogs")
      );
    },
    [run, page, search]
  );

  useEffect(() => {
    load(1, search); /* eslint-disable-next-line */
  }, [search]);
  useEffect(() => {
    load(page, search); /* eslint-disable-next-line */
  }, [page]);
  useEffect(() => {
    load(1, search); /* initial */
  }, []); // initial load

  const blogs = data?.data?.blogs || data?.blogs || []; // depending on interceptor shape
  const meta = data?.metadata;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Latest Posts</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query.trim());
            setPage(1);
          }}
          className="flex items-center gap-2"
          role="search"
        >
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm w-56"
          />
          <button type="submit" className="btn-primary text-sm">
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card h-40 animate-pulse bg-neutral-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">
          Failed to load posts: {error.message}
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div className="p-10 text-center border border-dashed rounded border-neutral-300 dark:border-neutral-700">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            No posts found{search ? " for your search." : " yet."}
          </p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setQuery("");
              }}
              className="btn-outline text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && !error && blogs.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}
