// controllers/attendanceController.js

const { Attendance, Student, Class } = require("../models");
const xlsx = require("xlsx");

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
        // Lọc theo classId nếu có
        if (req.query.classId) filter.class_id = req.query.classId;
        // Lọc theo date nếu có
        if (req.query.date) filter.date = req.query.date;
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

  // API PUT /attendance/:recordId để cập nhật status và reason
  updateRecord: async (req, res) => {
    try {
      const { status, reason } = req.body;
      const record = await Attendance.findByPk(req.params.recordId);
      if (!record) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy bản ghi điểm danh" });
      }
      record.status = status;
      // Chỉ lưu lý do khi absent
      record.reason = status === "absent" ? reason : "";
      await record.save();
      return res.json(record);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
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

  exportAttendance: async (req, res) => {
    try {
      const { classId, date } = req.query;
      const attendanceRecords = await Attendance.findAll({
        where: { class_id: classId, date },
        include: [Student],
      });

      const data = attendanceRecords.map((record) => ({
        StudentID: record.Student ? record.Student.id : "",
        HoTen: record.Student ? record.Student.ho_ten : "",
        Status: record.status,
        Date: record.date,
      }));

      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Attendance");

      const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(buffer);
    } catch (error) {
      console.error("Lỗi export attendance:", error);
      res.status(500).json({ error: "Lỗi export dữ liệu" });
    }
  },
};
