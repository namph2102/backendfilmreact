const BookMarkModel = require("../models/BookMarkModel");
class BookmarkController {
  // get list bookmarks
  async init(req, res) {
    try {
      const { username } = req.body.data;
      if (!username) {
        return;
      }
      const infoBookmark = await BookMarkModel.findOne({ username });
      if (infoBookmark) {
        res
          .status(200)
          .json({ status: 200, listBookMark: infoBookmark.listBookmark });
      } else {
        res.status(202).json({ status: 202, listBookMark: [] });
      }
    } catch {
      res.status(404).json({ status: 404, listBookMark: [] });
    }
  }
  static async CheckitemExtend(username, namevalue) {
    const [itemExtended] = await BookMarkModel.find(
      { username },
      {
        listBookmark: { $elemMatch: { name: namevalue } },
      }
    );
    if (itemExtended.listBookmark?.length > 0) return true;
    return false;
  }
  // addd
  async handleAddBookMark(req, res) {
    try {
      const { username, item } = req.body.data;
      if (!item?.name || !username)
        throw new Error("Thông tin không đạt yêu cầu");
      const isExtendded = await BookMarkModel.findOne({ username });
      if (isExtendded) {
        const itemExtended = await BookmarkController.CheckitemExtend(
          username,
          item.name
        );
        if (itemExtended) throw new Error("Đã tồn tại trong bookmark");
        await BookMarkModel.updateOne(
          { username },
          { $push: { listBookmark: item } }
        );
      } else {
        await BookMarkModel.create({
          username,
          listBookmark: item,
        });
      }
      res.status(200).json({ status: 200, message: "Update thành công" });
    } catch (err) {
      res.status(202).json({ status: 202, message: err?.message });
    }
  }
  async handleRemoveBookMark(req, res) {
    try {
      const { username, name } = req.body.data;
      if (!username || !name) throw new Error("username and slug not empty");
      const itemExtended = await BookmarkController.CheckitemExtend(
        username,
        name
      );

      if (!itemExtended) throw new Error("Product not found");

      const productPull = await BookMarkModel.updateOne(
        { username },
        { $pull: { listBookmark: { name } } }
      );

      res.status(200).json({ message: "oke", status: 200, productPull });
    } catch (err) {
      res.status(404).json({ message: err?.message, status: 404 });
    }
  }
  async handleRemoveAllBookMark(req, res) {
    try {
      const { username } = req.body.data;
      const deletall = await BookMarkModel.findOneAndDelete({ username });
      res
        .status(200)
        .json({ message: "Xóa hết phim yêu thích thành công", status: 200 });
    } catch {
      res.status(202).json({ message: "Lỗi gì đó", status: 202 });
    }
  }
}
module.exports = new BookmarkController();
