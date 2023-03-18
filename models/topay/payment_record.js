const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// 定义模型
const PaymentRecord = sequelize.define('PaymentRecord', {
    payment_record_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement:true,
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
      allowNull: true  
    },
    payment_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },

    payment_source: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    tableName: 'PaymentRecord',
    timestamps: false
  });
  
  // 导出模型
  module.exports = PaymentRecord;
  