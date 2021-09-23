//import versi es5
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const path = require("path");
const { upload_avatar } = require("./services/upload_services");
const ps = require("./prisma/connection");

//alias ke variable app
const app = express();

//environtment
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static/")));

//template engine
app.set("view engine", "ejs");

//routing
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/home", (req, res) => {
  //tangkap query dari home
  const { username } = req.query;

  res.render("home/", { data: username });
});

app.get("/upload", (req, res) => {
  res.render("upload/", {
    title: "upload",
  });
});

//upload to databas
app.post("/user_create", upload_avatar.single("avatar"), async (req, res) => {
  try {
    const data = await req.body;
    const file = await req.file;

    const createUser = await ps.user.create({
      data: {
        email: data.email,
        password: data.password,
        avatar: {
          create: {
            image_path: `/uploads/${file.filename}`,
            filename: file.filename,
          },
        },
      },
      include: {
        avatar: true,
      },
    });
    res.redirect("/result");
  } catch (error) {
    res.redirect("/result");
  }
});

//hasil upload
app.get("/result", async (req, res) => {
  try {
    const result = await ps.user.findMany({
      include: {
        avatar: true,
      },
    });
    res.render("result/", { data: result });
  } catch (error) {
    res.redirect("/");
  }
});

//hasil upload
app.get("/api/user_read_all", async (req, res) => {
  try {
    const result = await ps.user.findMany({
      include: {
        avatar: true,
      },
    });
    res.json({
      success: true,
      query: result,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});

//listener
app.listen(process.env.PORT, () => {
  console.log("listen port 8080");
});
