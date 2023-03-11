const express = require('express');
const router = express.Router();
const {getUsageList} = require('../../controllers/usage/usage_controll');


router.post('/getUsageList', getUsageList);

module.exports = router;