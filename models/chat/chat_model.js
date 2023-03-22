const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const Chat = sequelize.define('Chat', {
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chat_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  chat_list: {
    type: DataTypes.JSON,
    allowNull: true
  }

}, {
  tableName: 'Chat',
  timestamps: false
});

// 导出模型
module.exports = Chat;
