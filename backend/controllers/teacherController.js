
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
};
