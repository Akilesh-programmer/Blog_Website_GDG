import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  getBlogBySlug,
  toggleLike,
  addComment,
  deleteComment,
  updateBlog,
  deleteBlog,
} from "../services/blogService";
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
  const [uiState, setUiState] = useState({
    likeBusy: false,
    saving: false,
    deleting: false,
    bookmarkBusy: false,
  });
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
      const list =
        res.data?.bookmarks || res.bookmarks || res.data?.data?.bookmarks || [];
      setBookmarked(list.some((b) => b._id === blog._id));
    } catch (_) {
      /* silent */
    }
  }, [user, blog?._id]);

  useEffect(() => {
    loadBookmarkState();
  }, [loadBookmarkState]);

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
        notifyError("Login to bookmark posts");
        return;
      }
      if (uiState.bookmarkBusy || !blog?._id) return;
      setUiState((s) => ({ ...s, bookmarkBusy: true }));
      try {
        const r = await toggleBookmark(blog._id);
        if (r.action === "added") setBookmarked(true);
        else if (r.action === "removed") setBookmarked(false);
      } catch (e) {
        notifyError(e.message || "Failed to toggle bookmark");
      } finally {
        setUiState((s) => ({ ...s, bookmarkBusy: false }));
      }
    },
  };

  return (
    <div className="max-w-4xl mx-auto mobile-padding">
      <article className="mobile-space lg:space-y-8">
        {/* Article Header */}
        <header className="space-y-6">
          {/* Title */}
          <div>
            {editing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-base text-2xl md:text-3xl font-bold w-full"
                placeholder="Enter post title..."
              />
            ) : (
              <h1 className="text-display-md text-gray-900 dark:text-gray-100">
                {blog.title}
              </h1>
            )}
          </div>

          {/* Author and Meta Information */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex-center text-white font-semibold text-lg">
                {blog.author?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {blog.author}
                </p>
                <div className="flex items-center gap-2 text-caption">
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {blog.estimatedReadTime && (
                    <>
                      <span>•</span>
                      <span>{blog.estimatedReadTime} min read</span>
                    </>
                  )}
                  {blog.likes?.length > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {blog.likes.length} like
                        {blog.likes.length !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Genre Badge */}
            {blog.genre && <span className="badge-primary">{blog.genre}</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap mobile-gap pt-4 border-t border-gray-200 dark:border-gray-800">
            {/* Like Button */}
            <button
              onClick={actionHandlers.toggleLike}
              disabled={uiState.likeBusy || !user}
              className={`btn-base touch-target flex items-center gap-2 ${
                liked
                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
                  : "btn-outline"
              }`}
            >
              <svg
                className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                fill={liked ? "currentColor" : "none"}
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
              {uiState.likeBusy ? "..." : liked ? "Liked" : "Like"}
              {blog.likes?.length > 0 && (
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                  {blog.likes.length}
                </span>
              )}
            </button>

            {/* Bookmark Button */}
            {user && (
              <button
                onClick={actionHandlers.toggleBookmark}
                disabled={uiState.bookmarkBusy}
                className={`btn-base touch-target flex items-center gap-2 ${
                  bookmarked
                    ? "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-400 dark:border-brand-800"
                    : "btn-outline"
                }`}
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
                {uiState.bookmarkBusy
                  ? "..."
                  : bookmarked
                  ? "Bookmarked"
                  : "Bookmark"}
              </button>
            )}

            {/* Edit Button */}
            {isOwner && !editing && (
              <button
                onClick={actionHandlers.startEdit}
                className="btn-secondary flex items-center gap-2"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            )}

            {/* Save/Cancel Buttons (Edit Mode) */}
            {isOwner && editing && (
              <>
                <button
                  onClick={actionHandlers.save}
                  disabled={uiState.saving}
                  className="btn-primary flex items-center gap-2"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {uiState.saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Delete Button */}
            {isOwner && (
              <button
                onClick={actionHandlers.delete}
                disabled={uiState.deleting}
                className="btn-outline text-error-600 border-error-300 hover:bg-error-50 dark:text-error-400 dark:border-error-600 dark:hover:bg-error-950/20 flex items-center gap-2 ml-auto"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {uiState.deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="card p-8">
          {editing ? (
            <div className="space-y-4">
              <label
                htmlFor="content-editor"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Content
              </label>
              <textarea
                id="content-editor"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={16}
                className="input-base resize-y min-h-[400px]"
                placeholder="Write your post content here..."
              />
            </div>
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
        </div>

        {/* Comments Section */}
        <section className="space-y-6">
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="text-display-sm text-gray-900 dark:text-gray-100 mb-6">
              Comments{" "}
              {blog.comments?.length > 0 && (
                <span className="text-body-sm text-gray-500 dark:text-gray-400 font-normal">
                  ({blog.comments.length})
                </span>
              )}
            </h2>

            {/* Add Comment Form */}
            {user ? (
              <div className="card p-6 mb-8">
                <form
                  onSubmit={actionHandlers.addComment}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex-center text-white text-sm font-semibold flex-shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        placeholder="Share your thoughts..."
                        className="input-base resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={!commentText.trim()}
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card p-6 mb-8 text-center">
                <p className="text-body-sm mb-4">
                  Join the conversation! Log in to leave a comment.
                </p>
                <Link to="/auth" className="btn-primary">
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {blog.comments?.length > 0 ? (
                blog.comments
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((comment) => {
                    const commentOwner =
                      user &&
                      (comment.user?._id === user._id ||
                        comment.user?.id === user._id ||
                        comment.user === user._id);
                    const canDelete =
                      commentOwner || isOwner || user?.role === "admin";

                    return (
                      <div key={comment._id} className="card p-6">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex-center text-white text-sm font-semibold flex-shrink-0">
                            {(
                              comment.user?.name ||
                              comment.authorName ||
                              "User"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {comment.user?.name ||
                                    comment.authorName ||
                                    "User"}
                                </p>
                                <time
                                  className="text-caption"
                                  dateTime={comment.createdAt}
                                >
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </time>
                              </div>
                              {canDelete && (
                                <button
                                  onClick={() =>
                                    actionHandlers.deleteComment(comment._id)
                                  }
                                  className="text-caption text-error-500 hover:text-error-700 hover:underline transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p className="text-body text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="card p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
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
                  </div>
                  <p className="text-body-sm">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
