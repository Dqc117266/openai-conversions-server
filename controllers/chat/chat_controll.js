const Chat = require('../../models/chat/chat_model'); // 引入用户模型

async function getChatList(req, res) {
    try {
        const { conversation_id } = req.params;
        const chatList = await Chat.findAll({
            where: {
                conversation_id
            }
        });
        res.json(chatList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有聊天记录失败' });
    }
}

// 删除对话
async function deleteChatList(req, res) {
    try {
      const { conversation_id } = req.params;
      const chatList = await Chat.findByPk(conversation_id);
      await chatList.destroy();
      res.json({ message: '删除聊天记录成功' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '删除聊天记录失败' });
    }
  }


module.exports = { getChatList, deleteChatList };
