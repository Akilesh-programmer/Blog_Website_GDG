import { useState } from "react";
import { createBlog } from "../services/blogService";
import { notifyError, notifySuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/paths";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !content.trim()) {
      notifyError("Title, author and content are required");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
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
      setAuthor("");
      setContent("");
      setTags("");
    } catch (err) {
      notifyError(err.message || "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-y"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Use plain text. Paragraphs separated by blank lines.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            disabled={submitting}
            type="submit"
            className={`btn-primary ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setAuthor("");
              setContent("");
              setTags("");
            }}
            className="btn-outline"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
