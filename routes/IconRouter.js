const express = require("express");
const Router = express.Router();
const { AuthenzationAdmin } = require("../app/Authorization");
const IconController = require("../app/controller/IconsController");

Router.post("/addIcon", IconController.init);
Router.post("/editicon", IconController.editIcon);
Router.post("/addIconTouser", AuthenzationAdmin, IconController.addIconToUser);
module.exports = Router;
