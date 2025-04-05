
const { User } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password, role } = req.body;
      // Tạo user => password sẽ được hash ở hook beforeCreate
      const newUser = await User.create({ username, password, role });
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
