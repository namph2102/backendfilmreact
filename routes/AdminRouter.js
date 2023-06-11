const express = require("express");
const router = express.Router();
const AdminController = require("../app/controller/AdminController");
const CountryController = require("../app/controller/CountryController");
const Categorycontroller = require("../app/controller/Categorycontroller");
const IconController = require("../app/controller/IconsController");
const {
  AuthorizationAdmin,
  AuthenzationAdmin,
} = require("../app/Authorization");
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
router
  .get("/", AuthorizationAdmin, AdminController.init)
  .get("/user/admin/login", AdminController.login)
  .get("/catelog", AdminController.PageCateLog)
  .get("/catelog/additem", AdminController.showAdd)
  .post(
    "/catelog/additem",
    AuthenzationAdmin,
    upload.array("uploadfile"),
    AdminController.AddFiml
  )
  .post("/category/delete", AuthenzationAdmin, AdminController.deleteCategory);

// router.get("/catelog/viewesopide",)

router
  .get(
    "/catelog/showEsopide/:_id",
    AuthenzationAdmin,
    AdminController.showAddEsopide
  )
  .post(
    "/catelog/showEsopide",
    AuthenzationAdmin,
    AdminController.showAddEsopide
  )
  .post("/catelog/addEsopide", AdminController.addEsopide);

router.post("/checkaccount", AdminController.checkAccount);

router
  .get("/user", AuthenzationAdmin, AdminController.showUser)
  .get("/user/edituser/:id", AuthenzationAdmin, AdminController.showUserEdit)
  .post(
    "/user/edituser/:id",
    AuthenzationAdmin,
    upload.single("uploadavata"),
    AdminController.showUserEdit
  )
  .post("/user/deleteicon", AuthenzationAdmin, AdminController.deleteIcon)
  .post(
    "/user/admin/changePassword",
    AuthenzationAdmin,
    AdminController.changePassword
  )
  .post(
    "/user/admin/getinfomation",
    AuthenzationAdmin,
    AdminController.getInfomationAccount
  );
router
  .get("/topup/show", AuthenzationAdmin, AdminController.ShowTopUp)
  .get("/topup/show/:id", AuthenzationAdmin, AdminController.ShowTopUp)
  .post("/topup/show", AuthenzationAdmin, AdminController.ShowTopUp);

router
  .get("/comment/show", AuthenzationAdmin, AdminController.showComment)
  .post("/comment/show", AuthenzationAdmin, AdminController.showComment);

router
  .get("/country/show", AuthenzationAdmin, CountryController.init)
  .get("/country/getall", AuthenzationAdmin, CountryController.getDataCountry)
  .post("/country/show", AuthenzationAdmin, CountryController.adminAddCountry)
  .delete("/country/:id", AuthenzationAdmin, CountryController.deleteCountry);

// category
router
  .get("/category/show", AuthenzationAdmin, Categorycontroller.showCategory)
  .post("/category/edit", AuthenzationAdmin, Categorycontroller.editCate)
  .delete("/category/:id", AuthenzationAdmin, Categorycontroller.deleteCate);

// icon
router
  .get("/icon/show", AuthenzationAdmin, IconController.showIconAdmin)
  .post("/icon/show", AuthenzationAdmin, IconController.showIconAdmin)
  .delete("/icon/delete/:id", AuthenzationAdmin, IconController.deleteIcon);

router
  .get("/login", (req, res) => {
    res.render("login", { layout: false });
  })
  .get("/admin/logout", (req, res) => {
    try {
      res.clearCookie("username");
      res.clearCookie("refreshToken");
      res.redirect("/");
    } catch (err) {
      res.redirect("/");
    }
  })
  //Page not found 404
  .get("/*", (req, res) => {
    res.render("pagenotfound", { layout: false });
  });
module.exports = { upload };
module.exports = router;
