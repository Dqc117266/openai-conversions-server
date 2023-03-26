const User = require('../../models/user/usermodel'); // 引入用户模型
const fs = require('fs')
const path = require('path');
let fileName;


async function uploadAvatar(req, res) {
  try {
    fileName = `wx_${Date.now()}.jpg`;
    const userId = req.body.userid;
    const openid = req.body.openid; // 获取请求中的 openid
    // const data = JSON.parse(req);
    console.log('openid ' + openid)
  
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
  
  } catch (e) {
    res.status(500).json({ message: 'error' });
    console.log("error: " + e)
  }
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

async function uploadUserName(req, res) {
  const userId = req.body.userid;
  const username = req.body.username;

  console.log("userId " + userId + " username " + username)
  if (!username) {
    res.status(500).json({ message: 'username 为空' });
    return
  }
  try {
    const user = await User.findByPk(userId); // 查询是否已存在该用户
  
    if (user) {
      await User.update({username: username}, {where: {user_id : userId}})
      res.status(200).json({message: '修改成功' });
    }
  } catch (err) {
    res.status(500).json({ message: '修改名称失败', error: err.message });
  }
  
}

module.exports = {uploadAvatar, uploadUserName};
