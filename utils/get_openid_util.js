const request = require('request');

// 通过微信接口获取用户 openid
function getOpenId(code) {
    return new Promise((resolve, reject) => {
      const appid = process.env.APP_ID;
      const secret = process.env.APP_SECRET;
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
      request(url, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          const data = JSON.parse(body);
          if (data.openid) {
            resolve(data);
          } else {
            reject(data.errmsg);
          }
        }
      });
    });
}

module.exports = { getOpenId }; 
