const Conversation = require('../../models/conversation/conversation_model'); // 引入用户模型
const Chat = require('../../models/chat/chat_model'); // 引入用户模型

async function getConversationList(req, res) {
  try {
    const user_id = req.body.user_id;
    const conversationList = await Conversation.findAll({where: {user_id: user_id}, order: [['updated_at', 'DESC']]});
    res.json(conversationList);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: '查询所有对话列表失败' });
  }
}

async function createConversation(req, res) {
  try {
      const user_id = req.body.user_id;
      const conversation_name = req.body.conversation_name;
      const avatar = req.body.avatar;
      const conversation_content = req.body.conversation_content;
      const conversation_feature_info = req.body.conversation_feature_info;
      console.log(" user_id " + user_id + " conversation_name " + conversation_name + " avatar " + avatar + " conversation_content " + conversation_content + " conversation_feature_info " + conversation_feature_info);

      // const{user_id, conversation_name, avatar, conversation_content, conversation_feature_info} = req.body;
      const conversationList = await Conversation.create({user_id, conversation_name, avatar, conversation_content, conversation_feature_info});
      
      console.log("conversationList:")
      console.log(conversationList);
      res.json(conversationList);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: '创建对话列表失败' });
  }
}

// 删除对话
async function deleteConversation(req, res) {
  try {
    const { conversation_id } = req.body;
    const user = await Conversation.findByPk(conversation_id);
    await user.destroy();
    const chats = await Chat.findAll({ where: { conversation_id } });
    await Promise.all(chats.map(chat => chat.destroy()));
    res.json({ message: '删除对话成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除对话失败' });
  }
}

// 修改对话名称
async function reNameConversation(req, res) {
  try {
    const { conversation_id, conversation_name } = req.body;
    
    // 检查请求参数是否存在
    if (!conversation_id || !conversation_name) {
      return res.status(400).json({ message: '缺少必要的参数' });
    }
    
    // 查找对应的对话
    const conversation = await Conversation.findByPk(conversation_id);
    if (!conversation) {
      return res.status(404).json({ message: '对话不存在' });
    }
    
    // 修改对话名称
    conversation.conversation_name = conversation_name;
    await conversation.save();
    
    // 返回修改后的对话数据
    res.json({ message: '修改对话名称成功', conversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '修改对话名称失败' });
  }
}


module.exports = { getConversationList, deleteConversation, createConversation, reNameConversation };
