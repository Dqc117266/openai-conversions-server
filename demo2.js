const express = require('express');
const https = require('https')
const fs = require('fs')
const sequelize = require('./models/user/sequelize');
const usersRouter = require('./routes/user_routes');
const openIdRouter = require('./routes/openid_routes');
const path = require('path');
const { request } = require('http');


const options = {
  key: fs.readFileSync('/etc/ssl/server.key'),
  cert: fs.readFileSync('/etc/ssl/server.crt')
}

const app = express();

// 注册中间件
app.use(express.json());

// 注册路由
app.use('/users', usersRouter);
app.use('/users', openIdRouter);

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
