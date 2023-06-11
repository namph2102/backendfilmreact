const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const argon2 = require("argon2");
const authResgisther = async (req, res) => {
  let { username, password } = req.body;

  try {
    const findUser = await UserModel.findOne({ username });
    if (!findUser?.username) {
      const accessToken = jwt.sign(
        { username },
        process.env.ACCESS_TOKEN_SECRET
      );
      const refreshToken = jwt.sign(
        { username },
        process.env.REFRESH_TOKEN_SECRET
      );
      password = await argon2.hash(password);
      const data = await UserModel.create({
        username,
        password,
        accessToken,
        refreshToken,
      });
      return res.status(200).json({
        data: data,
        status: 200,
        message: "Tạo tài khoản thành công !",
      });
    } else {
      res
        .status(203)
        .json({ status: 203, data: {}, message: "Tài khoản đã tồn tại!" });
    }
  } catch (err) {
    res.sendStatus(404);
  }
};
const authLogin = (req, res) => {
  // login wit have token;
  const token = req.headers["authorization"];
  // Bearer ['token']
  if (!token) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, account) => {
      if (err) return res.sendStatus(403);
      if (account?.username) {
        (async () => {
          const accessToken = jwt.sign(
            { username: account.username },
            process.env.ACCESS_TOKEN_SECRET
          );
          const data = await UserModel.findOneAndUpdate(
            {
              username: account.username,
            },
            { $set: { accessToken } }
          ).populate("icons");
          if (data) {
            res.status(200).json({ data, status: 200 });
          } else {
            res.status(203).json({ message: "Account  empty", status: 203 });
          }
        })();
      } else {
        res.status(401).json({ message: "Check account empty!", status: 401 });
      }
    });
  } catch (err) {
    res.sendStatus(401);
  }
};

const Authorization = async (req, res, next) => {
  try {
    const username = req.body.data.username;
    const account = await UserModel.findOne({ username });
    if (account) {
      if (account?.permission == "admin") {
        next();
        return;
      }
    }

    const token = req.headers["authorization"];
    if (!token) {
      throw new Error("Invalid");
    } else
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        { username },
        (err, _) => {
          if (err) {
            res.json({
              status: 202,
              message: "Bạn không được sử dụng quyền này!",
            });
            return;
          }
          next();
          return;
        }
      );
  } catch (err) {
    res.json({
      status: 202,
      message: "Bạn không được sử dụng quyền này!",
    });
  }
};
// phân quyền cho trang admin
const AuthorizationAdmin = async (req, res, next) => {
  try {
    console.log("AuthorizationAdmin");
    if (req?.cookies?.username) {
      console.log("Your username của bạn là :", req.cookies.username);
      const account = await UserModel.findOne({
        username: req.cookies.username,
      });
      if (account) {
        if (account.permission == "admin") {
          next();
          return;
        } else {
          throw new Error("Bạn không có quyền truy cập trang này !");
        }
      }
      throw new Error("Tài khoản của bạn không tồn tại  !");
    }
    throw new Error("Bạn chưa đăng nhập !");
  } catch (err) {
    res.render("login", { layout: false });
  }
};
// xác thực
const AuthenzationAdmin = async (req, res, next) => {
  try {
    console.log("Xác thực người dùng của trang admin");
    if (req?.cookies?.username) {
      console.log("Your username của bạn là :", req.cookies.username);
      const account = await UserModel.findOne({
        username: req.cookies.username,
      });
      if (account) {
        if (account.permission == "admin") {
          next();
          return;
        } else {
          throw new Error("Bạn không có quyền Thay đổi dữ liệu !");
        }
      }
      throw new Error("Tài khoản của bạn không tồn tại  !");
    }
    throw new Error(2);
  } catch (err) {
    if (err.message == 2) {
      res.redirect("/");
    } else res.status(404).json({ message: err.message });
  }
};
module.exports = {
  authResgisther,
  authLogin,
  Authorization,
  AuthorizationAdmin,
  AuthenzationAdmin,
};
