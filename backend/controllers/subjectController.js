
const { Subject } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const offset = (page - 1) * limit;
      const keyword = req.query.keyword || "";

      const whereCondition = keyword
        ? { ten_mon: { [Op.like]: `%${keyword}%` } }
        : {};

      const { count, rows } = await Subject.findAndCountAll({
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

  create: async (req, res) => {
    try {
      const { ten_mon, ma_mon } = req.body;
      const subject = await Subject.create({ ten_mon, ma_mon });
      res.json(subject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { ten_mon, ma_mon } = req.body;
      const subject = await Subject.findByPk(id);
      if (!subject) return res.status(404).json({ error: "Subject not found" });

      if (ten_mon) subject.ten_mon = ten_mon;
      if (ma_mon) subject.ma_mon = ma_mon;
      await subject.save();
      res.json(subject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await Subject.findByPk(id);
      if (!subject) return res.status(404).json({ error: "Subject not found" });

      await subject.destroy();
      res.json({ message: "Subject deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
