const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("./public/images/")) {
      fs.mkdirSync("./public/images/");
    }
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).single("profile");

const fileSubmitController = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Please upload a profile image",
      });
    }

    req.fileInfo = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    next();
  });
};

module.exports = fileSubmitController;
