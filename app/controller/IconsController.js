const { default: CloudinaryServices } = require("../../services");
const IconModel = require("../models/IconModel");
const UserModal = require("../models/UserModel");
const Util = require("../utils/UserUtil");

class IconTroller {
  async init(req, res) {
    try {
      let { title, link, path = "" } = req.body;
      if (!link || !title) throw new Error("Thiếu dữ liệu");
      if (title) {
        title = Util.coverCapitalize(title);
        const checkIconExtended = await IconModel.findOne({
          $or: [{ title }, { link }],
        });
        if (checkIconExtended) {
          throw new Error(`${title} đã tồn tại`);
        }
        if (!path) {
          const res_image = await CloudinaryServices.uploadImage(link);
          link = res_image.url;
          path = res_image.path;
          console.log(res_image);
        }
        await IconModel.create({ link, title, path });
        message = `Icon ${title} đã tạo thành công`;
      }
      res.redirect("/icon/show");
    } catch (err) {
      res.redirect("/icon/show");
    }
  }

  async addIconToUser(req, res) {
    try {
      const { idIcon, idUser } = req.body.data;

      const account = await UserModal.findById({
        _id: idUser,
      });
      if (!account) throw new Error("Tài khoản không  tồn tại");
      const checkIcon = account.icons.find((item) => item._id == idIcon);
      if (checkIcon) throw new Error("icon tồn tại");
      const result = await IconModel.findOne({ _id: idIcon });
      if (result) {
        const user = await UserModal.findByIdAndUpdate(
          { _id: idUser },
          { $push: { icons: idIcon } }
        );
        if (user) {
          res.status(200).json({ message: "upload thành công", status: 200 });
        } else {
          throw new Error("Không thêm thành công");
        }
      }
    } catch (err) {
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
  async showIconAdmin(req, res) {
    try {
      const { getAll } = req.body;
      const total = await IconModel.find().count();
      if (getAll) {
        const listIcons = (await IconModel.find({}))?.reverse() || [];

        res.status(200).json({ listIcons: listIcons });
        return;
      }
      res.render("icons", { icon: true, total });
    } catch (err) {}
  }
  async deleteIcon(req, res) {
    try {
      const { id } = req.params;
      await UserModal.updateMany({ $pull: { icons: id } });
      const result = await IconModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error(`Xóa thất bại!`);
      }
      result.path && (await CloudinaryServices.deleteFileImage(result.path));
      res.status(200).json({ message: `Xóa thành công icon ${result.title}` });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async editIcon(req, res) {
    try {
      let { id, title, link, path } = req.body;
      if (!id || !title) throw new Error("Dữ liệu không đầy đủ");
      const icon = await IconModel.findById(id);
      if (!icon) {
        throw new Error("Icon không tồn tại");
      }

      if (icon.link !== link) {
        icon.path && (await CloudinaryServices.deleteFileImage(icon.path));
        const res_image = await CloudinaryServices.uploadImage(link);
        link = res_image.url;
        path = res_image.path;
        console.log(res_image);
      }
      const result = await IconModel.findByIdAndUpdate(id, {
        title: Util.coverCapitalize(title),
        link: link.trim(),
        path,
      });
      if (result) {
        res.status(200).json({ message: "Cập nhập thành công!" });
      } else {
        throw new Error("Cập nhập thành công!");
      }
    } catch (err) {
      res.status(404).json({ message: err.message });
      console.log(err.message);
      // res.redirect("/icon/show");
    }
  }
}
module.exports = new IconTroller();
