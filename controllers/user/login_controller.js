const User = require('../../models/user/usermodel'); // 引入用户模型

async function createUser(req, res) {
  const openid = req.body.openid; // 获取请求中的 openid
  const user = await User.findOne({ where: { openid } }); // 查询是否已存在该用户

  if (user) {
    // 如果已存在该用户，则返回已有的用户信息
    res.status(200).json(user.toJSON());
  } else {
    // 如果不存在该用户，则创建一个新用户并插入数据库
    const newUser = await User.create({ openid });
    res.status(201).json(newUser.toJSON());
  }
}

module.exports = { createUser };
