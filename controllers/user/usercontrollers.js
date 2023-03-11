const User = require('../../models/user/usermodel');

// 创建用户
async function createUser(req, res) {
  console.log("createUser", "res = " + res)
  try {
    const {user_id, openid, unionid, username, avator, is_invited} = req.body;
    const user = await User.create({ user_id, openid, unionid, username, avator, is_invited});
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '创建用户失败' });
  }
}

// 查询所有用户
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询所有用户失败' });
  }
}

// 更新用户
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { user_id, openid, unionid, username, avator, is_invited } = req.body;
    const user = await User.findByPk(id);
    await user.update({ user_id, openid, unionid, username, avator, is_invited });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '更新用户失败' });
  }
}

// 删除用户
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    await user.destroy();
    res.json({ message: '删除用户成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除用户失败' });
  }
}

// 导出控制器
module.exports = { createUser, getAllUsers, updateUser, deleteUser };
