
const { Sequelize } = require('sequelize');

const Model = require('./models/user')
const User = new Model()

// 创建 Sequelize 实例
const sequelize = new Sequelize(process.env.DATEBASE_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
});

// const User = sequelize.define('User', {
//     user_id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true
//     },
//     openid: {
//       type: Sequelize.STRING,
//       allowNull: false
//     },
//     unionid: {
//       type: Sequelize.STRING,
//       allowNull: true
//     },
//     username: {
//       type: Sequelize.STRING,
//       allowNull: true
//     },
//     avator: {
//       type: Sequelize.STRING,
//       allowNull: true
//     },
//     is_invited: {
//       type: Sequelize.BOOLEAN,
//       defaultValue: false
//     }
//   },
//   {
//     tableName: 'User',
//     timestamps: false,
//   });


  sequelize.sync().then(() => {
    console.log('Connected to database.');
  
    sequelize.query('SELECT * FROM User', { database: 'conversion_database' })
    .then(results => {
      console.log(results);
    })
    .catch(error => {
      console.error(error);
    });
  
    User.create({
      user_id: 1190,
      openid: '123',
      unionid: '1234',
      username: 'dqc',
      avator: '111',
      is_invited: false
    })
    .then(user => {
      console.log(user);
    })
    .catch(error => {
      console.error(error);
    });
  
    //创建一个新的用户
    // User.create({
    //   user_id: '1235',
    //   openid: 'op123',
    //   unionid: 'un123',
    //   username: 'username',
    //   avator: 'avator123',
    //   is_invited: '0'
    // }).then(user => {
    //   console.log(user.toJSON());
    // })
    // .catch(error => {
    //   console.error('An error occurred while creating the user:', error);
    // });
  });