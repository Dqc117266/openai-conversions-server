const express = require('express');
const bodyParser = require('body-parser');
const redis = require('ioredis');
const redisClient = redis.createClient();

const aeskey = process.env.AES_KEY;

const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize('conversion_database', process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
});


// const Aesutil = require('./utils/AesUtil')
// const aesutilInstance = new Aesutil(aeskey, '1234567891234567');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // 从redis中获取用户信息
  const userStr = await redisClient.get(`user:${username}`);
  const user = JSON.parse(userStr);
  if (user && user.password === password) {
    res.json({
      code: 0,
      message: '登录成功',
      data: user
    });
  } else {
    await redisClient.set(`user:${username}`, JSON.stringify({username: username, password: password}));
    res.json({
      code: -1,
      message: '用户名或密码错误'
    });
  }
});

app.post('/sessionList', async (req, res) => {
  const { username } = req.body;
  // 从redis中获取会话列表
  const sessionListStr = await redisClient.get(`sessionList:${username}`);
  const sessionList = JSON.parse(sessionListStr);
  res.json({
    code: 0,
    data: sessionList
  });
});

app.post('/sendMessage', async (req, res) => {
  const { username, sessionId, message } = req.body;
  // 从redis中获取会话信息
  const sessionStr = await redisClient.get(`session:${sessionId}`);
  const session = JSON.parse(sessionStr);
  // 向openai发起请求
  // TODO: 实现向openai请求数据返回结果处理
  const response = await openaiConversationAPI(session.context, message);
  session.context = response.context;
  session.messages.push({ type: 'user', text: message });
  session.messages.push({ type: 'bot', text: response.text });
  await redisClient.set(`session:${sessionId}`, JSON.stringify(session));
  res.json({
    code: 0,
    data: session
  });
});

app.post('/createSession', async (req, res) => {
  const { username } = req.body;
  // 创建会话
  const session = {
    context: '',
    messages: []
  };
  const sessionId = await redisClient.incr('sessionId');
  await redisClient.set(`session:${sessionId}`, JSON.stringify(session));
  // 更新会话列表
  const sessionListStr = await redisClient.get(`sessionList:${username}`);
  const sessionList = JSON.parse(sessionListStr) || [];
  sessionList.push(sessionId);
  await redisClient.set(`sessionList:${username}`, JSON.stringify(sessionList));
  res.json({
    code: 0,
    data: { sessionId }
  });
});



const User = sequelize.define('User', {
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
},
{
  tableName: 'User',
  timestamps: false
});



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
    user_id: 117,
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

// 启动服务
app.listen(3000, () => {
//   const encrypt = aesutilInstance.encrypt("asdasdasfsagasdasda")
//   const decrypt = aesutilInstance.decrypt(encrypt)
  console.log('Server started on port 3000 appkey=') ;
});
