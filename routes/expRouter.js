const ExpController = require("../app/controller/ExpController");
const express = require("express");
const Router = express.Router();
Router.get("/", ExpController.init);
Router.post("/addexpvip", ExpController.addExpVip);
Router.post("/addexplv", ExpController.addExpLv);
module.exports = Router;
