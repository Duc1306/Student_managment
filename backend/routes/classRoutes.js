
const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");


router.use(authMiddleware);

// GET danh sách lớp (với lọc: teacher/student chỉ thấy lớp của mình)
router.get("/", classController.getAll);

// Route mới: Lấy danh sách sinh viên của lớp
router.get("/:id/students", classController.getStudentsOfClass);

// Các route CRUD chỉ admin:
router.post("/", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  classController.create(req, res);
});

router.put("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  classController.update(req, res);
});

router.delete("/:id", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  classController.delete(req, res);
});

router.post("/:id/students", (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ error: "Teacher only" });
  classController.addStudentToClass(req, res);
});

router.delete("/:id/students/:studentId", (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ error: "Teacher only" });
  classController.removeStudentFromClass(req, res);
});
router.get("/export", classController.exportClasses);
router.post(
  "/:id/import",
  upload.single("file"),
  classController.importStudents
);

module.exports = router;
