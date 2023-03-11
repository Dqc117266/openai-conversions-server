const request = require('request');
const User = require('../../models/user/usermodel'); // 引入用户模型
const IdGenerator = require('../../utils/snowflake_util');

const idGenerator = new IdGenerator(1, 1);


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

// 在控制器层中处理请求，获取 openid
async function getUserOpenId(req, res) {
  const { code } = req.body;
  try {
    const data = await getOpenId(code);
    console.log("data " + data)
    const openid = data.openid;
    let unionid = data.unionid;
    // 将获取到的 openid 存入数据库
    const isUser = await User.findOne({ where: { openid } }); // 查询是否已存在该用户
    if (isUser) {
      try {
        const users = await User.findAll();
        res.json(users);
        console.log(users)
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有用户失败' });
      }
    } else {

      try {
        const user_id = idGenerator.generate();
        console.log("usrid = " + user_id + " openid " + openid + " unionid " + unionid); // 输出9位数字ID
        // const open_id = openid
        const username = '微信用户';
        const avator = '';
        const is_invited = false;
        if (typeof unionid === 'undefined') {
          unionid = null;
        }
        // const {user_id, openid, unionid, username, avator, is_invited} = req.body;
        const user = await User.create({ user_id, openid, unionid, username, avator, is_invited});
        res.json(user);
        console.log(user)

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: '创建用户失败' });
      }

    }
    // ...
    // res.json({ openid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取 openid 失败' });
  }
}

module.exports = {
  getUserOpenId,
};
