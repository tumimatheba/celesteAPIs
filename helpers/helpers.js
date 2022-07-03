require("dotenv").config();
const axios = require("axios");
const { DateTime } = require("luxon");
const crypto = require('crypto')

const fs = require('fs')
const clientId = process.env.CLIENT_ID;

const createSignature = ({ uriPath, clientId, requestTime, requestBody }) => {
  const privateKeyText = fs.readFileSync('certs/rsa_private_key.pem', 'utf8')
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

const vodaPayRequest = async (requestBody, path) => {
  const uriPath = new URL(path).pathname;
  const requestTime = DateTime.local().toISO();
  const signature = createSignature({ uriPath, clientId, requestTime, requestBody })

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": clientId,
    "request-time": requestTime,
    signature: `algorithm=RSA256, keyVersion=1, signature=${signature}`,
  };

  const options = {
    method: "POST",
    url: path,
    headers,
    data: requestBody,
  };

  const response = await axios(options)

  return response;
};

module.exports = { vodaPayRequest };
