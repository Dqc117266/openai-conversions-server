const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const axios = require('axios');

const requestBody = {
  "model": "gpt-3.5-turbo",
  "messages": [{role: "system", content: "你是一个英语老师，擅长教学"}, {role: "user", content: "holle"}],
  "max_tokens": 1024,
  "stream": true
}

// 路由处理函数
router.post('/getOpenAi', (req, res) => {
  res.send('Hello World!');
});

// WebSocket 处理
// const socket = new WebSocket('ws://127.0.0.1:8080/chat');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  // 监听消息
  ws.on('message', (message) => {
    console.log(`Received message: ` + message);
    // 处理消息

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
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
          let str;
          stream.on('data', chunk => {
            var json = chunk.toString();
            client.send(json);
            // const cleanStr = json.replace(/\r?\n|\r/g, ' ');
            // const data = JSON.parse(cleanStr.substring(cleanStr.indexOf('{'), cleanStr.lastIndexOf('}') + 1));
            // console.log(str);
            console.log(json);
          });
          stream.on('end', () => {
            // try {
            //   const data = JSON.parse(rawData);
            //   const name = data.name; // 获取 name 字段的值
            //   console.log(name);
            // } catch (e) {
            //   console.error(e.message);
            // }
          });
          
          stream.on('error', error => {
              console.log(error);
          });
        });
        // client.send(`Broadcast: ${message}`);
      }
    });

    // ws.send(`You sent: ${message}`);
  });

  // 监听关闭连接
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

module.exports = router;
