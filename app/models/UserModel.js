const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const UserModel = new Shema(
  {
    // id_user
    username: { type: String, required: true },
    uid: { type: String, default: "" },
    password: { type: String, required: true },
    fullname: { type: String, default: "" },
    phone: { type: Number, default: 0 },
    avata: {
      type: String,
      default: "/images/userlogin.png",
    },
    expLv: { type: Number, default: 0 },
    expVip: { type: Number, default: 0 },
    nameLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "explevel",
      default: "643df9bc046c60449410d2b8",
    },
    permission: { type: String, default: "member" },
    coin: { type: Number, default: 0 },
    description: { type: String, default: "" },
    vip: { type: Number, default: 0 },
    // icons: { type: Array, default: [] },
    icons: [{ type: mongoose.Schema.Types.ObjectId, ref: "icons" }],
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", UserModel);
