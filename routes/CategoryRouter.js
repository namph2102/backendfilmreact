const express = require("express");
const router = express.Router();
const CategoryController = require("../app/controller/Categorycontroller");
const { AuthorizationAdmin } = require("../app/Authorization");

// path parent category
router
  .get("/", CategoryController.init)
  .post("/addcate", CategoryController.addCate);
module.exports = router;
