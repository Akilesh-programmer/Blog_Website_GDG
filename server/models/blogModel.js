const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A blog post must have a title"],
      trim: true,
      maxlength: [
        120,
        "A blog title must have less or equal than 120 characters",
      ],
      minlength: [3, "A blog title must have more or equal than 3 characters"],
    },
    slug: {
      type: String,
      index: true,
    },
    author: {
      type: String,
      required: [true, "A blog post must have an author name"],
      trim: true,
    },
    // Reference to owning user (set automatically when authenticated user creates a blog)
    authorUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "A blog post must have content"],
      minlength: [50, "Content should be at least 50 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
    // Future: link to a User via ObjectId when auth added
    estimatedReadTime: Number,
    coverImage: String,
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    // Users who liked the post (for quick toggle). Using array for simplicity.
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    // Embedded comments (lightweight for this task). Could be normalized later.
    comments: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        authorName: { type: String, trim: true }, // fallback display name if user ref not populated
        content: { type: String, required: true, minlength: 1, maxlength: 2000 },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ createdAt: -1 });

blogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  const base = slugify(this.title, { lower: true, strict: true });
  let candidate = base;
  let counter = 1;
  // Collision handling
  while (await this.constructor.findOne({ slug: candidate })) {
    candidate = `${base}-${counter++}`;
  }
  this.slug = candidate;
  next();
});

blogSchema.pre("save", function (next) {
  if (!this.isNew) this.updatedAt = Date.now();
  if (this.content) {
    const words = this.content.split(/\s+/).length;
    // Approx 200 wpm reading speed
    this.estimatedReadTime = Math.ceil(words / 200);
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

// Virtual excerpt (first 180 chars plain text)
blogSchema.virtual("excerpt").get(function () {
  if (!this.content) return "";
  return (
    this.content.replace(/\n+/g, " ").slice(0, 180) +
    (this.content.length > 180 ? "…" : "")
  );
});
module.exports = Blog;
