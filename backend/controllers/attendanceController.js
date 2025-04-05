// attendance-backend/controllers/attendanceController.js
const { Attendance, Student, Class } = require("../models");

module.exports = {
  // API GET /attendance
  // Nếu role là student => chỉ trả về các bản ghi của sinh viên đó (dựa vào req.user)
  // Nếu role là teacher hoặc admin => cho phép lọc theo query param (classId, date)
  getAttendance: async (req, res) => {
    try {
      const role = req.user.role;
      let filter = {};
      if (role === "student") {
        // Tìm bản ghi của sinh viên dựa vào user_id từ JWT
        const student = await Student.findOne({
          where: { user_id: req.user.userId },
        });
        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }
        filter.student_id = student.id;
      } else {
        // Đối với teacher hoặc admin, cho phép lọc theo query params
        const { classId, date } = req.query;
        if (classId) filter.class_id = classId;
        if (date) filter.date = date;
      }

      const records = await Attendance.findAll({
        where: filter,
        include: [
          { model: Class, attributes: ["ten_lop"] },
          { model: Student, attributes: ["ho_ten", "ma_sinh_vien"] },
        ],
      });
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // API POST /attendance cho teacher điểm danh
  mark: async (req, res) => {
    try {
      const { classId, date, attendanceList } = req.body;
      for (const item of attendanceList) {
        const { studentId, status } = item;
        const existing = await Attendance.findOne({
          where: { student_id: studentId, class_id: classId, date },
        });
        if (!existing) {
          await Attendance.create({
            student_id: studentId,
            class_id: classId,
            date,
            status,
          });
        } else {
          existing.status = status;
          await existing.save();
        }
      }
      res.json({ message: "Attendance saved" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // API GET /attendance/report để thống kê điểm danh (các bản ghi được lọc theo classId, date)
  report: async (req, res) => {
    try {
      const { classId, date } = req.query;
      const filter = {};
      if (classId) filter.class_id = classId;
      if (date) filter.date = date;
      const data = await Attendance.findAll({ where: filter });
      const summary = { present: 0, absent: 0, late: 0 };
      data.forEach((a) => {
        summary[a.status] = (summary[a.status] || 0) + 1;
      });
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
