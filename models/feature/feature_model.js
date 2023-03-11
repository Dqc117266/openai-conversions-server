const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const Feature = sequelize.define('Feature', {
  feature_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  feature_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_desc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_avator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_prompt: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
}, {
  tableName: 'Feature',
  timestamps: false
});

// 导出模型
module.exports = Feature;
