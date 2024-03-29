const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const amqp = require('amqplib/callback_api');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cache = require('node-cache');
const User = require('../../models/user/usermodel');
const Chat = require('../../models/chat/chat_model');
const Usage = require('../../models/usage/usage_model');
const Conversation = require('../../models/conversation/conversation_model');
const sequelize = require('../../models/sequelize');

const timezone = require('moment-timezone');
const moment = require('moment');
const chatCache = {};

const myCache = new cache({ stdTTL: 60, checkperiod: 120 });

async function changeConversationDesc(conversation_id, messages) {
  try {
    if (conversation_id && messages && messages.length > 0) {
      const chatDate = moment().format('YYYY-MM-DD HH:mm');
      const lastMsg = messages[messages.length - 1].content;
      let msg = lastMsg.length <= 17 ? lastMsg : lastMsg.substring(0, 17) + '...';
      await Conversation.update({ updated_at: chatDate, conversation_content: msg}, { where: { conversation_id } });
      await Chat.create({
        conversation_id,
        chat_date: chatDate,
        chat_list: messages
      });
    }
  } catch (e) {
    console.log(" saveChat error ", e)
  }
}

async function saveChat(conversation_id, messages) {
  try {
    changeConversationDesc(conversation_id, messages);
    // if (conversation_id && message) {
    //   const chatDate = moment().format('YYYY-MM-DD HH:mm');
    //   await Chat.create({
    //     conversation_id,
    //     chat_date: chatDate,
    //     chat_list: message
    //   });
    // }
  } catch (e) {
    console.log(" saveChat erroe ", e)
  }  
}
// 函数: 从缓存或数据库中获取用户余额
async function getUserBalance(userId) {
  const balanceKey = `user:${userId}:balance`;
  const durationExpirationDateKey = `user:${userId}:durationExpirationDate`;
  
  let balance = myCache.get(balanceKey);
  let durationExpirationDate = myCache.get(durationExpirationDateKey);
  
  if (balance === undefined || durationExpirationDate === undefined) {
    // 如果缓存中不存在这些值，则从数据库中获取它们
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    if (balance === undefined) {
      balance = user.balance_amount;
      myCache.set(balanceKey, balance); // 将从数据库中获取的余额存入缓存
    }
    if (durationExpirationDate === undefined) {
      const datetime = moment(user.duration_expiration_date, 'YYYY-MM-DD HH:mm:ss');
      durationExpirationDate = Math.max(datetime.valueOf() - getDateNow(), 0);
      myCache.set(durationExpirationDateKey, durationExpirationDate); // 将从数据库中获取的时长计费到期时间存入缓存
    }
  }
  
  return {balance, durationExpirationDate};  
}

function getDateNow() {
  const currentTime = moment().tz('Asia/Shanghai');
  const timestamp = currentTime.valueOf();
  console.log(timestamp);
  return timestamp;
}

// 函数: 更新用户余额
async function updateUserBalance(userId, amount) {
  const balanceKey = `user:${userId}:balance`;
  let balance = myCache.get(balanceKey);
  if (balance != undefined) {
    // 更新余额，注意不能小于 0
    balance = Math.max(balance - amount, 0);
    myCache.set(balanceKey, balance); // 更新缓存
    await User.update({ balance_amount: balance }, { where: { user_id: userId } }); // 批量更新数据库中用户余额
    return;
  }
  // 从数据库中获取用户余额
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  balance = Math.max(user.balance_amount - amount, 0);
  myCache.set(balanceKey, balance); // 将从数据库中获取的值存入缓存
  await User.update({ balance_amount: balance }, { where: { user_id: userId } }); // 批量更新数据库中用户余额
}

async function updateUserDailyUsage(userId, amount) {
  const currentTime = moment().tz('Asia/Shanghai');
  // 格式化时间为 MM-DD-YYYY
  const formattedDate = currentTime.format('YYYY-MM-DD');
  console.log(" date " + formattedDate)

  const usageKey = `user:${userId}:usage`;

  // 查询缓存
  let usage = myCache.get(usageKey);
  if (usage != undefined) {
    usage = (parseFloat(usage) + amount).toFixed(4);
    console.log("查询缓存: usage: " + usage);
    myCache.set(usageKey, usage, {ttl: 60 * 60}) // 添加缓存过期时间
    await sequelize.transaction(async (t) => {
      // 更新数据库
      await Usage.update({ usage_amount: usage, usage_wordcount: usage * 5000 }, { where: { user_id: userId, usage_date: formattedDate }, transaction: t });
    }).then(() => {
      console.log('事务提交成功');
    }).catch((err) => {
      console.log('事务提交失败', err);
    });
    return
  }
  // 查询数据库
  const mUsage = await Usage.findOne({ where: { user_id: userId, usage_date: formattedDate } });

  if (mUsage) {
    // 更新缓存
    usage = (parseFloat(mUsage.usage_amount) + amount).toFixed(4);
    console.log("mUsage: usage: " + usage + " mUsage.usage_amount " + mUsage.usage_amount + " amount " + amount)

    myCache.set(usageKey, usage, { ttl: 60 * 60 }); // 添加缓存过期时间
    await sequelize.transaction(async (t) => {
      // 更新数据库
      await Usage.update({ usage_amount: usage, usage_wordcount: usage * 5000 }, { where: { user_id: userId, usage_date: formattedDate }, transaction: t });
    })
  } else {
    // 创建新记录
    // const newUsage = { user_id: userId, usage_date: today, usage_amount: amount, usage_wordcount: amount * 2000 };
    await Usage.create({ user_id: userId, usage_date: formattedDate, usage_amount: amount, usage_wordcount: amount * 5000});
    // 更新缓存
    myCache.set(usageKey, amount, { ttl: 60 * 60 }); // 添加缓存过期时间
  }
}

