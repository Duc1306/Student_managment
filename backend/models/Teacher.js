
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Teacher = sequelize.define(
  "Teacher",
  {
    ma_giao_vien: DataTypes.STRING,
    ho_ten: DataTypes.STRING,
    bo_mon: DataTypes.STRING,
  },
  {
    tableName: "teachers",
  }
);

module.exports = Teacher;
