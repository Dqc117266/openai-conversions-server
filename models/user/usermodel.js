const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  openid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  unionid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_invited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  balance_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  balance_days: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  
}, {
  tableName: 'User',
  timestamps: false
});

// 导出模型
module.exports = User;
