
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentClass = sequelize.define(
  "StudentClass",
  {
    // Chỉ cần id (tự tăng), hoặc không cần cột nào khác
  },
  {
    tableName: "student_class",
  }
);

module.exports = StudentClass;
