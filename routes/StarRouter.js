const express = require("express");
const Router = express.Router();
const StarController = require("../app/controller/StarController");
Router.post("/average", StarController.init);
Router.post("/add", StarController.addStar);
Router.post("/update", StarController.updateStar);

module.exports = Router;
