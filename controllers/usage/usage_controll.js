const Usage = require('../../models/usage/usage_model'); // 引入用户模型

async function getUsageList(req, res) {
    try {
        const { user_id } = req.params;
        const usageList = await Usage.findAll({where : {user_id : user_id}});
        res.json(usageList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有功能表失败' });
    }
}


module.exports = { getUsageList };
