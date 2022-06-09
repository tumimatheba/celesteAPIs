require("dotenv").config();
const crypto = require('crypto')
const { DateTime } = require("luxon");
const fs  = require('fs')

const requestTime = DateTime.local().toISO();
const clientId = process.env.CLIENT_ID;
const privateKeyText = fs.readFileSync('src/rsa_private_key.pem', 'utf8')
const path = 'https://vodapay-gateway.sandbox.vfs.africa/v2/authorizations/applyTokenSigned';
const method = "POST"
const body = {
   grantType: "AUTHORIZATION_CODE",
   authCode: "0000000001X66fG9Mi6H76pF00245249"
}

const uriPath = new URL(path).pathname
const unsignedContent = `${method} ${uriPath}\n${clientId}.${requestTime}.${JSON.stringify(body)}}`
console.log(unsignedContent);
 
const signUnsignContent = () => {
 
   const privateKey = crypto.createPrivateKey(privateKeyText, 'utf8');
   const signer = crypto.createSign('RSA-SHA256');
   signer.write(unsignedContent);
   signer.end();
   let signed = signer.sign(privateKey, 'base64');
   return signed
}

const signature = signUnsignContent();
// console.log(signature);
module.exports = {signature, requestTime}
   



