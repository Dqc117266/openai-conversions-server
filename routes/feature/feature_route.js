const express = require('express');
const router = express.Router();
const {getFeatureList} = require('../../controllers/feature/feature_controll');


router.post('/getFeatureList', getFeatureList);

module.exports = router;