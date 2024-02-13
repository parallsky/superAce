const NodeRSA = require('node-rsa')
const rsaKey = require('./rsaKey')
const crypto = require('crypto')

// const key = new NodeRSA({ b: 2048 }); //生成2048位的密钥
// let publicDer = key.exportKey("pkcs8-public-pem");  //公钥
// let privateDer = key.exportKey("pkcs1-private-pem");//私钥
let publicDer = rsaKey.public
let privateDer = rsaKey.private

let text = '我是老广'

let crypto_encrypted = crypto.publicEncrypt(publicDer, Buffer.from(text)).toString('base64')
console.log('加密：', crypto_encrypted)

let crypto_decrypted = crypto.privateDecrypt({
  key: privateDer,
  padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
}, Buffer.from(crypto_encrypted, 'base64')).toString('utf8')
console.log('解密：', crypto_decrypted)

// const decrypted2 = key.decrypt(crypto_encrypted, 'utf8')

// console.log('解密2：', decrypted2)
