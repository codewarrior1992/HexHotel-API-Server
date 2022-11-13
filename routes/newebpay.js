const router = require('express').Router();
const crypto = require('crypto');
require('dotenv').config();

const { HashKey, HashIV, MerchantID, } = process.env;
const Version = 1.5; 
const RespondType = "JSON";

const genDataChain = (obj) =>{  
  const TimeStamp = Date.now(); 
  const MerchantOrderNo = Date.now();
  return `MerchantID=${MerchantID}&RespondType=${RespondType}&TimeStamp=${TimeStamp}&Version=${Version}&MerchantOrderNo=${MerchantOrderNo}&Amt=${obj.amt}&ItemDesc=${obj.desc}&Email=${obj.email}`
}

const aesEncryptFun = (strChain) => {
  const encrypt = crypto.createCipheriv('aes256', HashKey, HashIV);
  const enc = encrypt.update(strChain, 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

const shaEncryptFun = (aesEncrypt) => {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HashKey}&${aesEncrypt}&HashIV=${HashIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

router.post('/get-encrypt-data',(req,res)=>{

  const { total, desc, email } = req.body
  const obj = { total, desc, email }

  // 1. 請求字串
  const str = genDataChain(obj);

  // 2. 使用 aes256 將 字串 加密
  const trade_info = aesEncryptFun(str);

  // 3. 使用 sha256 將 aes 加密
  const trade_sha = shaEncryptFun(trade_info);

  res.send({
      TradeInfo : trade_info,
      TradeSha : trade_sha,
      MerchantID : MerchantID,
      Version : Version,
  })
})

router.post('/redirect',(req,res)=>{
  const URL = `https://codewarrior1992.github.io/hex-hotel/reserve/done`
  res.redirect(URL)
})

module.exports = router