const express = require("express");
const router = express.Router();
const { Authorization, AuthenzationAdmin } = require("../app/Authorization");
const CommentController = require("../app/controller/CommemtController");
// path parent /comments
router.post("/list", CommentController.init);
router.get("/list", CommentController.init);
router.post("/subcomment", CommentController.handleSubcommemt);
router.post("/addlike", CommentController.handleLike);
router.post("/addcommemt", CommentController.handleAddCommemt);

// phân quyền người dùng
router.post(
  "/user/delete",
  Authorization,
  CommentController.handleDeletecommemt
);
router.post(
  "/admin/delete",
  AuthenzationAdmin,
  CommentController.handleDeletecommemt
);

router.put(
  "/user/update",
  Authorization,
  CommentController.handleUpdateComment
);
module.exports = router;
