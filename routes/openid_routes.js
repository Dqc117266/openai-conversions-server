const express = require('express');
const router = express.Router();
const {getUserOpenId} = require('../controllers/user/user_openid');


router.post('/checkOpenId', getUserOpenId);


module.exports = router;