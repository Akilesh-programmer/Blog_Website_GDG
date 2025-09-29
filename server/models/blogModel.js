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
    slug: String,
    author: {
      type: String,
      required: [true, "A blog post must have an author name"],
      trim: true,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });

blogSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
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
module.exports = Blog;
