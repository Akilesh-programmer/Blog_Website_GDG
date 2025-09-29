const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    blogController.filterBlogBody,
    blogController.setAuthorFromUser,
    blogController.createBlog
  );

router.get("/tag/:tag", blogController.getBlogsByTag);

// Slug route (must be before :id if patterns could overlap)
router.get("/slug/:slug", blogController.getBlogBySlug);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    blogController.restrictBlogOwnership,
    blogController.filterBlogBody,
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    blogController.restrictBlogOwnership,
    blogController.deleteBlog
  );

// Likes
router.post("/:id/like", authController.protect, blogController.toggleLike);

// Comments
router.post("/:id/comments", authController.protect, blogController.addComment);
router.delete(
  "/:id/comments/:commentId",
  authController.protect,
  blogController.deleteComment
);

module.exports = router;
