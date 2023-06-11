const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FilmDetailModel = new Schema({
  idFilm: { type: mongoose.Schema.Types.ObjectId, ref: "Films" },
  listEsopideStream: [{ esopide: String, link: String }],
  listEsopideEmbeded: [{ esopide: String, link: String }],
});
module.exports = mongoose.model("fimldetails", FilmDetailModel);
