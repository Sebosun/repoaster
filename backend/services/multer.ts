import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "/home/seb/Pictures/Images");
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

export { upload, storage };
