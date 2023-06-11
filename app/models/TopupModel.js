const mongose = require("mongoose");
const Schema = mongose.Schema;
/*
status: 1 : Chờ Xác nhận
 status 2 : Thành công
 status 3 : Thất bại;
*/
const TopUpModel = new Schema(
  {
    account: { type: mongose.Schema.Types.ObjectId, ref: "users" },
    money: { type: Number, required: true },
    payCode: { type: String, required: true },
    nameBank: { type: String, default: "" },
    nameWallet: { type: String, default: "" },
    status: { type: Number, default: 1 },
    seri: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongose.model("topup", TopUpModel);
