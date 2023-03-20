const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const amqp = require('amqplib/callback_api');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cache = require('node-cache');
const User = require('../../models/user/usermodel');

const myCache = new cache({ stdTTL: 60, checkperiod: 120 });


// 函数: 从缓存或数据库中获取用户余额
async function getUserBalance(userId) {
  const balanceKey = `user:${userId}:balance`;
  let balance = myCache.get(balanceKey);
  if (balance != undefined) {
    return balance;
  }
  // 从数据库中获取用户余额
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  balance = user.balance_amount;
  myCache.set(balanceKey, balance); // 将从数据库中获取的值存入缓存
  return balance;
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

          console.log('requestBody:' + requestBody);
          console.log("channel status: " + status + " ")

          const balance = await getUserBalance(userId);
          console.log("balance " + balance)

          if (balance <= 0) {
            client.send(JSON.stringify({data: 'insufficientBalance' }));
            return
          }
  
          if (status === 'CAN_SEND_MESSAGE') {
            const instance = axios.create({
              baseURL: 'https://api.openai.com/v1/chat/',
              responseType: 'stream',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`
              },
              timeout: 15 * 1000,
            });
    
            const request = instance.post('completions', requestBody);
    
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
          } else if (status === 'SET_TLEMENT') {

            const wordLength = parseFloat(requestBody.word_length);
            const useAment = wordLength / 2000;
            await updateUserBalance(userId, useAment);
          }
        } catch (e) {
          console.log(" JSON.parse error " + e)
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

module.exports = router;
