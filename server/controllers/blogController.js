const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

// Middleware to set default query params (optional enhancement later)
exports.aliasRecent = (req, res, next) => {
  if (!req.query.sort) req.query.sort = "-createdAt";
  if (!req.query.limit) req.query.limit = "20";
  next();
};

// List blogs with pagination, optional search and minimal mode
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const sort = req.query.sort || "-createdAt";
  const minimal = req.query.minimal === "true";
  const selectFields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : null;

  // Base filter: only published (public API)
  const filter = { isPublished: true };

  // Tag filtering (?tags=tag1,tag2)
  if (req.query.tags) {
    const tags = req.query.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length) filter.tags = { $in: tags };
  }

  // Basic search (?q=keyword) - case-insensitive title or content prefix/contains
  if (req.query.q) {
    const q = req.query.q.trim();
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }

  const totalItems = await Blog.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  // If requested page beyond range, return empty but with metadata
  let docsQuery = Blog.find(filter).sort(sort).skip(skip).limit(limit);

  if (minimal) {
    docsQuery = docsQuery.select(
      "title author createdAt slug estimatedReadTime tags"
    );
  } else if (selectFields) {
    docsQuery = docsQuery.select(selectFields);
  } else {
    // Default exclude heavy internal fields if any later
    docsQuery = docsQuery.select("-__v");
  }

  const blogs = await docsQuery.lean();

  // Attach excerpt in minimal mode if not already selected
  if (minimal) {
    blogs.forEach((b) => {
      if (b.content && !b.excerpt) {
        b.excerpt =
          b.content.replace(/\n+/g, " ").slice(0, 180) +
          (b.content.length > 180 ? "…" : "");
        delete b.content; // keep payload light
      }
    });
  }

  res.status(200).json({
    status: "success",
    metadata: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    results: blogs.length,
    data: { blogs },
  });
});
// Single blog retrieval with optional population of author user
exports.getBlog = factory.getOne(Blog, {
  path: "authorUser",
  select: "name role",
});

exports.filterBlogBody = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") return next();
  const allowed = [
    "title",
    "author",
    "content",
    "tags",
    "coverImage",
    "isPublished",
  ];
  const filtered = {};
  allowed.forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(req.body, f))
      filtered[f] = req.body[f];
  });
  req.body = filtered;
  next();
};

// If authenticated, attach current user as authorUser on creation
exports.setAuthorFromUser = (req, _res, next) => {
  if (req.user && !req.body.authorUser) {
    req.body.authorUser = req.user._id;
    // Fallback: if no explicit author string provided, default to user name
    if (!req.body.author && req.user.name) req.body.author = req.user.name;
  }
  next();
};

// Restrict blog modifications to owner (authorUser) or admin
exports.restrictBlogOwnership = catchAsync(async (req, _res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  if (req.user.role === "admin") return next();
  const blogId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(blogId))
    return next(new AppError("Invalid blog ID", 400));
  const blog = await Blog.findById(blogId).select("authorUser");
  if (!blog) return next(new AppError("No blog found with that ID", 404));
  if (!blog.authorUser || blog.authorUser.toString() !== req.user.id) {
    return next(new AppError("You do not own this blog post", 403));
  }
  next();
});

exports.createBlog = factory.createOne(Blog);
exports.updateBlog = factory.updateOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);

// Additional custom controller example (e.g., list by tag)
exports.getBlogsByTag = catchAsync(async (req, res, next) => {
  const tag = req.params.tag;
  const blogs = await Blog.find({ tags: tag, isPublished: true });
  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: { blogs },
  });
});

// Get blog by slug (more frontend-friendly than id)
exports.getBlogBySlug = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
    .populate({ path: "authorUser", select: "name role" })
    .populate({ path: "comments.user", select: "name role" });
  if (!blog) {
    return next(new AppError("No blog found with that slug", 404));
  }
  res.status(200).json({
    status: "success",
    data: { blog },
  });
});

// Toggle like on a blog
exports.toggleLike = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  const blog = await Blog.findById(req.params.id).select("likes");
  if (!blog) return next(new AppError("No blog found with that ID", 404));
  const userId = req.user._id;
  const idx = blog.likes.findIndex((u) => u.toString() === userId.toString());
  let action;
  if (idx > -1) {
    blog.likes.splice(idx, 1);
    action = "unliked";
  } else {
    blog.likes.push(userId);
    action = "liked";
  }
  await blog.save({ validateBeforeSave: false });
  res
    .status(200)
    .json({ status: "success", action, likesCount: blog.likes.length });
});

// Add a comment
exports.addComment = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  const { content } = req.body;
  if (!content || !content.trim())
    return next(new AppError("Comment content required", 400));
  const blog = await Blog.findById(req.params.id).select("comments");
  if (!blog) return next(new AppError("No blog found with that ID", 404));
  blog.comments.push({
    user: req.user._id,
    authorName: req.user.name,
    content: content.trim(),
  });
  await blog.save();
  const newComment = blog.comments[blog.comments.length - 1];
  res.status(201).json({ status: "success", data: { comment: newComment } });
});

// Delete a comment (by comment author, blog owner, or admin)
exports.deleteComment = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  const { id, commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("Invalid blog ID", 400));
  const blog = await Blog.findById(id).select("comments authorUser");
  if (!blog) return next(new AppError("No blog found with that ID", 404));
  const comment = blog.comments.id(commentId);
  if (!comment) return next(new AppError("No comment found with that ID", 404));
  const isOwner = blog.authorUser && blog.authorUser.toString() === req.user.id;
  const isCommentAuthor =
    comment.user && comment.user.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isCommentAuthor && !isAdmin) {
    return next(
      new AppError("You do not have permission to delete this comment", 403)
    );
  }
  comment.remove();
  await blog.save();
  res.status(204).json({ status: "success", data: null });
});
