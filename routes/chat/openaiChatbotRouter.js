const express = require('express');
const axios = require('axios');
const WebSocket = require('ws');
const router = express.Router();
// 设置OpenAI API密钥和引擎ID
const openaiApiKey = process.env.OPENAI_KEY;

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  // 连接成功后，发送欢迎消息
  ws.send('Connected to the OpenAI chatbot.');

  // 初始化 OpenAI API 请求
  const openaiRequest = {
    "model": "gpt-3.5-turbo",
    "messages": [{role: "user", content: "你好，你可以说中文吗？"}],
    "max_tokens": 512,
    "stream": true
  };
  ws.on('message', function incoming(message) {
    openaiRequest.prompt = message.toString().trim();
    axios.post(
      `https://api.openai.com/v1/chat/completions`,
      openaiRequest,
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` },
        responseType: 'stream',
      }
    ).then(response => {
      response.data.on('data', data => {
        const message = data.toString();

        if (message) {
          ws.send(message);
        }
      });
    }).catch(error => {
      console.error(error);
    });
  });
});

// 客户端发起 WebSocket 连接时，将其升级为 WebSocket 连接
router.post('/', function(ws, req) {
  wss.handleUpgrade(req, ws, Buffer.alloc(0), function done(ws) {
    wss.emit('connection', ws, req);
  });
});

module.exports = router;