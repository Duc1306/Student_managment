const { Teacher, User } = require("../models");

module.exports = {
  getAll: async (req, res) => {
    try {
      const teachers = await Teacher.findAll({
        include: [{ model: User, attributes: ["username"] }],
      });
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateTeacher: async (req, res) => {
    const { id } = req.params;
    const { ho_ten, email, so_dien_thoai } = req.body; // ví dụ các trường cần cập nhật
    try {
      const c = await Teacher.findByPk(id);
      if (!c) {
        return res.status(404).json({ error: "Giáo viên không tồn tại" });
      }
      c.ho_ten = ho_ten || c.ho_ten;
      c.email = email || c.email;
      c.so_dien_thoai =
        so_dien_thoai || c.so_dien_thoai;
      await c.save();
      res.json(c);
    } catch (error) {
      console.error("Lỗi cập nhật giáo viên:", error);
      res.status(500).json({ error: "Lỗi từ server" });
    }
  },
};
