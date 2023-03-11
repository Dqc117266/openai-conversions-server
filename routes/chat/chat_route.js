const express = require('express');
const router = express.Router();
const {getChatList, deleteChatList} = require('../../controllers/chat/chat_controll');


router.post('/getChatList', getChatList);
router.delete('/:id', deleteChatList);

module.exports = router;