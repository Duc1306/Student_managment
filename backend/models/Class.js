
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Class = sequelize.define(
  "Class",
  {
    ten_lop: DataTypes.STRING,
    ma_lop: DataTypes.STRING,
  },
  {
    tableName: "classes",
  }
);

module.exports = Class;
