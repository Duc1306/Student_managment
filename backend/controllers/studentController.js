const { Student, User } = require("../models");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");

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

      c.password = password || c.password;
      await c.save();
      res.json(c);
    } catch (error) {
      console.error("Lỗi cập nhật học sinh:", error);
      res.status(500).json({ error: "Lỗi từ server" });
    }
  },

  importStudents: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "File không được gửi lên" });
      }
      // file upload được lưu tại req.file.path
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Chuyển sheet thành JSON (mỗi dòng là một đối tượng)
      const rows = xlsx.utils.sheet_to_json(worksheet);

      // Vòng lặp qua từng dòng dữ liệu để tạo học sinh mới
      for (let row of rows) {
        // 1) Dùng findOrCreate cho User
        const [user, userCreated] = await User.findOrCreate({
          where: { username: row.ma_sinh_vien },
          defaults: {
            password: await bcrypt.hash(row.password, 10),
            role: "student",
          },
        });

        // 2) Dùng findOrCreate cho Student
        const [student, studentCreated] = await Student.findOrCreate({
          where: { ma_sinh_vien: row.ma_sinh_vien },
          defaults: {
            user_id: user.id,
            ho_ten: row.ho_ten,
            ngay_sinh: row.ngay_sinh,
            dia_chi: row.dia_chi,
          },
        });

        // 3) Nếu student đã tồn tại, bạn có thể update thêm dữ liệu
        if (!studentCreated) {
          await student.update({
            user_id: user.id,
            ho_ten: row.ho_ten,
            ngay_sinh: row.ngay_sinh,
            dia_chi: row.dia_chi,
          });
        }
      }

      res.status(200).json({
        message: "Import học sinh thành công",
        count: rows.length,
      });
    } catch (error) {
      console.error("Lỗi import học sinh:", error);
      res.status(500).json({ error: "Lỗi khi import dữ liệu" });
    }
  },
};
