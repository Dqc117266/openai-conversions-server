const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/user/usercontrollers');

// 创建用户
router.post('/createUser', createUser);

// 查询所有用户
router.get('/getAllUsers', getAllUsers);

// 更新用户
router.put('/:id', updateUser);

// 删除用户
router.delete('/:id', deleteUser);

module.exports = router;
