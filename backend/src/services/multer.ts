import { getUploadLocation } from "@/helpers/useLocations"
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, getUploadLocation());
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

export { upload, storage };
