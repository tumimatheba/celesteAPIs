require("dotenv").config();
const axios = require("axios");
const { DateTime } = require("luxon");
const { createSignature } = require('./signature')
const clientId = process.env.CLIENT_ID;

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
