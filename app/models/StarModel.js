const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StarModel = new Schema({
  idFilm: { type: Schema.Types.ObjectId, require: true },
  useID: { type: String, default: "" },
  star: { type: Number, default: 5 },
});
module.exports = mongoose.model("stars", StarModel);