amqp.connect('amqp://localhost:5672', (error0, connection) => {

    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      // 创建一个名为openai的队列来接收消息
      const queue = 'openai';
      channel.assertQueue(queue, {
        durable: false
      });

      // 启动WebSocket服务器
      const wss = new WebSocket.Server({ port: 8080 });
      console.log('WebSocket server started');
  
      // 当客户端连接时，将WebSocket连接添加到客户端组中
      const clients = new Map();

      wss.on('connection', (ws) => {
        console.log('WebSocket connection');
        const clientId = uuidv4();
        console.log(clientId);
        clients.set(clientId, ws);
        // 监听消息
        ws.on('message', (message) => {
          console.log(`${clientId} Received message: ` + message);
  
          // 将消息发送到RabbitMQ队列
          channel.sendToQueue(queue, Buffer.from(JSON.stringify({ clientId, message })));
        });

        ws.on('close', () => {
          clients.delete(clientId);
          console.log('closed clientId' + clientId);
        });

      });
  // 创建RabbitMQ消费者来接收消息
    channel.consume(queue, async (msg) => {
      const { clientId, message } = JSON.parse(msg.content);
      const client = clients.get(clientId);

      console.log(clientId);
      const bufferData = Buffer.from(message.data);
      console.log("msg:" + bufferData);

      if (client) {
        try {
          const json = JSON.parse(bufferData)
          const status = json.status;
          const requestBody = json.requestBody;
          const userId = json.userid;
          const baseUrl = json.baseUrl;

          console.log("channel baseUrl: " + baseUrl);
          console.log('requestBody:' + requestBody);
          console.log("channel status: " + status + " ");

          const { balance, durationExpirationDate } = await getUserBalance(userId);
          console.log("balance " + balance + " durationExpirationDate " + durationExpirationDate)

          // 计算剩余时间
          // const remainingTime = ;

          if (durationExpirationDate <= 0 && balance <= 0) {
            client.send(JSON.stringify({data: 'insufficientBalance' }));
            return
          }
  
          if (status === 'CAN_SEND_MESSAGE') {
            const instance = axios.create({
              baseURL: baseUrl,
              responseType: 'stream',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`
              },
              timeout: 15 * 1000,
            });
    
            const request = instance.post('', requestBody);
    
            request.then(response => {
              const stream = response.data;
              stream.on('data', chunk => {
                var json = chunk.toString();
                client.send(json);
                console.log(json);
              });
              stream.on('end', () => {});
            
              stream.on('error', error => {
                console.log(error);
              });
            })
            .catch(error => {
              client.send(JSON.stringify({data: 'networkerror' }));
              console.log(error);
            });

            client.on('close', () => {
              console.log('close client');
            });
          } else if (status === 'SET_TLEMENT') {

            if (durationExpirationDate > 0) {
              return;
            }
            const wordLength = parseFloat(requestBody.word_length);
            const useAment = wordLength / 5000;

            await updateUserBalance(userId, useAment);
            await updateUserDailyUsage(userId, useAment);
            await saveChat(requestBody.conversation_id, requestBody.messages);
          }
        } catch (e) {
          console.log(" error " + e)
        }
      }
    }, {
      noAck: true
    });
  });
});

// 路由处理函数
router.post('/', (req, res) => {
  console.log("openchat")
  res.json({message: "CONTENT_OK"});
});

router.post('/saveChatList', (req, res) => {
  const conversationId = req.body.conversation_id;
  const messages = req.body.messages; // 解析 JSON 字符串为 JavaScript 对象数组
  for (let i = 0; i < messages.length; i++) {
    saveChat(conversationId, messages[i]); // 传递消息内容给 saveChat 方法
    console.log('messages[i] : ' + messages[i].role + ' content: ' + messages[i].content);
  }
  res.json({message: "CONTENT_OK"});
});

module.exports = router;
