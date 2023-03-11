const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const PaymentRecord = sequelize.define('PaymentRecord', {
    payment_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_type_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
    
  }, {
    tableName: 'PaymentRecord',
    timestamps: false
  });
  
  // 导出模型
  module.exports = PaymentRecord;
  