const { User, Student, Teacher } = require("../models");
const {
  createPagination,
  createSearchCondition,
} = require("../utils/pagination");

module.exports = {
  // Lấy danh sách user (nếu cần)
  getAll: async (req, res) => {
    try {
      const { page, limit, offset } = createPagination(req);
      const keyword = req.query.keyword || "";
      const whereCondition = createSearchCondition("username", keyword);

      const { count, rows } = await User.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
      });

      res.json({
        data: rows,
        meta: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Tạo user
  createUser: async (req, res) => {
    try {
      // Lấy thông tin từ req.body
      const {
        username,
        password,
        role,
        ma_giao_vien,
        ho_ten,
        bo_mon,
        ma_sinh_vien,
        ngay_sinh,
        dia_chi,
      } = req.body;

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
      } else if (role === "student") {
        await Student.create({
          user_id: newUser.id,
          ma_sinh_vien: ma_sinh_vien || `SV_${newUser.id}`,
          ho_ten: ho_ten || newUser.username,
          ngay_sinh: ngay_sinh || null,
          dia_chi: dia_chi || "Chưa cập nhật",
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
