const express = require("express");
const Router = express.Router();
const { AuthenzationAdmin } = require("../app/Authorization");
const IconController = require("../app/controller/IconsController");
const multer = require("multer");
const uniqid = require("uniqid");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file) {
      cb(null, path.join("public", "uploads"));
    }
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(
        null,
        uniqid.time() +
          Math.floor(Math.random() * 5555) +
          path.extname(file.originalname)
      );
    }
  },
});

const upload = multer({ storage: storage });
// path parent /icon
Router.post("/addIcon", upload.single("uploads"), IconController.init);
Router.post("/editicon", upload.single("uploads"), IconController.editIcon);
Router.post("/addIconTouser", AuthenzationAdmin, IconController.addIconToUser);
module.exports = Router;
