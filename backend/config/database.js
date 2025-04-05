require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, //student_managment\
  process.env.DB_USER, //root
  process.env.DB_PASS, //123456

  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);

module.exports =sequelize