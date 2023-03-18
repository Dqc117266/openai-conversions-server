const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const PaymentType = sequelize.define('PaymentType', {
  payment_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  payment_type_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_type_content: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  payment_goods_detail: {
    type: DataTypes.STRING,
    allowNull: true
  }
  
}, {
  tableName: 'PaymentType',
  timestamps: false
});

// 导出模型
module.exports = PaymentType;
