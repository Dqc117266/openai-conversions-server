const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const Chat = sequelize.define('Chat', {
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_aisend: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
}, {
  tableName: 'Chat',
  timestamps: false
});

// 导出模型
module.exports = Chat;
