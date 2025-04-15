const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// Chỉ admin mới được phép xem tổng quan
router.get("/overview", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  reportController.overview(req, res);
});

module.exports = router;
