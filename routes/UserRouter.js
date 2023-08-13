const express = require("express");
const Routers = express.Router();
const UserController = require("../app/controller/UserController");

const {
  authResgisther,
  authLogin,
  Authorization,
  AuthenzationAdmin,
} = require("../app/Authorization");

// path parent /user
Routers.get("/login", authLogin)
  .post("/register", authResgisther)
  .post("/login", UserController.login) // login when logout
  .post("/handlefirebase", UserController.handleWithFireBase)
  .post("/information", UserController.getInformation)
  .post("/updateProfile", Authorization, UserController.updateProfile)
  .post("/updateAvatar", UserController.updateAvatarUser)
  .post("/block", UserController.blockUser)
  .post("/changePassword", Authorization, UserController.changePassword)
  .post("/getListUserRank", UserController.getListUserRank)
  .post("/deleteUser", AuthenzationAdmin, UserController.deleUser);

module.exports = Routers;
