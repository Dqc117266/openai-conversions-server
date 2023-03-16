const { Model, DataTypes } = require('sequelize');

class User extends Model {}

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      openid: {
        type: DataTypes.STRING,
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
      avator: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_invited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }    
}, {
  sequelize,
  modelName: 'user',
  tableName: 'User',
  timestamps: false
});

module.exports = User;
