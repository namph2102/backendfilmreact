const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const IconModel = new Shema(
  {
    link: { type: String, require: true },
    title: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("icons", IconModel);
