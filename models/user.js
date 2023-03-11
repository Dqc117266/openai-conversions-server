const { Model, DataTypes } = require('sequelize');

class User extends Model {}

User.init({
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      openid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unionid: {
        type: Sequelize.STRING,
        allowNull: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      avator: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_invited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }    
}, {
  sequelize,
  modelName: 'user',
  tableName: 'User',
  timestamps: false
});

module.exports = User;
