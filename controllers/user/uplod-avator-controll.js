const User = require('../../models/user/usermodel'); // 引入用户模型
const fs = require('fs')
const path = require('path');

const timestamp = Date.now();
const fileName = `wx_${timestamp}.jpg`;


async function uploadAvator(req, res) {
  const openid = req.body.openid; // 获取请求中的 openid
  const username = req.body.username; // 获取请求中的 username
  // const data = JSON.parse(req);
  console.log('openid' + openid + ' username ' + username)

  const base64 = req.body.avator
  const savePath = path.join(__dirname, '../../public/images', fileName);

  const buffer = Buffer.from(base64, 'base64')

  fs.writeFile(savePath, buffer, (err) => {
    if (err) throw err;
    console.log('文件已保存');
  });
  
  if (!openid) {
    res.status(500).json({ message: 'user_id is null' });
    return
  }
  const user = await User.findOne({ where: { openid } }); // 查询是否已存在该用户
    // const user = await User.findByPk(userId);
  if (user) {
    // 如果已存在该用户，则返回已有的用户信息
    try {
      
      if (user.avator) {
        const filePath = path.join(__dirname, '../../public/images', path.basename(user.avator))
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
          console.log('文件已成功删除');
        });
      }
      const avator = process.env.FILEBASE_URL + fileName;
      await user.update({ avator });
      res.status(200).json({ message: 'File upload success' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '更新用户失败' });
    }  

  }
}

module.exports = {uploadAvator};
