const IconModel = require("../models/IconModel");
const UserModal = require("../models/UserModel");
const Util = require("../utils/UserUtil");

class IconTroller {
  async init(req, res) {
    let message = "";
    try {
      const file = req.file;
      let { title } = req.body;
      const image = Util.plusLinkImage(file.filename);
      if (title && image) {
        title = Util.coverCapitalize(title);
        const checkIconExtended = await IconModel.findOne({ title });
        if (checkIconExtended) {
          await Util.removeImage(image);
          throw new Error(`${title} đã tồn tại`);
        }
        await IconModel.create({ link: image, title });
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
      const result = await IconModel.findByIdAndDelete({ _id: id });
      if (!result) {
        throw new Error(`Xóa thất bại!`);
      }
      res.status(200).json({ message: `Xóa thành công icon ${result.title}` });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async editIcon(req, res) {
    try {
      const { id, title, link } = req.body;
      const file = req.file;
      const icon = await IconModel.findById({ _id: id });
      if (!icon) {
        res.status(404).json({ message: "Icon không tồn tại" });
        return;
      }
      if (file) {
        await Util.removeImage(icon.link);
        const newimage = Util.plusLinkImage(file.filename);
        await IconModel.findByIdAndUpdate(
          { _id: id },
          { title: Util.coverCapitalize(title), link: newimage }
        );
        throw new Error("Upload thành công");
      }
      const result = await IconModel.findByIdAndUpdate(
        { _id: id },
        { title: Util.coverCapitalize(title), link: link.trim() }
      );
      if (result) {
        res.status(200).json({ message: "Cập nhập thành công!" });
      } else {
        throw new Error("Cập nhập thành công!");
      }
    } catch (err) {
      res.redirect("/icon/show");
    }
  }
}
module.exports = new IconTroller();
