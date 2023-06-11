const mongose = require("mongoose");
const Schema = mongose.Schema;
const ExpLevel = new Schema({
  musty: { type: Number, required: true },
  name: { type: String, required: true },
});
module.exports = mongose.model("explevel", ExpLevel);
