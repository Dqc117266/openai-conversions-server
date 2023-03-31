const PaymentType = require('../../models/topay/goods_model'); // 引入用户模型
const PaymentRecord = require('../../models/topay/payment_record'); // 引入用户模型
const User = require("../../models/user/usermodel")
const { Sequelize } = require('sequelize');
const sequelize = require('../../models/sequelize');

async function getGoodsList(req, res) {
    try {
        const payment = await PaymentType.findAll();
        res.json(payment);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有商品失败' });
      }
}

async function createGood(req, res) {
  try {
    const {payment_type_name, payment_method, payment_type_content, payment_goods_detail} = req.body;
    const createGood = await PaymentType.create({ payment_type_name, payment_method, payment_type_content, payment_goods_detail});
    res.json(createGood);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '创建商品失败' });
    }
}

async function getPaymentRecordList(req, res) {//查询所有付款记录
  try {
    const {user_id} = req.body;
    const payRecord = await PaymentRecord.findAll({where:{user_id: parseInt(user_id)}, order: [['payment_time', 'DESC']]});
    res.json(payRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询所有付款记录失败' });
  }
}

async function deletePaymentRecordItem(req, res) {//查询所有付款记录
  try {
    const {user_id, payment_record_id} = req.body;

    const record = await PaymentRecord.findByPk(payment_record_id); // 查找 id 为 1 的记录
    await record.destroy(); // 删除记录
    res.status(204).end(); // 返回成功的响应
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除记录失败' });
  }
}


async function createPaymentRecord(req, res) {//创建付款记录
  try {
    const {user_id, payment_type_title, payment_amount, payment_time} = req.body;
    const createPay = await PaymentRecord.create({ user_id, payment_type_title, payment_amount, payment_time});
    res.json(createPay);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '创建付款记录失败' });
  }
}

async function inviteFriends(req, res) {
  try {
    const { user_id, other_user_id } = req.body;
    console.log(`userId ${user_id} otherUserId ${other_user_id}`);

    if (user_id === parseInt(other_user_id)) {
      return res.status(200).json({type: 101, message: '不可以推荐自己的id' });
    }

    const [user, otherUser] = await Promise.all([
      User.findOne({ where: { user_id } }),
      User.findOne({ where: { user_id: other_user_id } })
    ]);

    if (!otherUser) {
      return res.status(200).json({type: 102, message: '不存在此用户' });
    }

    console.log("is_invited: " + user.is_invited);

    if (user.is_invited) {
      return res.status(200).json({type: 103, message: '您已推荐过好友' });
    }

    // await Promise.all([
    //   User.update({ is_invited: true, balance_amount: Sequelize.literal('balance_amount + 2') }, { where: { user_id } }),
    //   User.update({ balance_amount: Sequelize.literal('balance_amount + 2') }, { where: { user_id: other_user_id } }),
    //   PaymentRecord.create({user_id: user_id, payment_type_title: "字数计费-邀请好友", payment_amount: "+2.00元", payment_source: `好友id：${other_user_id}`}),
    //   PaymentRecord.create({user_id: other_user_id, payment_type_title: "字数计费-被邀请好友", payment_amount: "+2.00元", payment_source: `好友id：${user_id}`})
    // ]);

    await sequelize.transaction(async (t) => {
      await User.update(
        { is_invited: true, balance_amount: Sequelize.literal('balance_amount + 2') },
        { where: { user_id }, transaction: t }
      );
      await User.update(
        { balance_amount: Sequelize.literal('balance_amount + 2') },
        { where: { user_id: other_user_id }, transaction: t }
      );
      await Promise.allSettled([
        PaymentRecord.create({
          user_id: user_id,
          payment_type_title: "字数充值-邀请好友",
          payment_amount: "+2.00元",
          payment_source: `好友id：${other_user_id}`,
        }, { transaction: t }),
        PaymentRecord.create({
          user_id: other_user_id,
          payment_type_title: "字数充值-被邀请好友",
          payment_amount: "+2.00元",
          payment_source: `好友id：${user_id}`,
        }, { transaction: t }),
      ]);
    });

    return res.status(200).json({type: 100, message: '推荐成功' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({type: 104, message: '未知错误' });
  }
}

//删除付款记录
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const payRecord = await PaymentRecord.findByPk(id);
    await payRecord.destroy();
    res.json({ message: '删除付款记录成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除付款记录失败' });
  }
}

module.exports = { getGoodsList, createGood, getPaymentRecordList, createPaymentRecord, deleteUser, inviteFriends, deletePaymentRecordItem };