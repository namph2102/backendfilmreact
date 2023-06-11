const mongose = require("mongoose");
const Schema = mongose.Schema;
const ExpVip = new Schema({
  musty: { type: Number, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
});
module.exports = mongose.model("ExpVip", ExpVip);
