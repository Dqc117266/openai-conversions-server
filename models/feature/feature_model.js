const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const Feature = sequelize.define('feature', {
  feature_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true
  },
  feature_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_desc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_avatar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_openai_body: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'feature',
  timestamps: false
});

// 导出模型
module.exports = Feature;

