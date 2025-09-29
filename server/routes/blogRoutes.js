const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.filterBlogBody, blogController.createBlog);

router.get("/tag/:tag", blogController.getBlogsByTag);

// Slug route (must be before :id if patterns could overlap)
router.get("/slug/:slug", blogController.getBlogBySlug);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.filterBlogBody, blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
