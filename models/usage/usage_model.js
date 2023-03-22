const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const Usage = sequelize.define('Usage', {
  usage_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usage_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usage_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  usage_wordcount: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
}, {
  tableName: 'Usage',
  timestamps: false
});

// 导出模型
module.exports = Usage;
