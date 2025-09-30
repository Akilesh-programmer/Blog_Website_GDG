import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createBlog } from "../services/blogService";
import { notifyError, notifySuccess } from "../utils/toast";
import { ROUTES } from "../routes/paths";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !genre.trim()) {
      notifyError("Title, genre and content are required");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        content: content.trim(),
        genre: genre.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await createBlog(body);
      notifySuccess("Post created");
      const slug =
        res?.data?.data?.slug ||
        res?.data?.data?.slug ||
        res?.data?.data?.data?.slug; // various shapes
      if (slug) navigate(ROUTES.BLOG_DETAIL(slug));
      else navigate(ROUTES.HOME);
      setTitle("");
      setGenre("");
      setContent("");
      setTags("");
    } catch (err) {
      notifyError(err.message || "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mobile-padding">
      <div className="mobile-space lg:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-display-md text-gray-900 dark:text-gray-100 mb-4">
            Create New Post
          </h1>
          <p className="text-body-lg max-w-2xl mx-auto">
            Share your thoughts, insights, and stories with the community
          </p>
        </div>

        {/* Form */}
        <div className="card mobile-padding lg:p-8">
          <form
            onSubmit={onSubmit}
            className="mobile-form-spacing lg:space-y-8"
          >
            {/* Title */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="title"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-base text-lg font-medium"
                placeholder="Enter an engaging title for your post..."
                required
              />
              <p className="text-caption mt-1">
                A compelling title helps readers understand what your post is
                about
              </p>
            </div>

            {/* Genre and Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="genre"
                >
                  Genre *
                </label>
                <input
                  id="genre"
                  type="text"
                  value={genre}
                  placeholder="e.g. Technology, Lifestyle, Tutorial"
                  onChange={(e) => setGenre(e.target.value)}
                  className="input-base"
                  required
                />
                <p className="text-caption mt-1">
                  Help readers find your content by category
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="tags"
                >
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input-base"
                  placeholder="react, javascript, tutorial (comma-separated)"
                />
                <p className="text-caption mt-1">
                  Add relevant tags to improve discoverability
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="content"
              >
                Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="input-base resize-y min-h-[400px] font-mono text-sm leading-relaxed"
                placeholder="Write your post content here. Use plain text - paragraphs will be separated by blank lines..."
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-caption">
                  Use plain text. Paragraphs separated by blank lines.
                </p>
                <p className="text-caption">
                  {content.length > 0 &&
                    `${Math.ceil(content.split(" ").length / 200)} min read`}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                disabled={submitting}
                type="submit"
                className="btn-primary btn-lg flex-1 sm:flex-none focus-ring"
                aria-describedby={submitting ? "publishing-status" : undefined}
              >
                {submitting ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a.677.677 0 010 1.292L12 6.646a.677.677 0 010-1.292zm0 15.292L12 19.646a.677.677 0 010-1.292l0-1a.677.677 0 010 1.292zm-7.071-7.071L5.929 12l-1 1a.677.677 0 01-1.292 0l1-1a.677.677 0 011.292 0zm14.142 0a.677.677 0 010 1.292l-1 1a.677.677 0 01-1.292 0l1-1a.677.677 0 011.292 0z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
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
                    Publish Post
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setGenre("");
                  setContent("");
                  setTags("");
                }}
                className="btn-secondary"
                disabled={submitting}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Form
              </button>

              <Link to="/" className="btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
