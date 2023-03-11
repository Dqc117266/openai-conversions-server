const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize(process.env.DATEBASE_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
});

module.exports = sequelize;
