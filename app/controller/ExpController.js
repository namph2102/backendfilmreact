const ExpVipModel = require("../models/ExpVipModel");
const ExpLvModel = require("../models/ExpLvModel");

class ExpController {
  async init(req, res) {
    try {
      const [listExpVip, listExpLevel] = await Promise.all([
        await ExpVipModel.find(),
        await ExpLvModel.find(),
      ]);
      res.status(200).json({ data: { listExpVip, listExpLevel }, status: 200 });
    } catch (err) {
      console.log(err.message);
    }
  }
  async addExpVip(req, res) {
    try {
      const { name, musty, level } = req.body.data;
      if (!name || !musty || !level) {
        throw new Error("Thiếu dữ liệu");
      }
      const checkedExtend = await ExpVipModel.findOne({ name });
      if (checkedExtend) throw new Error("Tên expvip tồn tại");
      const result = await ExpVipModel.create({ name, musty, level });
      res.status(201).json({ result });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
  async addExpLv(req, res) {
    try {
      console.log(req.body.data);
      const { name, musty } = req.body.data;
      if (!name) {
        throw new Error("Thiếu dữ liệu");
      }
      const checkedExtend = await ExpLvModel.findOne({ name });
      if (checkedExtend) throw new Error("Tên expvip tồn tại");
      const result = await ExpLvModel.create({ name, musty });
      res.status(201).json({ message: "Tạo thành công", data: result });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
}
module.exports = new ExpController();
