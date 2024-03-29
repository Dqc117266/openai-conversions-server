const express = require('express');
const router = express.Router();
const {getUserOpenId} = require('../controllers/user/user_openid');
const {uploadAvatar, uploadUserName} = require('../controllers/user/uplod-avatar-controll');

router.post('/checkOpenId', getUserOpenId);//检查openid如果数据库有openid了就返回，没有就重新注册一个账号

router.post('/uploadAvatar', uploadAvatar)

router.post('/uploadUserName', uploadUserName)


module.exports = router;