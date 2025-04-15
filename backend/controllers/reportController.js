const { Class, Teacher, Student, Attendance } = require("../models");

module.exports = {
  overview: async (req, res) => {
    try {
      const totalClasses = await Class.count();
      const totalTeachers = await Teacher.count();
      const totalStudents = await Student.count();

      const allAttendances = await Attendance.findAll();
      const attendanceSummary = { present: 0, absent: 0, late: 0 };
      allAttendances.forEach((record) => {
        attendanceSummary[record.status] =
          (attendanceSummary[record.status] || 0) + 1;
      });

      return res.json({
        totalClasses,
        totalTeachers,
        totalStudents,
        attendanceSummary,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
