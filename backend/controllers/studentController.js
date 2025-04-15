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
  updateStudent: async (req, res) => {
  const { id } = req.params;
  const { ho_ten, ma_sinh_vien, ngay_sinh, dia_chi, password } = req.body;
  try {
    const c = await Student.findByPk(id);
    if (!c) {
      return res.status(404).json({ error: "Học sinh không tồn tại" });
    }
    c.ho_ten = ho_ten || c.ho_ten;
    c.ma_sinh_vien = ma_sinh_vien || c.ma_sinh_vien;
    c.ngay_sinh = ngay_sinh || c.ngay_sinh;
    c.dia_chi = dia_chi || c.dia_chi;
    // Lưu ý: Trước khi lưu password, bạn có thể cần mã hoá mật khẩu nếu sử dụng
    c.password = password || c.password;
    await c.save();
    res.json(c);
  } catch (error) {
    console.error("Lỗi cập nhật học sinh:", error);
    res.status(500).json({ error: "Lỗi từ server" });
  }
  },
};
