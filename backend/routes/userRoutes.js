
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Bảo vệ route => login + phân quyền (vd. chỉ admin)
router.use(authMiddleware);

// Lấy tất cả user (nếu cần)
router.get("/", (req, res) => {
  // Giả sử chỉ admin mới xem DS user
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only" });
  }
  userController.getAll(req, res);
});

// Tạo user (chỉ admin)
router.post("/", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  userController.createUser(req, res);
});

// Cập nhật user
router.put("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  userController.updateUser(req, res);
});

// Xóa user
router.delete("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  userController.deleteUser(req, res);
});

module.exports = router;
