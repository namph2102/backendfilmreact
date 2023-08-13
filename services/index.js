import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "dcsfwpkiq",
  api_key: "988698536798941",
  api_secret: "3uyMaSiQ_E5x219PNy-mh9o4gMc",
  secure: true,
});

class CloudinaryServices {
  static async uploadImage(path) {
    try {
      if (!path) throw new Error("path Không tồn tại");
      const response = await cloudinary.uploader.upload(path);
      if (response.public_id) {
        return {
          url: response.url,
          path: response.public_id,
        };
        return;
      }
      throw new Error("cant upload");
    } catch {
      return false;
    }
  }
  static async deleteFileImage(public_id) {
    try {
      if (!public_id) throw new Error("public_id Không tồn tại");
      const result = await cloudinary.uploader.destroy(public_id);
      console.log("Xóa trên cloundy", result);
      return true;
    } catch {
      return false;
    }
  }
}
export const DeleteFileInServer = async (filePath) => {
  if (!filePath) return;

  await fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
  });
};
export default CloudinaryServices;
