require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const { vodaPayRequest } = require("../helpers/helpers");
const { verify } = require("../helpers/middleware");
const { pricePerPerson, menu } = require("../helpers/initialData");
const baseUrl = process.env.BASE_URL;
const app = express();
app.use(express.json());
app.use(verify);


//use Router
app.post("/menu", (req, res) => {
  res.send(menu);
});

app.post("/price", async (req, res) => {
  res.send(pricePerPerson);
});

app.post("/auth", async (req, res) => {
  const { authCode } = req.body;

  const data = ({
    grantType: "AUTHORIZATION_CODE",
    authCode,
  });

  const tokenURL = `${baseUrl}/v2/authorizations/applyTokenSigned`;
  const accessTokenResponse = await vodaPayRequest(data, tokenURL);
  const { accessToken } = accessTokenResponse.data;

  const userUrl = `${baseUrl}/v2/customers/user/inquiryUserInfo`;
  const userData = JSON.stringify({
    accessToken,
  });

  const user = await vodaPayRequest(userData, userUrl);
  const userInfo = user.data;

  const jsonWebToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECTRET);
  res.send({ userInfo, jsonWebToken });

});

app.post("/payment", async (req, res) => {
  const { userId } = req.body
  const { amount } = req.body
  const paymentURL = `${baseUrl}/v2/payments/pay`;
  const requestBody = JSON.stringify(
    {
      "productCode": "CASHIER_PAYMENT",
      "salesCode": "51051000101000000011",
      "paymentNotifyUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm", // The endpoint on your server which we send the payment notification to
      "paymentRequestId": uuidv4(),
      "paymentRedirectUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm",
      "paymentExpiryTime": "2022-07-22T17:49:31+08:00",
      "paymentAmount": {
        "currency": "ZAR",
        "value": amount
      },
      "order": {
        "goods": {
          "referenceGoodsId": "goods123",
          "goodsUnitAmount": {
            "currency": "ZAR",
            "value": amount
          },
          "goodsName": "mobile1"
        },
        "env": {
          "terminalType": "MINI_APP"
        },
        "orderDescription": "meal",
        "buyer": {
          "referenceBuyerId": userId
        }
      }
    });

  const response = await vodaPayRequest(requestBody, paymentURL);
  res.send(response.data);

});

app.post("/paymentNotification", async (req, res) => {
  const paymentURL = `${baseUrl}/v2/payments/pay`;
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port http://localhost:${port}...`));
