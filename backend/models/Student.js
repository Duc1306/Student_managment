
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "Student",
  {
    ma_sinh_vien: DataTypes.STRING,
    ho_ten: DataTypes.STRING,
    ngay_sinh: DataTypes.DATE,
    dia_chi: DataTypes.STRING,
  },
  {
    tableName: "students",
  }
);

module.exports = Student;
