const multer = require("multer");
const fs = require("fs");

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = req.uploadDir || "./public/annon";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const imageFilter = (req, file, cb) => {
  let allowedExt = ["jpg", "png", "jpeg", "webp", "gif", "svg"];
  let ext = file.originalname.split(".").pop();
  if (allowedExt.includes(ext.toLowerCase())) {
    cb(false, true);
  } else {
    cb({ status: 400, msg: "File format/extension not supported." });
  }
};

const uploader = multer({
  storage: myStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5000000,
  },
});

module.exports = uploader;
