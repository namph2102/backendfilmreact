const express = require("express");
const router = express.Router();
const BookmarkController = require("../app/controller/BookmarkController");
const { Authorization } = require("../app/Authorization");
// parent /bookmark
router.post("/", Authorization, BookmarkController.init);
router.post(
  "/addbookmark",
  Authorization,
  BookmarkController.handleAddBookMark
);
router.post(
  "/deletebookmark",
  Authorization,
  BookmarkController.handleRemoveBookMark
);
router.post(
  "/deleteallbookmark",
  Authorization,
  BookmarkController.handleRemoveAllBookMark
);

module.exports = router;
