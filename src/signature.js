require("dotenv").config();
const crypto = require('crypto')
const fs = require('fs')
const clientId = process.env.CLIENT_ID;
const createSignature = ({ uriPath, clientId, requestTime, requestBody }) => {
  const privateKeyText = fs.readFileSync('src/certs/rsa_private_key.pem', 'utf8');
  const unsignedContent = `POST ${uriPath}\n${clientId}.${requestTime}.${JSON.stringify(
    requestBody
  )}`;
  const privateKey = crypto.createPrivateKey(privateKeyText, 'utf8');
  const signer = crypto.createSign('RSA-SHA256');
  signer.write(unsignedContent);
  signer.end();
  let signed = signer.sign(privateKey, 'base64');
  return signed
}

module.exports = { createSignature }




