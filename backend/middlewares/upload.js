const multer = require("multer");
const path = require("path");

// Thiết lập bộ nhớ (storage) cho multer, lưu file tạm thời vào thư mục "uploads/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    // Sử dụng tên file gốc
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
