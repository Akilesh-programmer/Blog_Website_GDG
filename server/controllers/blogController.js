const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");

// Middleware to set default query params (optional enhancement later)
exports.aliasRecent = (req, res, next) => {
  if (!req.query.sort) req.query.sort = "-createdAt";
  if (!req.query.limit) req.query.limit = "20";
  next();
};

exports.getAllBlogs = factory.getAll(Blog);
exports.getBlog = factory.getOne(Blog);
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
