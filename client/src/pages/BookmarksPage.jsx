import { useEffect } from 'react';
import { getBookmarks } from '../services/userService';
import { useApi } from '../hooks/useApi';
import Spinner from '../components/Spinner';
import BlogCard from '../components/BlogCard';
import { notifyError } from '../utils/toast';

export default function BookmarksPage() {
  const { data, loading, error, run } = useApi();

  useEffect(() => {
    run(() => getBookmarks()).catch(e => notifyError(e.message || 'Failed to load bookmarks'));
  }, [run]);

  const bookmarks = data?.data?.bookmarks || data?.bookmarks || data?.data?.data?.bookmarks || [];

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 tracking-tight">Bookmarked Posts</h1>
      {bookmarks.length === 0 ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">You have no bookmarks yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map(b => <BlogCard key={b._id} blog={b} />)}
        </div>
      )}
    </div>
  );
}