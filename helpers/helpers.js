require("dotenv").config();
const axios = require("axios");
const {signature, requestTime} = require("../src/signature")

const clientId = process.env.CLIENT_ID;

const frontEndRequest = async (requestBody, path) => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": clientId,
    "request-time": requestTime,
    "signature": `algorithm=RSA256, keyVersion=1, signature=${signature}`
  };

  const config = {
    method: "POST",
    url: path,
    headers,
    data: requestBody,
  };

   const response =  await axios(config).catch(function (error) {
    console.log(error);
  });;

  // return response.data;
  return response
};

// const signedFrontEndRequest = async (requestBody, url) => {
//   const headers = {
//     "Content-Type": "application/json; charset=UTF-8",
//     "client-id": clientId,
//     "request-time": requestTime,
//     "signature": `algorithm=RSA256, keyVersion=1, signature=${signature}`,
//   };
// console.log(headers)
//   const config = {
//     method: "POST",
//     url: url,
//     headers,
//     data: requestBody,
//   };

//   const response = await axios(config).catch((err)=>{
// console.log(err);
//   });
//   console.log (response)
//   return response;
// };


module.exports = {frontEndRequest};
