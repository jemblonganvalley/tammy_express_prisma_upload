const multer = require("multer");
const path = require("path");

const avatar_storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, req.body.email.split("@")[0] + "." + file.mimetype.split("/")[1]);
  },
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../static/uploads/"));
  },
});

const upload_avatar = multer({ storage: avatar_storage });

module.exports = { upload_avatar };
