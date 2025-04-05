
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subject = sequelize.define(
  "Subject",
  {
    ten_mon: DataTypes.STRING,
    ma_mon: DataTypes.STRING,
  },
  {
    tableName: "subjects",
  }
);

module.exports = Subject;
