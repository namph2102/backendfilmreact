const UserModel = require("../models/UserModel");
const ExpVipModel = require("../models/ExpVipModel");
const ExpLvModel = require("../models/ExpLvModel");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const uniqid = require("uniqid");
const path = require("path");
const UserUpdate = require("../utils/UserUtil");

const CommentModel = require("../models/CommemtModel");
const TopUpModel = require("../models/TopupModel");
const BookMarkModel = require("../models/BookMarkModel");

class UserController {
  async login(req, res) {
    try {
      const { username, password } = req.body.account;
      const account = await UserModel.findOne({ username: username }).populate(
        "icons"
      );

      if (!account)
        return res
          .status(203)
          .json({ success: true, message: "Tài khoản không tồn tại" });
      if (
        account.uid &&
        (await argon2.verify(account.password, process.env.FISEBASE_PASSWORD))
      ) {
        const newpassword = await argon2.hash(password);
        const AccountUpdate = await UserModel.findOneAndUpdate(
          { _id: account._id },
          { password: newpassword }
        ).populate("icons");
        return res.status(202).json({
          status: 202,
          success: true,
          message: "Mật khẩu của bạn đã được cập nhập !",
          account: AccountUpdate,
        });
      }
      if (await argon2.verify(account.password, password)) {
        return res.status(202).json({
          status: 202,
          success: true,
          message: "Đăng nhập thành công!",
          account,
        });
      } else {
        return res.status(203).json({
          status: 203,
          success: false,
          message: "Mật khẩu chưa chính xác!",
          account: "",
        });
      }
    } catch (err) {
      return res.status(203).json({
        status: 403,
        success: false,
        message: "Đăng nhập thất bại!",
      });
    }
  }
  async handleWithFireBase(req, res) {
    const { uid, username, fullname, phone, avata } = req.body.account;
    const isCheckAccount = await UserModel.findOne({ uid }).populate("icons");

    if (!isCheckAccount) {
      const accessToken = jwt.sign(
        { username },
        process.env.ACCESS_TOKEN_SECRET
      );
      const refreshToken = jwt.sign(
        { username },
        process.env.REFRESH_TOKEN_SECRET
      );
      const password = await argon2.hash(process.env.FISEBASE_PASSWORD);
      const newaccount = {
        ...req.body.account,
        password,
        accessToken,
        refreshToken,
      };
      const creatAccount = await UserModel.create(newaccount);
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Đăng nhập thành công !",
        account: creatAccount,
      });
    }
    return res.status(200).json({
      success: true,
      status: 202,
      notice: "Tài khoản có sẳn trong database",
      message: "Đăng nhập thành công !",
      account: isCheckAccount,
    });
  }

  async getInformation(req, res) {
    try {
      const { idUser } = req.body.data;
      const account = await UserModel.findById({ _id: idUser })
        .populate("nameLevel")
        .populate("icons")
        .select(
          "fullname phone avata expLv nameLevel expVip coin permission description icons vip  blocked updatedAt createdAt"
        );

      if (!account) throw new Error("Không tồn tại account");
      const [nextExpLevel, nextExpVip] = await Promise.all([
        ExpLvModel.findOne({ musty: { $gt: account.expLv } }).select("musty"),
        ExpVipModel.findOne({ musty: { $gt: account.expVip } }).select("musty"),
      ]);
      res.status(200).json({
        account,
        nextExpLevel: nextExpLevel ? nextExpLevel.musty : account.expLv,
        nextExpVip: nextExpVip ? nextExpVip.musty : account.expVip,
      });
    } catch (err) {
      console.log(err.message);
      res.status(222).json({ message: err.message, status: 222 });
    }
  }
  async getListUserRank(req, res) {
    try {
      const { idUser, getall } = req.body.data;

      if (getall) {
        // admin page user;
        const listUser = await UserModel.find()
          .sort({ expLv: -1 })
          .populate("nameLevel")
          .populate("icons");

        res
          .status(200)
          .json({ listUser, message: "All list user admin", status: 200 });
        return;
      }
      const account =
        (idUser &&
          (await UserModel.findById({ _id: idUser })
            .populate("nameLevel")
            .populate("icons")
            .select(
              "fullname nameLevel username _id expLv icons expVip permission vip avata createdAt updatedAt"
            ))) ||
        "";

      const listUser = await UserModel.find()
        .sort({ expLv: -1 })
        .populate("nameLevel")
        .populate("icons")
        .select(
          "fullname nameLevel username _id expLv icons expVip permission vip avata createdAt"
        );
      res.status(200).json({ listUser, account });
    } catch (err) {
      console.log(err.message);
    }
  }
  async updateProfile(req, res) {
    console.log(req.body.data);
    try {
      const {
        fullname = "",
        phone = "",
        description = "",
        _id,
      } = req.body.data;
      if (!_id) {
        throw new Error("id is not found in profile");
      }

      await UserModel.findOneAndUpdate(
        { _id },
        { fullname, phone, description }
      );
      const account = await UserModel.findById({ _id }).select(
        "fullname phone description"
      );
      if (!account) throw new Error("không tìm thấy");
      res.status(200).json({
        status: 200,
        success: true,
        message: "Cập nhập thành công thông tin user !",
        account,
      });
    } catch (err) {}
  }
  async updateAvatarUser(req, res) {
    let { _id, avata } = req.body.data;
    try {
      if (!_id) {
        throw new Error("Dữ liệu chưa đầy đủ");
      }
      const checkAccount = await UserModel.findById({ _id });
      if (!checkAccount) {
        throw new Error("Tài khoản không tồn tại");
      } else UserUpdate.removeImage(checkAccount.avata);

      const filename = uniqid() + ".png";
      const filepath = path.join("public", "uploads", filename);
      var base64Data = avata.replace(/^data:image\/png;base64,/, "");
      const linkavata = UserUpdate.plusLinkImage(filename);
      fs.writeFile(filepath, base64Data, "base64", async function (err) {
        if (err) throw new Error("Upload ảnh không thành công");
        console.log(linkavata);
        await UserModel.findByIdAndUpdate({ _id }, { avata: linkavata });
        res.status(200).json({
          message: "oke",
        });
      });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async blockUser(req, res) {
    try {
      const { _id, blocked } = req.body.data;
      console.log(req.body.data);
      await UserModel.findByIdAndUpdate({ _id }, { blocked });
      res.status(200).json({
        status: 200,
        message: blocked
          ? "Khóa tài khoản thành công !"
          : "Mở khóa tài khoản thành công!",
      });
    } catch (err) {
      console.log(err.message);
      res.status(200).json({ status: 200, message: "Thao tác block thất bại" });
    }
  }
  async deleUser(req, res) {
    try {
      const { _id } = req.body.data;
      console.log("Xóa ID USer", _id);

      if (!_id) throw new Error("ID không tồn tại !");
      const account = await UserModel.findByIdAndDelete({ _id });
      if (!account) throw new Error("Tài khoản không tồn tại !");
      await Promise.all([
        UserUpdate.removeImage(account.avata),
        CommentModel.deleteMany({ user_comment: _id }),
        TopUpModel.deleteMany({ account: _id, status: 3 }),
        BookMarkModel.deleteMany({ username: account.username }),
      ]);
      res.status(200).json({ message: "Xóa thành công user" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { _id, oldPassword, newPassword } = req.body.data;
      console.log(req.body.data);
      if (!oldPassword || !newPassword) {
        throw new Error("Dữ liệu chưa đầy đủ!");
      }
      const account = await UserModel.findById({ _id });
      if (!account) throw new Error("Tài khoản không tồn tại");

      if (await argon2.verify(account.password, oldPassword)) {
        const passwordHash = await argon2.hash(newPassword);
        await UserModel.findByIdAndUpdate({ _id }, { password: passwordHash });
        res
          .status(200)
          .json({ message: "Thay đổi mật khẩu thành công !", status: 200 });
      } else {
        throw new Error("Mật khẩu không chính xác");
      }
    } catch (err) {
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
}
module.exports = new UserController();
