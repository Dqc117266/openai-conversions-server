const express = require('express');
const router = express.Router();
const {getFeatureList, addFeature} = require('../../controllers/feature/feature_controll');


router.post('/getFeatureList', getFeatureList);
router.post('/addFeature', addFeature);


module.exports = router;