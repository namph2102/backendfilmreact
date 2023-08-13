const CommemtModel = require("../models/CommemtModel");
const IconModel = require("../models/IconModel");
class CommemtController {
  //Get all comment follow id_film
  async init(req, res) {
    try {
      let { idFilm, limit, totalComment } = req.body;
      const countCommemt =
        (await CommemtModel.count({
          id_film: idFilm,
          level: 0,
        })) || 0;
      const allCommemtFilm =
        (await CommemtModel.count({
          id_film: idFilm,
        })) || 0;
      if (totalComment && totalComment == allCommemtFilm) {
        res.status(200).json({ allCommemtFilm, status: 200 });
        return;
      }
      if (limit > countCommemt) limit = countCommemt;
      let listCommemt = await CommemtModel.find({
        id_film: idFilm,
        level: 0,
      })
        .populate({
          path: "user_comment",
          select:
            "blocked username fullname  avata icons createdAt  updatedAt level permission vip",
          populate: {
            path: "icons",
          },
        })
        .limit(limit)
        .sort({ updatedAt: -1 });
      listCommemt = await CommemtController.getListIconSub(listCommemt);
      if (listCommemt.length > 0) {
        res.status(200).json({
          data: listCommemt,
          status: 200,
          total_commemt: countCommemt,
          allCommemtFilm: allCommemtFilm,
          message: "oke",
        });
      } else {
        res
          .status(203)
          .json({ data: [], status: 203, message: "Not have commet !" });
      }
    } catch (err) {
      console.log(err);
      res
        .status(200)
        .json({ status: 404, data: [], message: "Cant not found" });
    }
  }

  async handleLike(req, res) {
    try {
      const { id_comment, crease } = req.body.data;
      const data = await CommemtModel.findByIdAndUpdate(
        { _id: id_comment },
        { $inc: { total_like: crease } }
      );
      return res.status(200).json({
        status: 200,
        message: "Update  sucess",
        total_like: data.total_like,
      });
    } catch (err) {
      return res.status(404).json({ total_like: 0, message: err.message });
    }
  }

  async handleAddCommemt(req, res) {
    try {
      const { subcomment, id_user, comment, id_film } = req.body.data;
      const SubPopulate = {
        path: "user_comment",
        select:
          "blocked username fullname  avata icons createdAt  updatedAt level permission vip",
      };
      let newComment = await CommemtModel.create({
        user_comment: id_user,
        comment,
        id_film,
      });
      newComment = await CommemtModel.findById(newComment._id).populate(
        SubPopulate
      );
      if (subcomment) {
        //nếu là commem bậc 2 thì

        const dataParent = await CommemtModel.findOneAndUpdate(
          { _id: subcomment },
          { $push: { subcomment: newComment._id } }
        );
        await CommemtModel.updateOne(
          { _id: newComment._id },
          { level: dataParent.level + 1 }
        );
        let allSubcommemt = await CommemtModel.find({
          _id: { $in: [...dataParent.subcomment, newComment.id] },
        })
          .populate(SubPopulate)
          .sort({ updatedAt: -1 });
        allSubcommemt = await CommemtController.getListIconSub(allSubcommemt);
        return res.json({
          status: 200,
          message: "Add Commemt success",
          data: allSubcommemt,
        });
      }

      return res.json({
        status: 200,
        message: "Add Commemt success",
        data: newComment,
      });
    } catch (err) {
      res
        .status(403)
        .json({ status: 403, message: "Some things went wrong at suer" });
    }
  }
  static async getListIconSub(listcomment) {
    const listNewComment = [];
    listcomment.forEach(async (user) => {
      if (user.user_comment) {
        if (user.user_comment?.icons?.length > 0) {
          const result = await IconModel.find({
            _id: { $in: user.user_comment.icons },
          });
          if (result) {
            user.user_comment.icons = result;
          }
        }
        listNewComment.push(user);
      }
    });
    return await Promise.all(listNewComment);
  }

  async handleSubcommemt(req, res) {
    try {
      const { id_parent, subcomment } = req.body.data;

      let listSub = await CommemtModel.find({
        _id: { $in: [...subcomment] },
      }).populate({ path: "user_comment", populate: { path: "nameLevel" } });
      listSub = await CommemtController.getListIconSub(listSub);
      if (listSub) {
        return res.status(200).json({
          status: 200,
          message: "success",
          data: listSub,
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "success",
          data: [],
        });
      }
    } catch (err) {
      console.log(err.message);
      return res
        .status(404)
        .json({ status: 404, message: "SomeThings Wrong!" });
    }
  }
  async handleDeletecommemt(req, res) {
    try {
      const _id = req.body.data.idcommemt;

      await CommemtModel.updateMany(
        {},
        { $pull: { subcomment: { $in: [_id] } } }
      );

      const comment = await CommemtModel.findByIdAndDelete({ _id });

      if (comment) {
        CommemtController.DequiDeletecomment(comment);
        return res.json({ message: "Xóa thành công bình luận !", status: 200 });
      }
      return res.json({
        message: "Tiếc quá không xóa thành công !",
        status: 203,
      });
    } catch (err) {
      console.log(err.message);
      return res.json({
        message: "Tiếc quá không xóa thành công !",
        status: 203,
      });
    }
  }
  static async DequiDeletecomment(comment) {
    if (comment?.subcomment.length > 0) {
      comment.subcomment.map(async (_id) => {
        const result = await CommemtModel.findByIdAndDelete({ _id });
        CommemtController.DequiDeletecomment(result);
      });
    } else {
      return;
    }
  }
  async handleUpdateComment(req, res) {
    try {
      const _id = req.body.data.idcommemt;
      const commemt = req.body.data.comment;
      await CommemtModel.updateOne(
        { _id },
        { comment: commemt, is_edit: true }
      );
      return res
        .status(200)
        .json({ message: "Chỉnh sửa nội dung thành công !", status: 200 });
    } catch {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa !", status: 403 });
    }
  }
}
module.exports = new CommemtController();
