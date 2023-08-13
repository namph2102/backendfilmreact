const express = require("express");
const cors = require("cors");
const app = express();
import multer from "multer";
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Server } from "socket.io";
import { createServer } from "http";

// 100mb
const maxFileSize = process.env.MAX_FILE_SIZE
  ? +process.env.MAX_FILE_SIZE
  : 100;

const port = process.env.PORT || 3000;
const { engine } = require("express-handlebars");

// sử dụng view engine
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

//Khai báo sử dụng middleware cookieParse()
// admin
app.use(cookieParser());
//*end setting path
import compression from "compression";
import CloudinaryServices, { DeleteFileInServer } from "./services";
app.use(
  compression({ level: 6, threshold: 100 * 1000, filter: shouldCompress })
);

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

app.use(
  express.urlencoded({
    type: "application/x-www-form-urlencoded",
    extended: true,
    limit: 1024 * 200,
    parameterLimit: 1024 * 200,
  })
);
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const ConnectDB = require("./config");
const AllRouter = require("./routes");

ConnectDB();

AllRouter(app);

// upload file
//********************************************* */

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/uploadfile", upload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      const { path } = req.file;
      if (path) {
        const result = await CloudinaryServices.uploadImage(path);
        await DeleteFileInServer(path);
        res
          .status(200)
          .json({ image: result, message: "Tải ảnh thành công", status: 200 });
        return;
      }
      throw new Error("Ảnh không đạt yêu cầu");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Upload thất bại", status: 404 });
  }
});
app.post("/deleteimage", async function (req, res) {
  const { path } = req.body;
  try {
    if (!path) throw new Error("No path provided");
    await CloudinaryServices.deleteFileImage(path);

    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(404).json({ message: "Xóa không thành công" });
  }
});
//************ end upload file ********************************* */
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
io.on("connection", (socket) => {
  console.log("Connect socket id: ", socket.id);

  socket.on("nguoi-dung-binh-luan", (comment) => {
    if (socket.phongChat == 0 || socket.phongChat) {
      io.in(socket.phongChat).emit(socket.phongChat, comment);
    }
  });

  socket.on("xoa-noi-dung-binh-luan", (id) => {
    if (socket.phongChat == 0 || socket.phongChat) {
      io.in(socket.phongChat).emit("server-send-delete-comment", id);
    }
  });

  socket.on("tham-gia-phong-chat", (idfilm) => {
    console.log("Tham gia phòng chat", idfilm);
    socket.phongChat = idfilm;
    socket.join(idfilm);
  });

  socket.on("roi-phong-chat", (idfilm) => {
    console.log("roi phòng chat", idfilm);
    socket.phongChat = null;
  });

  socket.on("disconnect", () => {
    console.log("disconnect socket id: ", socket.id);
  });
});
httpServer.listen(port);
