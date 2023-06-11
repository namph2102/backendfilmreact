const UserModel = require("../models/UserModel");
const ExpLevel = require("../models/ExpLvModel");
const expVipModel = require("../models/ExpVipModel");
const fs = require("fs");
const path = require("path");
class UserUpdate {
  async updateCokkieClient(res, value, timeExpires = 3600 * 100 * 9999) {
    res.cookie("_idLogin", value, {
      expires: new Date(Date.now() + timeExpires),
    });
  }

  async updateVip(idUser, expBonus) {
    try {
      const account = await UserModel.findOneAndUpdate(
        { _id: idUser },
        { $inc: { expVip: expBonus, coin: expBonus } }
      ).select("");

      const levelNext = await expVipModel.find({
        musty: { $lt: account.coin + expBonus },
      });
      const item = (levelNext && levelNext.at(-1)) || "";

      if (item && account.coin + expBonus >= item.musty) {
        if (account.permission !== "admin") {
          await UserModel.findOneAndUpdate(
            { _id: idUser },
            { vip: item.level, permission: "vip" }
          );
        } else {
          await UserModel.findOneAndUpdate(
            { _id: idUser },
            { vip: item.level }
          );
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  async updateExp(username, point) {
    try {
      if (!point) {
        point = point == 0 ? 0 : Math.ceil(Math.random() * 20);
      }
      if (username) {
        const user = await UserModel.findOneAndUpdate(
          { username },
          { $inc: { expLv: point } }
        );
        const levelNext = await ExpLevel.find({
          musty: { $lt: user.expLv + point },
        });
        const item = (levelNext && levelNext.at(-1)) || "";
        if (item && user.expLv + point >= item.musty) {
          await UserModel.findOneAndUpdate(
            { username },
            { nameLevel: item._id }
          );
        }
        console.log(user.nameLevel);
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  async removeImage(link) {
    try {
      if (!link) throw new Error("Thiếu đường link tuyệt đối");
      const fiexedLink =
        path.join(__dirname).replace("app\\utils", "public\\") +
        link.replace(process.env.DOMAIN, "");
      console.log("file cũ là", fiexedLink);

      if (!fs.existsSync(fiexedLink)) {
        throw new Error("file dont have directoty");
      }
      console.log("Cover path link to remove image", fiexedLink);
      fs.unlink(fiexedLink, (err) => {
        if (err) throw new Error(err);
        console.log("file  đã bị xóa");
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  replaceManySpace(str) {
    if (!str) return "";
    return str.replace(/  +/g, " ").trim();
  }
  coverCapitalize(str) {
    if (typeof str === "string") {
      str = str.replace(/  +/g, " ").trim().toLowerCase();
      return str
        .split(" ")
        .map((chart) => chart[0].toUpperCase() + chart.slice(1))
        .join(" ");
    } else {
      return "";
    }
  }
  plusLinkImage(link) {
    if (!link) return "";
    console.log(link);
    return process.env.DOMAIN + "uploads/" + link;
  }
}
module.exports = new UserUpdate();
