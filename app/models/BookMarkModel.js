const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookmarkModel = new Schema({
  username: { type: String, require: true },
  listBookmark: {
    type: [
      {
        name: { type: String, require: true },
        time: { type: Date, default: Date.now() },
        slug: { type: String, require: true },
        avata: { type: String, require: true },
      },
    ],
  },
});
module.exports = mongoose.model("bookmarks", BookmarkModel);
//**listBookmark */
// name: { type: String, require: true },
// time: { type: Date, require: true },
// slug : {type: String, require:true}
// avata: {type: String, require:true}
