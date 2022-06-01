require("dotenv").config();
const axios = require("axios");

// const baseUrl = process.env.BASE_URL;
const clientId = process.env.CLIENT_ID;
console.log(clientId);
const frontEndRequest = async (requestBody, url) => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": clientId,
    "request-time": "2021-02-22T17:49:26.913+08:00",
    Signature: "algorithm=RSA256, keyVersion=1, signature=testing_signatur",
  };

  const config = {
    method: "POST",
    url: url,
    headers,
    data: requestBody,
  };

  const response = await axios(config);
  return response.data;
};

module.exports = frontEndRequest;
