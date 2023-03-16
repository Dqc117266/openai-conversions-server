const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const axios = require('axios').default;
const openaiApiKey = process.env.OPENAI_KEY;
const apiUrl = 'https://api.openai.com/v1/completions';
const requestBody = {
  "model": "gpt-3.5-turbo",
  "messages": [{role: "user", content: "使用 OpenAI的API 来学习英语"}],
  "max_tokens": 512,
  "stream": true
}

async function getOpenAiDate() {
    //  const completion = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{role: "user", content: "你好吗"}]
    //   });

    const instance = axios.create({
      baseURL: 'https://api.openai.com/v1/chat/',
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      }
    });
  
    const request = instance.post('completions', requestBody);

    request.then(response => {
    const stream = response.data;
    let str;
    stream.on('data', chunk => {
      var json = chunk.toString();
      // const cleanStr = json.replace(/\r?\n|\r/g, ' ');
      // const data = JSON.parse(cleanStr.substring(cleanStr.indexOf('{'), cleanStr.lastIndexOf('}') + 1));
      // console.log(str);
      // console.log(json);
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
}

// const axios = require('axios').default;
// const openaiApiKey = process.env.OPENAI_KEY;
// const apiUrl = 'https://api.openai.com/v1/completions';
// const requestBody = {
//   "model": "text-davinci-003",
//   "prompt": "你叫什么名字呢？",
//   "temperature": 0.7,
//   "max_tokens": 50,
//   "stream": true
// }


// async function getOpenAiDate() {

//     const instance = axios.create({
//         baseURL: 'https://api.openai.com/v1/',
//         responseType: 'stream',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${openaiApiKey}`
//         }
//       });
    
//     const request = instance.post('completions', requestBody);

//     request.then(response => {
//     const stream = response.data;
//     let str;
//     stream.on('data', chunk => {
//       str += chunk
//       console.log(str.toString());
//     });
//     stream.on('error', error => {
//         console.log(error);
//     });
//     });
// }

module.exports = getOpenAiDate