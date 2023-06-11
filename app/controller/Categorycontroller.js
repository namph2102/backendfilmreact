const CategoryModel = require("../models/CategoryModel");
const FilmModel = require("../models/FimlModel");

const handleSlug = require("slug");
const handleUtils = require("../utils/UserUtil");
class CategoryController {
  async init(req, res) {
    try {
      const listCate = (await CategoryModel.find()) || [];
      res
        .status(200)
        .json({ listCate: listCate.reverse(), messageL: "oke", status: 200 });
    } catch (err) {
      res.status(404).json({ status: 404, message: err.message });
      console.log(err.message);
    }
  }
  async addCate(req, res) {
    try {
      let { category } = req.body.data;
      if (category) {
        category = handleUtils.replaceManySpace(category).toLowerCase();
        const slug = handleSlug(category);
        const checked = await CategoryModel.findOne({
          slug,
        });
        if (checked) {
          throw new Error(` Đã tồn tại thể loại ${category}`);
        } else {
          const result = await CategoryModel.create({ slug, category });
          return res
            .status(201)
            .json({ message: "Tạo thành công thể loại mới", newCate: result });
        }
      }
      throw new Error(`dữ liệu bị gì ấy`);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async editCate(req, res) {
    try {
      let { category, slug, id } = req.body;
      const result = await CategoryModel.updateOne(
        { _id: id },
        {
          slug: slug,
          category: handleUtils.replaceManySpace(category.toLowerCase()),
        }
      );
      if (!result) {
        throw new Error(`Không tìm thấy thể loại ${category} !`);
      }
      res.status(200).json({ message: "Thay đổi thành công !" });
    } catch (err) {
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
  async showCategory(req, res) {
    try {
      res.render("category", {
        categorypage: true,
        total: 12,
      });
    } catch (err) {}
  }
  async deleteCate(req, res) {
    try {
      const { id } = req.params;
      await FilmModel.updateMany({ $pull: { category: id } });
      const result = await CategoryModel.findByIdAndDelete({ _id: id });
      if (!result) {
        throw new Error("Không tồn tại thể loại này!");
      }
      res
        .status(200)
        .json({ message: "Xóa thành công thể loại " + result.category });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
module.exports = new CategoryController();
