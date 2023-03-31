const express = require('express');
const router = express.Router();
const { getConversationList, deleteConversation, createConversation, reNameConversation } = require('../../controllers/conversation/conversation_controll');


router.post('/getConversationList', getConversationList);
router.post('/createConversation', createConversation);
router.post('/deleteConversation', deleteConversation);
router.post('/reNameConversation', reNameConversation);

module.exports = router;