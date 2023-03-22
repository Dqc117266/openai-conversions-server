const Conversation = require('../../models/conversation/conversation_model'); // 引入用户模型

async function getConversationList(req, res) {
    try {
        const conversationList = await Conversation.findAll();
        res.json(conversationList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有对话列表失败' });
    }
}

async function createConversation(req, res) {
  try {
      const{user_id, conversation_name, avatar, conversation_content, conversation_openai_body} = req.body;
      const conversationList = await Conversation.create({user_id, conversation_name, avatar, conversation_content, conversation_openai_body});
      res.json(conversationList);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: '查询所有对话列表失败' });
  }
}

// 删除对话
async function deleteConversation(req, res) {
    try {
      const { conversation_id } = req.params;
      const user = await Conversation.findByPk(conversation_id);
      await user.destroy();
      res.json({ message: '删除对话成功' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '删除对话失败' });
    }
  }


module.exports = { getConversationList, deleteConversation };
