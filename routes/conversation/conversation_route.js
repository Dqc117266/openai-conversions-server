const express = require('express');
const router = express.Router();
const {getConversationList, deleteConversation} = require('../../controllers/conversation/conversation_controll');


router.post('/getConversationList', getConversationList);
router.delete('/:id', deleteConversation);

module.exports = router;