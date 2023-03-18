const User = require('../../models/user/usermodel'); // 引入用户模型
const fs = require('fs')
const path = require('path');
let fileName;


async function uploadAvatar(req, res) {
  fileName = `wx_${Date.now()}.jpg`;
  const userId = req.body.userid;
  const openid = req.body.openid; // 获取请求中的 openid
  const username = req.body.username; // 获取请求中的 username
  // const data = JSON.parse(req);
  console.log('openid ' + openid + ' username ' + username)

  const base64 = req.body.avatar
  const savePath = path.join(__dirname, '../../public/images', fileName);

  const buffer = Buffer.from(base64, 'base64')

  // console.log(base64)
  if (!openid) {
    res.status(500).json({ message: 'openid is null' });
    return
  }
  
  fs.writeFile(savePath, buffer, (err) => {
    if (err) {
      console.error('文件已出现问题', err);
    } else {
      console.log('文件已保存');
      saveFileAndDelete(res, userId)
    }
  });

}

async function saveFileAndDelete(res, user_id) {
  const user = await User.findOne({ where: { user_id } }); // 查询是否已存在该用户
  // const user = await User.findByPk(userid);
  console.log(user)
  if (user) {
    // 如果已存在该用户，则返回已有的用户信息
    try {
      if (user.avatar) {
        const filePath = path.join(__dirname, '../../public/images', path.basename(user.avatar))
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
          console.log('文件已成功删除');
        });
      }
      const avatar = process.env.FILEBASE_URL + fileName;
      console.log("delete file is = " + user.avatar + " curFile " + avatar)
      await user.update({ avatar });
      res.status(200).json({ message: 'File upload success' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '更新用户失败' });
    }

  } else {
    res.status(200).json({ message: 'File upload success' });
  }
}

module.exports = {uploadAvatar};
