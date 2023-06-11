const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CategoryModel = new Schema({
  slug: { type: String, required: true },
  category: { type: String, required: true },
});
module.exports = mongoose.model("categories", CategoryModel);
