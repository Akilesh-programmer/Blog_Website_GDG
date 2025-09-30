const mongoose = require("mongoose");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// GET /users/bookmarks - list bookmarked blogs for current user
exports.getMyBookmarks = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  const user = await User.findById(req.user.id).populate({
    path: "bookmarks",
    select: "title slug author genre createdAt estimatedReadTime tags",
  });
  res.status(200).json({
    status: "success",
    results: user.bookmarks.length,
    data: { bookmarks: user.bookmarks },
  });
});

// POST /users/bookmarks/:blogId - toggle bookmark
exports.toggleBookmark = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  const { blogId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return next(new AppError("Invalid blog ID", 400));
  }
  const blogExists = await Blog.exists({ _id: blogId, isPublished: true });
  if (!blogExists) return next(new AppError("Blog not found", 404));

  const user = await User.findById(req.user.id).select("bookmarks");
  const idx = user.bookmarks.findIndex((b) => b.toString() === blogId);
  let action;
  if (idx > -1) {
    user.bookmarks.splice(idx, 1);
    action = "removed";
  } else {
    user.bookmarks.push(blogId);
    action = "added";
  }
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json({ status: "success", action, count: user.bookmarks.length });
});
