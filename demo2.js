const express = require('express');
const https = require('https')
const fs = require('fs')
const sequelize = require('./models/sequelize');
const usersRouter = require('./routes/user_routes');
const openIdRouter = require('./routes/openid_routes');
const rechargelist = require('./routes/pay/rechargelist_route');

const path = require('path');
const { request } = require('http');
const AesCipher = require('./utils/aes_cipher');
const cipher = new AesCipher();


const options = {
  key: fs.readFileSync(process.env.SERVER_KEY),
  cert: fs.readFileSync(process.env.SERVER_LCT)
}

const app = express();

// 注册中间件
app.use(express.json());

// 注册路由
app.use('/users', usersRouter);
app.use('/users', openIdRouter);
app.use('/', rechargelist);

// 同步模型到数据库
sequelize.sync().then(() => {
  console.log('所有模型已成功同步到数据库。');
}).catch(err => {
  console.error('模型同步到数据库时发生错误：', err);
});

const server = https.createServer(options, app);

// 启动应用程序
const PORT = process.env.PORT;
server.listen(process.env.PORT, () => {
  console.log(`应用程序已启动，正在监听端口 ${PORT}...`);
});
