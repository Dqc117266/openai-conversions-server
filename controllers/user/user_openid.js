const sequelize = require('../../models/sequelize');
const User = require('../../models/user/usermodel'); // 引入用户模型
const PaymentRecord = require('../../models/topay/payment_record'); // 引入用户模型
const IdGenerator = require('../../utils/snowflake_util');
const AesCipher = require('../../utils/aes_cipher')
const Usage = require('../../models/usage/usage_model')
const aesCipher = new AesCipher();
const {getOpenId} = require('../../utils/get_openid_util');
const moment = require('moment-timezone');

const idGenerator = new IdGenerator(1, 1);

// 在控制器层中处理请求，获取 openid
async function getUserOpenId(req, res) {
  const { code } = req.body;
  try {
    const data = await getOpenId(code);
    const openid = data.openid;
    let unionid = data.unionid;
    // 将获取到的 openid 存入数据库
    const isUser = await User.findOne({ where: { openid } }); // 查询是否已存在该用户
    console.log("data " + data + " user " + isUser + " openid " + openid)
    if (isUser) {
      try {
        // const users = await User.findAll();
        // let aesText = aesCipher.encrypt(users[0].openid, process.env.AES_KEY);
        // users[0].openid = aesText;
        res.json({user: isUser, secretKey: process.env.AES_KEY});
        console.log(isUser)
  
        // res.json(users[0]);
        // console.log(users[0])
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有用户失败' });
      }
    } else {//create new user
      createUserAndRechargeRecord(res, openid, unionid)
    }
    // ...
    // res.json({ openid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取 openid 失败' });
  }
}

async function createUserAndRechargeRecord(res, openid, unionid) {
  const user_id = idGenerator.generate();
  console.log("usrid = " + user_id + " openid " + openid + " unionid " + unionid); // 输出9位数字ID
  // const open_id = openid
  const username = '微信用户';//default name
  const avator = '';
  const is_invited = false;
  const balance_amount = "5.00";
  const payment_amount = '+5.00元'
  const payment_type_title = '字数计费-新用户试用';
  const payment_source = ''

  await sequelize.transaction(async (t) => {
    //create user
    try {
      let user = await User.create({
        user_id, openid, unionid, username, avator, is_invited, balance_amount
      }, {transaction: t});

      const now = new Date();
      const isoString = now.toISOString();
      user.duration_expiration_date = isoString;
      res.json({user: user, secretKey: process.env.AES_KEY});
      console.log(user)

      await PaymentRecord.create({
        user_id, payment_type_title, payment_amount
      }, { transaction: t})

      const moment = require('moment-timezone');
      // 获取当前时间并转换为中国时区
      const currentTime = moment().tz('Asia/Shanghai');
      // 格式化时间为 YYYY-MM-DD
      const formattedDate = currentTime.format('YYYY-MM-DD');
      await Usage.create({
        user_id, usage_date: formattedDate, usage_amount: 0, usage_wordcount: 0
     }, { transaction: t});

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: 'fail' });
    }
  })
}

module.exports = {
  getUserOpenId,
};
