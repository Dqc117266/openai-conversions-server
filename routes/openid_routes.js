const express = require('express');
const router = express.Router();
const {getUserOpenId} = require('../controllers/user/user_openid');
const {uploadAvator} = require('../controllers/user/uplod-avator-controll');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const timestamp = Date.now();
const fileName = `wx_${timestamp}.jpg`;


router.post('/checkOpenId', getUserOpenId);

router.post('/uploadAvator', uploadAvator)

module.exports = router;