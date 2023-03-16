const PaymentType = require('../../models/topay/goods_model'); // 引入用户模型
const PaymentRecord = require('../../models/topay/payment_record'); // 引入用户模型
const User = require("../../models/user/usermodel")
const { Sequelize } = require('sequelize');



async function getGoodsList(req, res) {
    try {
        const payment = await PaymentType.findAll();
        res.json(payment);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有商品失败' });
      }
}

async function getPaymentRecordList(req, res) {//查询所有付款记录
  try {
    const payRecord = await PaymentRecord.findAll();
    res.json(payRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '查询所有付款记录失败' });
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

// async function inviteFriends(req, res) {
//   try {
//     const { user_id, other_user_id } = req.body;
//     console.log(`userId ${user_id} otherUserId ${other_user_id}`);

//     if (user_id === other_user_id) {
//       return res.status(200).json({ message: '不可以推荐自己的id' });
//     }

//     const user = await User.findOne({ where: { user_id: other_user_id } });
//     console.log(user);

//     if (!user) {
//       return res.status(200).json({ message: '不存在此用户' });
//     }

//     if (user.is_invited) {
//       return res.status(200).json({ message: '该好友已被推荐' });
//     }

//     await User.update({ is_invited: true }, { where: { user_id: user_id } });
//     return res.status(200).json({ message: '推荐成功' });
    
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: '未知错误' });
//   }
// }

async function inviteFriends(req, res) {
  try {
    const { user_id, other_user_id } = req.body;
    console.log(`userId ${user_id} otherUserId ${other_user_id}`);

    if (user_id === other_user_id) {
      return res.status(200).json({ message: '不可以推荐自己的id' });
    }

    const [user, otherUser] = await Promise.all([
      User.findOne({ where: { user_id } }),
      User.findOne({ where: { user_id: other_user_id } })
    ]);

    if (!otherUser) {
      return res.status(200).json({ message: '不存在此用户' });
    }

    console.log("is_invited: " + user.is_invited);

    if (user.is_invited) {
      return res.status(200).json({ message: '该好友已被推荐' });
    }

    await Promise.all([
      User.update({ is_invited: true, balance_amount: Sequelize.literal('balance_amount + 2') }, { where: { user_id } }),
      User.update({ balance_amount: Sequelize.literal('balance_amount + 2') }, { where: { user_id: other_user_id } })
    ]);

    return res.status(200).json({ message: '推荐成功' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '未知错误' });
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

module.exports = { getGoodsList, getPaymentRecordList, createPaymentRecord, deleteUser, inviteFriends };