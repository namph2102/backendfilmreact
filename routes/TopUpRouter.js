const express = require("express");
const Route = express.Router();
const TopUpController = require("../app/controller/TopUpController");
const { Authorization, AuthenzationAdmin } = require("../app/Authorization");
// path parent /topup
Route.post("/", Authorization, TopUpController.TopUp)
  .post("/userHistory", TopUpController.getHistoryToUser)
  .post(
    "/admin/checktopup",
    AuthenzationAdmin,
    TopUpController.handleTopUpPageAdmin
  )
  .delete("/admin/:idTopup", AuthenzationAdmin, TopUpController.deleteTopUp);
module.exports = Route;
