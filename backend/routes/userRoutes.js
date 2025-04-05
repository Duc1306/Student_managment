
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Áp dụng middleware => phải có token
router.use(authMiddleware);

// Chỉ admin được thao tác
router.get("/", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only" });
  }
  userController.getAll(req, res);
});

router.post("/", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  userController.create(req, res);
});

router.put("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  userController.update(req, res);
});

router.delete("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  userController.delete(req, res);
});

module.exports = router;
