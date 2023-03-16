const express = require('express');
const router = express.Router();
const {getGoodsList, getPaymentRecordList, createPaymentRecord, deleteUser, inviteFriends} = require('../../controllers/pay/goods_controll');


router.post('/getGoodsList', getGoodsList);
router.post('/getPaymentRecordList', getPaymentRecordList);
router.post('/createPaymentRecord', createPaymentRecord);
router.post('/inviteFriends', inviteFriends);
router.delete('/:id', deleteUser);

module.exports = router;