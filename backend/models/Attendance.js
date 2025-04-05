
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attendance = sequelize.define(
  "Attendance",
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "late"),
      defaultValue: "present",
    },
  },
  {
    tableName: "attendance",
  }
);

module.exports = Attendance;
