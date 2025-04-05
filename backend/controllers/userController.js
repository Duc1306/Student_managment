
const { User } = require("../models");

module.exports = {
  getAll: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const newUser = await User.create({ username, password, role });
      res.json(newUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (username) user.username = username;
      if (password) user.password = password; // sẽ auto-hash do hook
      if (role) user.role = role;

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
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
