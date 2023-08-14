const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const FimlModel = require("../models/FimlModel");
const FimlDeltailModel = require("../models/FimlDeltailModel");

const CommentModel = require("../models/CommemtModel");
const IconModel = require("../models/IconModel");
const moment = require("moment");
const TopUpModel = require("../models/TopupModel");
const Util = require("../utils/UserUtil");

const timeExpires = 3600 * 5 * 1000; // 5 tiếng
const handleSlug = require("slug");
const CountryController = require("../controller/CountryController");
const fs = require("fs");
const argon = require("argon2");
const { default: CloudinaryServices } = require("../../services");
const makeUpNumber = (number = 0) => {
  return number ? number.toLocaleString("en-vi") : 0;
};

class AdminController {
  async init(req, res) {
    try {
      const date = new Date();
      const DaySubtract = date.getDate();
      const getTotalViews = FimlModel.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$view" },
          },
        },
      ]);
      const commentInMonth = CommentModel.find({
        createdAt: { $gte: moment().subtract(DaySubtract, "days") },
      }).count();
      const accountInMonth = UserModel.find({
        createdAt: { $gte: moment().subtract(DaySubtract, "days") },
      }).count();

      const getTopupInMonth = TopUpModel.aggregate([
        {
          $match: {
            status: 2,
          },
        },
        {
          $group: {
            _id: null,
            topupInMonth: { $sum: "$money" },
          },
        },
      ]);

      const [
        [{ totalViews = 0 }],
        totalComment = 0,
        totalAccount = 0,
        [{ topupInMonth = 0 }],
      ] = await Promise.all([
        getTotalViews,
        commentInMonth,
        accountInMonth,
        getTopupInMonth,
      ]);
      const [listFilmTop, listLastFilm, TopUser, TopUp] = await Promise.all([
        FimlModel.find()
          .sort({ view: -1 })
          .limit(5)
          .select("view star like")
          .lean(),
        FimlModel.find()
          .sort({ updatedAt: -1 })
          .limit(5)
          .select("view star like")
          .lean(),
        UserModel.find()
          .sort({ expLv: -1 })
          .limit(5)
          .populate("nameLevel")
          .select("vip nameLevel coin")
          .lean(),
        TopUpModel.find({ status: 1 }).sort({ money: -1 }).lean(),
      ]);

      listFilmTop &&
        listFilmTop.forEach((item) => {
          item.view = makeUpNumber(item?.view);
          item.like = makeUpNumber(item?.like);
          item.star = makeUpNumber(item?.star);
        });
      listLastFilm &&
        listLastFilm.forEach((item) => {
          item.view = makeUpNumber(item?.view);
          item.like = makeUpNumber(item?.like);
          item.star = makeUpNumber(item?.star);
        });
      TopUser &&
        TopUser.forEach((user) => {
          user.coin = makeUpNumber(user?.coin);
        });
      TopUp &&
        TopUp.forEach((item) => {
          item.money = makeUpNumber(item?.money);
          item.createdAt = moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss");
        });
      res.render("home", {
        title: "Dashboard",
        dashboard: true,
        totalViews: makeUpNumber(totalViews),
        totalComment: makeUpNumber(totalComment),
        totalAccount: makeUpNumber(totalAccount),
        topupInMonth: makeUpNumber(topupInMonth),
        listFilmTop,
        listLastFilm,
        TopUser,
        TopUp,
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  async login(req, res) {
    try {
      if (req?.cookies?.username) {
        const account = await UserModel.findOne({
          username: req.cookies.username,
        }).select("avata fullname username permission");
        if (account) {
          res.status(200).json({ account, status: 200 });
          return;
        }
      }
      throw new Error("Bạn chưa đăng nhập nhé!");
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message, status: 404 });
    }
  }

  // film
  async PageCateLog(req, res) {
    res.render("cate/catelog", { catelogpage: true, title: "CateLog" });
  }
  async showAdd(req, res) {
    try {
      const { idFilm } = req.query;
      const film = await FimlModel.findById({ _id: idFilm })
        .populate("category")
        .populate("country")
        .lean();
      if (!film) {
        throw new Error("Add New Film ");
      }

      res.render("cate/additem", {
        catelogpage: true,
        title: "Edit film ",
        ...film,
      });
    } catch (err) {
      res.render("cate/additem", { catelogpage: true, title: "Add New Film " });
    }
  }
  async AddFiml(req, res) {
    let data, film, message;
    try {
      let {
        name,
        origin_name = "",
        description,
        categories = [],
        time,
        year,
        country,
        kind,
        eposode_total,
        episode_current,
        status,
        quanlity,
        lang,
        idFilm,
        thumb_url,
        poster_url = "/images/poster.png",
        thumb__path = "",
        poster_path = "",
      } = req.body;

      // nếu không phải edit check extend film follow name
      if (!idFilm) {
        const Checkfiml = await FimlModel.findOne({
          name: Util.coverCapitalize(name),
        });
        if (Checkfiml) {
          throw new Error(`Phim ${name} đã tồn tại trong database`);
        }
      }
      country = await CountryController.addCountry(
        Util.replaceManySpace(country).toLowerCase()
      );

      if (!time || !year || !description || !name || !categories) {
        throw new Error("Thiếu dữ liệu hãy kiểm tra lại");
      }
      if (idFilm) {
        film = await FimlModel.findById(idFilm).populate("category");
        if (!film) {
          throw new Error("Không tìm thấy phim theo yêu cầu");
        }
      }
      data = {
        name: Util.coverCapitalize(name),
        slug: handleSlug(name),
        origin_name: Util.coverCapitalize(origin_name),
        description: Util.replaceManySpace(description),
        time: Util.replaceManySpace(time),
        year: Util.replaceManySpace(year),
        category: categories,
        country,
        kind: kind == "trailer" ? "feature" : kind,
        trailer: kind == "trailer",
        status,
        eposode_total: eposode_total || 1,
        episode_current: episode_current || 1,
        quanlity,
        lang,
        thumb_url,
        poster_url,
        thumb__path,
        poster_path,
      };

      if (!idFilm) {
        film = await FimlModel.create(data);
        message = "Tạo thành công Phim mới";
      } else {
        let categoryNotExtend = [];
        if (typeof categories == "string") {
          if (!film.category.find((item) => item._id == categories)) {
            categoryNotExtend = [categories];
          }
        } else {
          categoryNotExtend =
            categories.filter(
              (cate) => !film.category.find((item) => item._id == cate)
            ) || [];
        }
        delete data["category"];

        await FimlModel.updateOne({ _id: idFilm }, data);

        if (categoryNotExtend?.length > 0) {
          await FimlModel.updateOne(
            { _id: film },
            {
              $push: { category: categoryNotExtend },
            }
          );
        }
        message = "Chỉnh sửa thành công !";
      }
      film = await FimlModel.findById(film._id || idFilm)
        .populate("category")
        .populate("country")
        .lean();
      if (film) {
        res.render("cate/additem", {
          catelogpage: true,
          title: "Edit film",
          message,
          ...film,
        });
      } else {
        throw new Error("Không tồn tại phim này");
      }
    } catch (err) {
      res.render("cate/additem", {
        catelogpage: true,
        title: "Add New Film",
        error: err.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { idFilm, idCate } = req.body;
      await FimlModel.updateOne(
        { _id: idFilm },
        {
          $pull: {
            category: idCate,
          },
        }
      );
      res.status(200).json({ message: "Xóa thành công" });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: "Xóa thất bại !", error: err.message });
    }
  }
  async checkAccount(req, res) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new Error("Dữ liệu thiếu");
      }
      const account = await UserModel.findOne({ username });
      if (!account) {
        throw new Error("Tài khoản không tồn tại!");
      }
      if (account.permission !== "admin") {
        throw new Error("Tài khoản không có quyền truy cập trang admin!");
      }
      if (await argon2.verify(account.password, password)) {
        res.cookie("username", username, {
          expires: new Date(Date.now() + timeExpires),
        });
        res.cookie("refreshToken", account.refreshToken, {
          expires: new Date(Date.now() + timeExpires),
        });
        res.redirect("/");
        return;
      } else {
        throw new Error("Mật khẩu không chính xác!");
      }
    } catch (err) {
      console.log(err.message);
      res.render("login", { layout: false, username, errors: err.message });
    }
  }
  async showAddEsopide(req, res) {
    try {
      const { idFilm } = req.body;
      if (idFilm) {
        const infoEsopide = (await FimlDeltailModel.findOne({ idFilm })) || "";
        if (infoEsopide) {
          res.status(200).json({ infoEsopide });
          return;
        }
      }
      const { _id } = req.params;
      const film = await FimlModel.findById({ _id })
        .select("name updatedAt view thumb_url")
        .lean();
      if (!_id || !film) {
        throw new Error("Không tìm thấy thông tin");
      }

      film.updatedAt = moment(film.updatedAt).format("DD/MM/YYYY - HH:mm:ss");
      res.render("cate/addEsopide", { catelogpage: true, film });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ err: err.message });
    }
  }
  async addEsopide(req, res) {
    console.log(req.body);
    const { listEsopideEmbeded } = req.body;
    console.log(listEsopideEmbeded.split("*"));
  }
  //user
  async showUser(req, res) {
    res.render("user", { user: true });
  }
  async showUserEdit(req, res) {
    let message = "",
      error = "";
    try {
      const { iduser, link, path } = req.body;

      if (link && path && iduser) {
        const account = await UserModel.findByIdAndUpdate(iduser, {
          avata: link,
          path: path,
        });
        account.path &&
          (await CloudinaryServices.deleteFileImage(account.path));
        message = "Thay đổi avata thành công !";
      }

      const { icons, fullname, permission, vip, expLv, coin, blocked } =
        req.body;
      if (icons && iduser) {
        await UserModel.updateOne({ _id: iduser }, { $push: { icons: icons } });
        message = "Thay đổi thành công";
      }
      if (fullname && permission && vip && expLv && coin && blocked) {
        if (
          Number(vip) + 0 != vip ||
          Number(coin) + 0 != coin ||
          Number(expLv) + 0 != expLv
        ) {
          error = "Lỗi định dạng";
        } else {
          const user = await UserModel.findByIdAndUpdate(
            { _id: iduser },
            {
              fullname: Util.coverCapitalize(fullname),
              permission: permission.toLowerCase(),
              vip,
              expLv,
              expVip: coin,
              coin,
              blocked,
            }
          );

          if (user.coin !== coin) {
            await Util.updateVip(iduser, 0);
            await Util.updateExp(user.username, 0);
          }
          message = "Thay đổi thành công";
        }
      }
      const id = req.params.id;
      const account = await UserModel.findById({ _id: id })
        .populate("icons")
        .lean();
      let listIcons = await IconModel.find().lean();
      account.updatedAt = moment(account.updatedAt).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      if (account.icons && account.icons.length > 0) {
        listIcons = listIcons.filter(
          (icon) =>
            account.icons.findIndex((item) => item.title == icon.title) == -1
        );
      }

      res.render("user/edituser", {
        user: true,
        account,
        listIcons,
        message,
        error,
      });
    } catch (err) {
      console.log(err.message);
      res.redirect("/user");
    }
  }
  // delete icon user
  async deleteIcon(req, res) {
    try {
      const { idUser, idIcon } = req.body;
      console.log(req.body);
      if (!idUser || !idIcon) {
        throw new Error("Dữ liệu thiếu !");
      }
      await UserModel.updateOne({ _id: idUser }, { $pull: { icons: idIcon } });
      res.status(200).json({ message: "Xóa thành công icon !" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { idUser, newpassword } = req.body;
      console.log(req.body);
      if (!idUser || !newpassword) throw new Error("Thiếu dữ liệu");
      const passwordhash = await argon.hash(newpassword);
      await UserModel.updateOne({ _id: idUser }, { password: passwordhash });
      res
        .status(200)
        .json({ status: 200, message: "Thay đổi mật khẩu mới thành công !" });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
  // get comment and topupuser
  async getInfomationAccount(req, res) {
    try {
      const { idUser } = req.body;
      const listcomment =
        (await CommentModel.find({
          user_comment: idUser,
        }).populate({
          path: "user_comment",
          select: "fullname _id username permission avata",
        })) || [];
      const listTopup =
        (await TopUpModel.find({
          account: idUser,
        })
          .sort({ status: 1 })
          .populate({
            path: "account",
            select: "fullname _id username permission avata",
          })) || [];

      res.status(200).json({
        listcomment,
        listTopup,
        status: 200,
        message: "Lấy thành công list topup and list comment",
      });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
  // show top up
  async ShowTopUp(req, res) {
    try {
      const { getdata } = req.body;
      const { id } = req.params;
      if (getdata) {
        const listTopup =
          (await TopUpModel.find().sort({ status: 1 }).populate({
            path: "account",
            select: "username  _id avata fullname",
          })) || [];

        res.status(200).json({
          message: "Lấy thành công danh sách nạp!",
          listTopup,
          id,
        });

        return;
      }
      const totalTopupGen = await TopUpModel.aggregate([
        {
          $match: {
            status: 2,
          },
        },
        {
          $group: {
            _id: null,
            sumMoney: { $sum: "$money" },
          },
        },
      ]);
      let sumMoney = 0;
      if (totalTopupGen && totalTopupGen[0]) {
        sumMoney = totalTopupGen[0].sumMoney;
      }
      let total = 0;
      if (sumMoney) {
        total = sumMoney.toLocaleString("en-vi");
      }
      res.render("topup", { topup: true, total, id: id || "" });
    } catch (err) {
      console.log(err.message);
      res.render("pagenotfound", { layout: false });
    }
  }

  // show comment page comment

  async showComment(req, res) {
    try {
      const { getAll } = req.body;
      if (getAll) {
        const listComments =
          (await CommentModel.find().sort({ total_like: -1 }).populate({
            path: "user_comment",
            select: "_id fullname username createdAt updatedAt avata",
          })) || [];
        res.status(200).json({ listComments });
        return;
      }
      const total = await CommentModel.find().count();
      res.render("comment", { comment: true, total });
    } catch (err) {
      console.log(err.message);
    }
  }
}
module.exports = new AdminController();
