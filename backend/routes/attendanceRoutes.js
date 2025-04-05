
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// Route cho teacher điểm danh
router.post("/", (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Teacher only" });
  }
  attendanceController.mark(req, res);
});

// Route GET /attendance: nếu student, chỉ lấy điểm danh của bản thân; nếu teacher/admin, cho phép lọc theo query param
router.get("/", attendanceController.getAttendance);

// Route GET /attendance/report
router.get("/report", attendanceController.report);

module.exports = router;
