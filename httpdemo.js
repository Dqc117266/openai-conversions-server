const express = require('express');
const bodyParser = require('body-parser')
const sequelize = require('./models/sequelize');
const usageRouter = require('./routes/usage/usage_route');
const openIdRouter = require('./routes/openid_routes');
const rechargelist = require('./routes/pay/rechargelist_route');
const featureRouter = require('./routes/feature/feature_route');
const conversationRoute = require('./routes/conversation/conversation_route');
const chatRoute = require('./routes/chat/chat_route');
const verifySignature = require('./utils/authenticate-request-util')
// const openaidome = require('./utils/openaiDemo')
const streamDemo = require('./routes/chat/streamDemo')

// const openaiChatbotRouter = require('./routes/chat/openaiChatbotRouter');


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

// openaidome();

// 注册路由
// app.use(verifySignature)
app.use('/user', openIdRouter);
app.use('/usage', verifySignature, usageRouter);
app.use('/chatbot', verifySignature, streamDemo);
app.use('/', verifySignature, conversationRoute);
app.use('/', verifySignature, rechargelist);
app.use('/', verifySignature, featureRouter);
app.use('/', verifySignature, chatRoute);

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
