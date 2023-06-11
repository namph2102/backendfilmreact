const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const CommemtModel = new Shema(
  {
    // id_comment
    level: { type: Number, default: 0 },
    subcomment: [{ type: mongoose.Schema.Types.ObjectId, ref: "commemts" }],
    user_comment: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    comment: { type: String, require: true },
    total_like: { type: Number, default: 0 },
    id_film: { type: String, default: "0" },
    is_edit: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Commemts", CommemtModel);
