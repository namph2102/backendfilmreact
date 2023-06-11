const StarModel = require("../models/StarModel");
const FilmModel = require("../models/FimlModel");
const UserModel = require("../models/UserModel");
const UserUtil = require("../utils/UserUtil");
class StarController {
  static async CalcAverage(idFilm) {
    try {
      const resList = await StarModel.aggregate([
        { $group: { _id: "$idFilm", average: { $avg: "$star" } } },
      ]);
      const data = resList.find((item) => item._id == idFilm);
      return data.average || 5;
    } catch {
      return 5;
    }
  }
  async init(req, res) {
    const { idFilm, idUser } = req.body.data;
    const average = await StarController.CalcAverage(idFilm);

    try {
      let userStar = { star: 0 };
      let isExtended = false;
      if (idUser) {
        userStar = await StarModel.findOne({
          idFilm: idFilm,
          useID: idUser,
        });
        if (userStar) {
          isExtended = true;
        }
      }

      res.status(200).json({
        average,
        star: userStar?.star || 0,
        status: 200,
        isExtended,
        message: "oke",
      });
    } catch {
      res.status(200).json({
        average,
        isExtended: false,
        star: 0,
        status: 202,
        message: "no have",
      });
    }
  }
  async addStar(req, res) {
    try {
      const { idFilm, star, useID } = req.body.data;
      if (useID) {
        const account = await UserModel.findOne({ _id: useID });
        UserUtil.updateExp(account.username, Math.floor(star));
      }
      await FilmModel.findByIdAndUpdate({ _id: idFilm }, { $inc: { star: 1 } });

      await StarModel.create({ idFilm, star, useID });
      const average = await StarController.CalcAverage(idFilm);
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }).then(() => {
        res
          .status(200)
          .json({ average, message: "Add thành công!", status: 200 });
      });
    } catch {
      res.status(404).json({ message: "Add thất bại!", status: 404 });
    }
  }
  async updateStar(req, res) {
    const { idFilm, useID, star } = req.body.data;
    try {
      await StarModel.updateOne({ idFilm, useID }, { star });
      const average = await StarController.CalcAverage(idFilm);
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }).then(() => {
        res
          .status(200)
          .json({ average, message: "Update thành công!", status: 200 });
      });
    } catch {
      res.status(404).json({ message: "Update thất bại!", status: 404 });
    }
  }
}
module.exports = new StarController();
