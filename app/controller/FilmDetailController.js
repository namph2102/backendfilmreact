const FimlDeltailModel = require("../models/FimlDeltailModel");
const FilmModel = require("../models/FimlModel");
class FilmDetailController {
  static async updateTotalFilm(idFilm) {
    try {
      const infoFilm = await FimlDeltailModel.findById(idFilm).select(
        "listEsopideStream listEsopideEmbeded"
      );

      const maxTotal = Math.max(
        infoFilm?.listEsopideStream?.length || 0,
        infoFilm?.listEsopideEmbeded?.length || 0
      );
      const film = await FilmModel.findById(idFilm);
      const dataupdate = {};
      dataupdate.episode_current = Number(maxTotal) || 0;

      if (film?.eposode_total < maxTotal) {
        dataupdate.eposode_total = maxTotal;
        if (maxTotal > 1) {
          dataupdate.kind = "series";
        } else {
          dataupdate.kind = "feature";
        }
      }
      if (
        infoFilm.listEsopideStream.length != infoFilm.listEsopideEmbeded.length
      ) {
        dataupdate.status = "uncompleted";
      } else {
        dataupdate.status = "completed";
      }

      await FilmModel.findByIdAndUpdate(idFilm, dataupdate);
    } catch (err) {
      console.log(err.message);
      console.log("Upload tập phim thất bại");
    }
  }

  async init(req, res) {
    const slug = req.body.slug;

    try {
      const findFilm = await FilmModel.findOne({ slug });
      if (findFilm) {
        const filmdetail = await FimlDeltailModel.findOne({
          idFilm: findFilm._id,
        });
        res.status(200).json({ message: "oke", filmdetail, findFilm });
        return;
      }
      throw new Error("cant find film");
    } catch {
      res.status(203).json({ message: "cant find film" });
    }
  }
  async addlistFilm(req, res) {
    try {
      let message = "";
      let { idFilm, embed, m3u8 } = req.body;
      if (!idFilm) throw new Error("Dữ liệu thiếu");
      const checked = await FimlDeltailModel.findOne({ idFilm });
      if (checked) {
        let coverM3u8;
        let coverembed;
        coverM3u8 = m3u8;
        coverembed = embed;

        await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $push: { listEsopideEmbeded: { $each: coverembed, $position: 0 } },
          }
        );

        await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $push: { listEsopideStream: { $each: coverM3u8, $position: 0 } },
          }
        );
        message = "Cập nhập thành công!";
      } else {
        const newFilm = await FimlDeltailModel.create({
          idFilm,
          listEsopideStream: m3u8,
          listEsopideEmbeded: embed,
        });
        idFilm = newFilm._id;
        message = "Thay đổi  thành công!";
      }

      await FilmDetailController.updateTotalFilm(idFilm.toString());
      res.status(200).json({ message });
    } catch (err) {
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
  async updateEsopide(req, res) {
    try {
      let message = 0;
      console.log(req.body);
      const {
        idFilm,
        idembed,
        idm3u8,
        linkembed,
        linkm3u8,
        esopidem3u8,
        esopideembed,
      } = req.body;

      if (idembed && linkembed && esopideembed) {
        await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $pull: { listEsopideEmbeded: { _id: idembed } },
          }
        );
        await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $push: {
              listEsopideEmbeded: {
                esopide: esopideembed,
                link: linkembed,
              },
            },
          }
        );

        message = 1;
      }
      if (idm3u8 && linkm3u8 && esopidem3u8) {
        await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $pull: { listEsopideStream: { _id: idm3u8 } },
          }
        );
        await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $push: {
              listEsopideStream: {
                esopide: esopidem3u8,
                link: linkm3u8,
              },
            },
          }
        );
        message = 1;
      }
      if (!message) {
        throw new Error("Thay đổi thất bại");
      } else {
        message = "Thay đổi thành công!";
      }
      res.status(200).json({ message, status: 200 });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
  async deleteEsopide(req, res) {
    try {
      const { idm3u8, idembed, idFilm } = req.body;
      console.log(req.body);
      if (!idFilm) {
        throw new Error("Dữ liệu không  đầy đủ");
      }

      idm3u8 &&
        (await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $pull: { listEsopideStream: { _id: idm3u8 } },
          }
        ));
      idembed &&
        (await FimlDeltailModel.updateOne(
          { idFilm },
          {
            $pull: { listEsopideEmbeded: { _id: idembed } },
          }
        ));

      await FilmDetailController.updateTotalFilm(idFilm);
      res.status(200).json({ message: `Xóa thành công `, status: 200 });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
}
module.exports = new FilmDetailController();
