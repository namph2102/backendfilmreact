const express = require("express");
const Route = express.Router();
const FilmDetailController = require("../app/controller/FilmDetailController");
const { AuthenzationAdmin } = require("../app/Authorization");
// path parent /filmdetail
Route.post("/", FilmDetailController.init)
  .post("/addListFilm", AuthenzationAdmin, FilmDetailController.addlistFilm)
  .post("/deleteesopide", AuthenzationAdmin, FilmDetailController.deleteEsopide)
  .post(
    "/uploadEsopide",
    AuthenzationAdmin,
    FilmDetailController.updateEsopide
  );
module.exports = Route;
