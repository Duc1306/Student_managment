const { Student } = require("../models");

module.exports = {
  getAllStudents: async (req, res) => {
    try {
      // Sử dụng Sequelize để lấy toàn bộ học sinh từ model Student
      const students = await Student.findAll();
      res.json(students);
    } catch (error) {
      console.error("Error retrieving students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
