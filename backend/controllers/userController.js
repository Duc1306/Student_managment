
const { User, Teacher } = require("../models");


module.exports = {
  // Lấy danh sách user (nếu cần)
  getAll: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo user
  createUser: async (req, res) => {
    try {
      // Thông tin từ body
      const { username, password, role, ma_giao_vien, ho_ten, bo_mon } =
        req.body;

      // 1) Tạo user trong bảng users
      const newUser = await User.create({ username, password, role });

      // 2) Nếu role = 'teacher', ta tạo teacher record
      if (role === "teacher") {
        // Tạo bản ghi teacher, gắn user_id = newUser.id
        await Teacher.create({
          user_id: newUser.id,
          ma_giao_vien: ma_giao_vien || `GV_${newUser.id}`,
          ho_ten: ho_ten || newUser.username,
          bo_mon: bo_mon || "Chưa cập nhật",
        });
      }

      // 3) Trả về kết quả
      res.json({ message: "User created", user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cập nhật user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Update
      if (username) user.username = username;
      if (password) user.password = password; // auto-hash (nếu có hook)
      if (role) user.role = role;

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      await user.destroy();
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
