import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getBlogBySlug, toggleLike, addComment, deleteComment, updateBlog, deleteBlog } from "../services/blogService";
import { toggleBookmark, getBookmarks } from "../services/userService";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/Spinner";
import { notifyError } from "../utils/toast";
import { ROUTES } from "../routes/paths";
import { useAuth } from "../context/AuthContext";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data, loading, error, run } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [commentText, setCommentText] = useState("");
  const [uiState, setUiState] = useState({ likeBusy: false, saving: false, deleting: false, bookmarkBusy: false });
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (slug) {
      run(() => getBlogBySlug(slug)).catch((err) =>
        notifyError(err.message || "Failed to load post")
      );
    }
  }, [slug, run]);

  const blog = data?.data?.blog || data?.blog || data?.data?.data; // various response shapes
  const isOwner =
    user &&
    blog?.authorUser &&
    (blog.authorUser._id === user._id ||
      blog.authorUser.id === user._id ||
      blog.authorUser === user._id);
  const liked = !!(
    user && blog?.likes?.some((l) => l === user._id || l === user.id)
  );

  const refresh = useCallback(() => {
    if (slug) {
      run(() => getBlogBySlug(slug)).catch((err) =>
        notifyError(err.message || "Failed to refresh")
      );
    }
  }, [slug, run]);

  const loadBookmarkState = useCallback(async () => {
    if (!user || !blog?._id) {
      setBookmarked(false);
      return;
    }
    try {
      const res = await getBookmarks();
      const list = res.data?.bookmarks || res.bookmarks || res.data?.data?.bookmarks || [];
      setBookmarked(list.some(b => b._id === blog._id));
    } catch (_) {
      /* silent */
    }
  }, [user, blog?._id]);

  useEffect(() => { loadBookmarkState(); }, [loadBookmarkState]);

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

  const actionHandlers = {
    toggleLike: async () => {
      if (!user) {
        notifyError("Login to like posts");
        return;
      }
      if (uiState.likeBusy) return;
      setUiState((s) => ({ ...s, likeBusy: true }));
      try {
        await toggleLike(blog._id);
        refresh();
      } catch (e) {
        notifyError(e.message || "Failed to like");
      } finally {
        setUiState((s) => ({ ...s, likeBusy: false }));
      }
    },
    startEdit: () => {
      setEditTitle(blog.title);
      setEditContent(blog.content);
      setEditing(true);
    },
    save: async () => {
      if (!editTitle.trim() || !editContent.trim()) {
        notifyError("Title and content required");
        return;
      }
      setUiState((s) => ({ ...s, saving: true }));
      try {
        await updateBlog(blog._id, {
          title: editTitle.trim(),
          content: editContent.trim(),
        });
        setEditing(false);
        refresh();
      } catch (e) {
        notifyError(e.message || "Failed to save");
      } finally {
        setUiState((s) => ({ ...s, saving: false }));
      }
    },
    delete: async () => {
      if (!window.confirm("Delete this post? This cannot be undone.")) return;
      setUiState((s) => ({ ...s, deleting: true }));
      try {
        await deleteBlog(blog._id);
        navigate(ROUTES.HOME);
      } catch (e) {
        notifyError(e.message || "Failed to delete");
      } finally {
        setUiState((s) => ({ ...s, deleting: false }));
      }
    },
    addComment: async (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      try {
        await addComment(blog._id, commentText.trim());
        setCommentText("");
        refresh();
      } catch (e2) {
        notifyError(e2.message || "Failed to comment");
      }
    },
    deleteComment: async (cid) => {
      if (!window.confirm("Delete comment?")) return;
      try {
        await deleteComment(blog._id, cid);
        refresh();
      } catch (e) {
        notifyError(e.message || "Failed to delete comment");
      }
    },
    toggleBookmark: async () => {
      if (!user) {
        notifyError('Login to bookmark posts');
        return;
      }
      if (uiState.bookmarkBusy || !blog?._id) return;
      setUiState(s => ({ ...s, bookmarkBusy: true }));
      try {
        const r = await toggleBookmark(blog._id);
        if (r.action === 'added') setBookmarked(true); else if (r.action === 'removed') setBookmarked(false);
      } catch (e) {
        notifyError(e.message || 'Failed to toggle bookmark');
      } finally {
        setUiState(s => ({ ...s, bookmarkBusy: false }));
      }
    },
  };

  return (
    <article className="prose-blog max-w-3xl">
      <header className="not-prose mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3">
          {editing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-lg font-medium"
            />
          ) : (
            blog.title
          )}
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
          {blog.likes?.length ? (
            <>
              <span>•</span>
              <span>
                {blog.likes.length} like{blog.likes.length !== 1 ? "s" : ""}
              </span>
            </>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 not-prose">
          <button
            onClick={actionHandlers.toggleLike}
            disabled={uiState.likeBusy}
            className={`btn-outline text-xs ${
              liked ? "ring-2 ring-brand-500" : ""
            }`}
          >
            {liked ? "Unlike" : "Like"}
          </button>
          {isOwner && !editing && (
            <button
              onClick={actionHandlers.startEdit}
              className="btn-outline text-xs"
            >
              Edit
            </button>
          )}
          {user && (
            <button
              onClick={actionHandlers.toggleBookmark}
              disabled={uiState.bookmarkBusy}
              className={`btn-outline text-xs ${bookmarked ? 'ring-2 ring-brand-500' : ''}`}
            >
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          )}
          {isOwner && editing && (
            <>
              <button
                onClick={actionHandlers.save}
                disabled={uiState.saving}
                className={`btn-primary text-xs ${
                  uiState.saving ? "opacity-70" : ""
                }`}
              >
                {uiState.saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn-outline text-xs"
              >
                Cancel
              </button>
            </>
          )}
          {isOwner && (
            <button
              onClick={actionHandlers.delete}
              disabled={uiState.deleting}
              className={`btn-outline text-xs text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 ${
                uiState.deleting ? "opacity-60" : ""
              }`}
            >
              {uiState.deleting ? "Deleting..." : "Delete"}
            </button>
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
      {editing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={14}
          className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        />
      ) : (
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{
            __html: blog.content
              .split("\n")
              .map((p) => `<p>${p.replace(/</g, "&lt;")}</p>`)
              .join(""),
          }}
        />
      )}
      <section className="not-prose mt-10 space-y-6">
        <h2 className="text-lg font-semibold">Comments</h2>
        {user ? (
          <form onSubmit={actionHandlers.addComment} className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="Add a comment"
              className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-primary text-xs">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Log in to comment.
          </p>
        )}
        <ul className="space-y-4">
          {blog.comments?.length ? (
            blog.comments
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((c) => {
                const commentOwner =
                  user &&
                  (c.user?._id === user._id ||
                    c.user?.id === user._id ||
                    c.user === user._id);
                const canDelete =
                  commentOwner || isOwner || user?.role === "admin";
                return (
                  <li
                    key={c._id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded p-3 text-sm bg-white dark:bg-neutral-900"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                          {c.user?.name || c.authorName || "User"}
                        </p>
                        <p className="whitespace-pre-wrap mt-1 text-neutral-700 dark:text-neutral-300">
                          {c.content}
                        </p>
                        <time
                          className="block mt-1 text-xs text-neutral-500"
                          dateTime={c.createdAt}
                        >
                          {new Date(c.createdAt).toLocaleString()}
                        </time>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => actionHandlers.deleteComment(c._id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
          ) : (
            <p className="text-sm text-neutral-500">No comments yet.</p>
          )}
        </ul>
      </section>
    </article>
  );
}
