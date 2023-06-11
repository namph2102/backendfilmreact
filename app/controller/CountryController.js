const ContryModel = require("../models/CountryModel");
const FilmModel = require("../models/FimlModel");

const handleSlug = require("slug");
const Utils = require("../utils/UserUtil");
class CountryController {
  async init(req, res) {
    try {
      const total = await ContryModel.find().count();
      res.render("country", { countrypage: true, total });
    } catch (err) {
      console.log(err.message);
    }
  }
  async getDataCountry(req, res) {
    try {
      const listCountry = (await ContryModel.find()) || [];
      res.status(200).json({ listCountry: listCountry.reverse() });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
  async adminAddCountry(req, res) {
    try {
      const { country, slug, idCountry } = req.body;
      let message = "";
      if (!country) throw new Error("Country empty");
      const coverslug = handleSlug(country);
      const getCountry = await ContryModel.findOne({ slug: coverslug });
      if (!idCountry) {
        if (getCountry) throw new Error(`${country} đã tồn tại`);
        await ContryModel.create({ slug: coverslug, country });
        message = `Đã thêm thành công ${country}`;
      } else {
        console.log(req.body);
        await ContryModel.updateOne({ _id: idCountry }, { slug, country });
        message = `Đã sửa chữa thành công ${country}`;
      }

      res.status(201).json({ message });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async addCountry(country) {
    try {
      if (!country) throw new Error("Country can't not found");
      const slug = handleSlug(country);
      const getCountry = await ContryModel.findOne({ slug });
      if (getCountry) return getCountry._id;
      else {
        const result = await ContryModel.create({ slug, country });
        if (result) return result._id;
      }
      throw new Error("Country can't not found");
    } catch (err) {
      return false;
    }
  }
  async deleteCountry(req, res) {
    try {
      const { id } = req.params;
      const result = await FilmModel.findOne({ country: id });
      if (result) {
        throw new Error("Bạn không thể xóa!");
      }
      const country = await ContryModel.findByIdAndDelete({ _id: id });
      if (!country) {
        throw new Error("Không tồn tại bất kỳ đất nước nào!");
      }
      res.status(200).json({ message: "Xóa thành công!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
module.exports = new CountryController();
