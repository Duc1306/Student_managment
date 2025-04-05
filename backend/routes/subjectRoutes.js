
const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// Ai cũng có thể GET
router.get("/", subjectController.getAll);

// Chỉ admin mới CREATE, UPDATE, DELETE
router.post("/", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  subjectController.create(req, res);
});

router.put("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  subjectController.update(req, res);
});

router.delete("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  subjectController.delete(req, res);
});

module.exports = router;
