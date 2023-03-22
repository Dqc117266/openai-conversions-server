const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const Conversation = sequelize.define('Conversation', {
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  conversation_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conversation_content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conversation_openai_body: {
    type: DataTypes.JSON,
    allowNull: false
  }
  
}, {
  tableName: 'Conversation',
  timestamps: false
});

// 导出模型
module.exports = Conversation;
