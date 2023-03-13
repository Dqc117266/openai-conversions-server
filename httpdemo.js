const express = require('express');
const bodyParser = require('body-parser')
const sequelize = require('./models/sequelize');
const usersRouter = require('./routes/user_routes');
const openIdRouter = require('./routes/openid_routes');
const rechargelist = require('./routes/pay/rechargelist_route');
const verifySignature = require('./utils/authenticate-request-util')

const path = require('path');
const { request } = require('http');
const AesCipher = require('./utils/aes_cipher');
const cipher = new AesCipher();

const app = express();

// 注册中间件
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'));


// 注册路由
// app.use('/user', usersRouter);
// app.use(verifySignature)
app.use('/user', openIdRouter);
app.use('/', verifySignature, rechargelist);

// 同步模型到数据库
sequelize.sync().then(() => {
  console.log('所有模型已成功同步到数据库。');
}).catch(err => {
  console.error('模型同步到数据库时发生错误：', err);
});

// 启动应用程序
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`应用程序已启动，正在监听端口 ${PORT}...`);
});
