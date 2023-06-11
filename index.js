const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const port = 3000;
const { engine } = require("express-handlebars");

// sử dụng view engine
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

//Khai báo sử dụng middleware cookieParse()
// admin
app.use(cookieParser());

// cookie;
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

require("dotenv").config();

const ConnectDB = require("./config");

const AllRouter = require("./routes");

ConnectDB();

AllRouter(app);

app.listen(port, () => {
  console.log("hoàn thành");
});
