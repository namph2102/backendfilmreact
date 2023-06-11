const UserModel = require("../models/UserModel");
const TopUpModel = require("../models/TopupModel");
const expVipModel = require("../models/ExpVipModel");
const UserUtil = require("../utils/UserUtil");
class TopUpController {
  async TopUp(req, res) {
    console.log("Gửi request nạp thẻ");
    try {
      console.log(req.body.data);
      const {
        username,
        idUser,
        status,
        payCode,
        money,
        seri = "",
        nameBank = "",
        nameWallet = "",
      } = req.body.data;
      const newTopup = money
        ? await TopUpModel.create({
            account: idUser,
            status,
            payCode,
            money,
            seri,
            nameBank,
            nameWallet,
          })
        : "";
      if (!newTopup) throw new Error("Nạp thất bại");
      if (status == 2) {
        // nạp paypal thành công
        const expBonus = Math.floor(money / 100);
        await UserUtil.updateVip(idUser, expBonus);
        await UserUtil.updateExp(username, expBonus);
      }
      const account = await UserModel.findById({ _id: idUser }).select(
        "coin vip expLv expVip permission"
      );
      res
        .status(201)
        .json({ message: "Hệ thống đang xử lý!", status: 200, account });
    } catch (err) {
      console.log(err.message);
    }
  }
  async getHistoryToUser(req, res) {
    try {
      const { idUser } = req.body.data;
      if (!idUser) throw new Error("Iduser not found");
      const history = await TopUpModel.find({ account: idUser }).sort({
        createdAt: -1,
      });
      if (history) {
        res.status(200).json({ message: "oke", status: 200, history });
      } else {
        throw new Error("Không tồn tại history");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  async handleTopUpPageAdmin(req, res) {
    try {
      const { idTopup, status } = req.body;
      let message = "";
      if (!idTopup || !status) {
        throw new Error("Dữ liệu bị thiếu");
      }
      const infomation = await TopUpModel.findOneAndUpdate(
        { _id: idTopup },
        { status }
      ).populate({ path: "account", select: "username  _id avata fullname" });
      if (!infomation | !infomation?.account) {
        throw new Error("Không tìm thấy thông tin nạp!");
      }
      const { username, _id } = infomation.account;
      if (status == 2) {
        const expBonus = Math.floor(infomation.money / 100);
        console.log(expBonus);
        await Promise.all([
          UserUtil.updateExp(username, expBonus),
          UserUtil.updateVip(_id, expBonus),
        ]);

        message = "Thanh Toán nạp  này thành công!";
      } else {
        message = "Thanh toán này đã bị thất bại!";
      }
      const account =
        (await UserModel.findOne({ _id }).select("coin vip expLv")) || {};
      res.status(200).json({ message, account });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
  async deleteTopUp(req, res) {
    try {
      const { idTopup } = req.params;
      const result = await TopUpModel.findByIdAndDelete({ _id: idTopup });
      if (!result) {
        throw new Error("Không tồn tại hóa đơn nạp này!");
      }
      res
        .status(200)
        .json({ message: "Xóa thành công hóa đơn nạp!", status: 200 });
    } catch (err) {
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
}
module.exports = new TopUpController();
