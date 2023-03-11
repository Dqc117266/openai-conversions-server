const PaymentType = require('../../models/topay/goods_model'); // 引入用户模型
const PaymentRecord = require('../../models/topay/payment_record'); // 引入用户模型


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

module.exports = { getGoodsList, getPaymentRecordList, createPaymentRecord, deleteUser };