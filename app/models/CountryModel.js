const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CountryModel = new Schema({
  slug: { type: String, required: true },
  country: { type: String, required: true },
});
module.exports = mongoose.model("countries", CountryModel);
