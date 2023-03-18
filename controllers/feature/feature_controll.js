const Feature = require('../../models/feature/feature_model'); // 引入用户模型

async function getFeatureList(req, res) {
    try {
        const payRecord = await Feature.findAll();
        res.json(payRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '查询所有功能表失败' });
    }
}

async function addFeature(req, res) {
    const { feature_name, feature_desc, feature_avatar, feature_openai_body } = req.body;

    Feature.create(feature_name, feature_desc, feature_avatar, feature_openai_body)
      .then((payRecord) => {
        res.json(payRecord);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: '创建功能表失败' });
      });
  }
  


module.exports = { getFeatureList };
