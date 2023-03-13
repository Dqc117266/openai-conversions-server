const crypto = require('crypto-js');

const verifySignature = (req, res, next) => {
  const signature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];
  const requestBody = req.body;

  const calculatedSignature = crypto.SHA256(`${timestamp}.${JSON.stringify(requestBody)}.${process.env.AES_KEY}`).toString(); 
  console.log("calculatedSignature: " + calculatedSignature)
  console.log("signature: " + signature)


  if (signature === calculatedSignature) {
    next();
  } else {
    res.status(403).send('Invalid signature');
  }
}

module.exports = verifySignature;