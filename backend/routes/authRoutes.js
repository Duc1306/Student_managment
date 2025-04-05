
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Đăng ký (có thể chỉ cho Admin hoặc mở cho public tuỳ thiết kế)
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Logout (client xoá token)
router.post("/logout", authController.logout);

module.exports = router;
