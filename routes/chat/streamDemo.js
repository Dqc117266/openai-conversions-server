const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const amqp = require('amqplib/callback_api');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


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
          console.log(`Received message: ` + message);
  
          // 将消息发送到RabbitMQ队列
          channel.sendToQueue(queue, Buffer.from(JSON.stringify({ clientId, message })));
        });

        ws.on('close', () => {
          clients.delete(clientId);
        });

      });
  // 创建RabbitMQ消费者来接收消息
    channel.consume(queue, (msg) => {
      const { clientId, message } = JSON.parse(msg.content);
      const client = clients.get(clientId);

      console.log(clientId);
      const bufferData = Buffer.from(message.data);
      console.log("msg:" + bufferData);


      if (client) {
        const json = JSON.parse(bufferData)
        const status = json.status;
        const requestBody = json.requestBody;
  
        console.log('requestBody:' + requestBody);
        console.log("channel status: " + status + " ")

        if (status === 'CAN_SEND_MESSAGE') {
          try {
            const instance = axios.create({
              baseURL: 'https://api.openai.com/v1/chat/',
              responseType: 'stream',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`
              }
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
            });
          } catch(e) {
            console.log(e)
          }
        }
  
      }
    }, {
      noAck: true
    });
  });
});

// wss.on('connection', (ws) => {
//   console.log('WebSocket connection');
//   clients.add(ws);

//   // 监听消息
//   ws.on('message', (message) => {
//     console.log(`Received message: ` + message);
//     // 处理消息

//     for (const client of clients) {
//       if (client === ws) {
//         const data = JSON.parse(message); 
//         const status = data.status;
//         const requestBody = data.requestBody;
//         console.log(" status " + status + " req " + requestBody);
//         console.log(requestBody);

//         if (status === 'CAN_SEND_MESSAGE') {
//           console.log(`client: ` + client);
//           try {
//             const instance = axios.create({
//               baseURL: 'https://api.openai.com/v1/chat/',
//               responseType: 'stream',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.OPENAI_KEY}`
//               }
//             });

//             const request = instance.post('completions', requestBody);
      
//             request.then(response => {
//             const stream = response.data;
//               stream.on('data', chunk => {
//                 var json = chunk.toString();
//                 client.send(json);
//                 console.log(json);
//               });
//               stream.on('end', () => {
//               });
              
//               stream.on('error', error => {
//                   console.log(error);
//               });
//             });
//           } catch(e) {
//             console.log(e)
//           }
          
//         }
//       }
//     }
//   });

//   // 监听关闭连接
//   ws.on('close', () => {
//     clients.delete(ws);
//     console.log('WebSocket connection closed');
//   });
// });

// 路由处理函数
router.post('/', (req, res) => {
  console.log("openchat")
  res.json({message: "CONTENT_OK"});

});

module.exports = router;
