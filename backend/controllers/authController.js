
const { User } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password, role, ma_giao_vien, ho_ten, bo_mon } =
        req.body;
      const newUser = await User.create({ username, password, role });
      if (role === "teacher") {
        // Tạo bản ghi teacher với thông tin bổ sung từ req.body hoặc giá trị mặc định
        await Teacher.create({
          user_id: newUser.id,
          ma_giao_vien: ma_giao_vien || `GV_${newUser.id}`,
          ho_ten: ho_ten || newUser.username,
          bo_mon: bo_mon || "Chưa cập nhật",
        });
      }
      res.json({ message: "User created", user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      // Kiểm tra password
      const match = await user.comparePassword(password);
      if (!match) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      // Tạo token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || "secretKey",
        { expiresIn: "1d" }
      );
      res.json({ message: "Login successful", token, role: user.role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    // Ở client xoá token. Server trả về thông báo
    return res.json({ message: "Logged out" });
  },
};
