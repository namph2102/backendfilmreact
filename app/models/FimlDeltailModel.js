const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FilmDetailModel = new Schema({
  idFilm: { type: mongoose.Schema.Types.ObjectId, ref: "Films" },
  listEsopideStream: { type: Array, default: [] },
  listEsopideEmbeded: { type: Array, default: [] },
});
module.exports = mongoose.model("fimldetails", FilmDetailModel);
