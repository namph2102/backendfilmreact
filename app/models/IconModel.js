const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const IconModel = new Shema(
  {
    link: { type: String, require: true },
    title: { type: String, require: true },
    path: { type: String, defaultValue: "" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("icons", IconModel);
