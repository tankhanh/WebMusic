const express = require("express");
const morgan = require("morgan");
const hbs = require("express-handlebars").engine;
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

const mp3PlayerRouter = require("./routes/musics/mp3-player");

const url =
  "mongodb+srv://dinhtankhanh14:Khanhdeptrai0408@cluster-norsmither.udr8t5i.mongodb.net/?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(url);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "validation")));
app.use(express.static(path.join(__dirname, "routes")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", mp3PlayerRouter);

//path
app.set("views", path.join(__dirname, "views"));

//Template Engine
app.engine(
  "hbs",
  hbs({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.use(morgan("combined"));

app.listen(3000, () => console.log("Đã kết nối vào port 3000 thành công!"));
