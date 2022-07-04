const express = require("express");

const { verify } = require("./helpers/middleware");
const app = express();
app.use(express.json());
app.use(verify);

const menuRouter = require('./helpers/routes/menuRouter')
app.use(menuRouter)

const priceRouter = require('./helpers/routes/priceRouter')
app.use(priceRouter)

const authRouter = require('./helpers/routes/authRouter')
app.use(authRouter)

const payRouter = require('./helpers/routes/payRouter')
app.use(payRouter)

// app.post("/payment", async (req, res) => {
//   const { userId } = req.body
//   const { amount } = req.body
//   const paymentURL = `${baseUrl}/v2/payments/pay`;
//   const requestBody = JSON.stringify(
//     {
//       "productCode": "CASHIER_PAYMENT",
//       "salesCode": "51051000101000000011",
//       "paymentNotifyUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm", // The endpoint on your server which we send the payment notification to
//       "paymentRequestId": uuidv4(),
//       "paymentRedirectUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm",
//       "paymentExpiryTime": "2022-07-22T17:49:31+08:00",
//       "paymentAmount": {
//         "currency": "ZAR",
//         "value": amount
//       },
//       "order": {
//         "goods": {
//           "referenceGoodsId": "goods123",
//           "goodsUnitAmount": {
//             "currency": "ZAR",
//             "value": amount
//           },
//           "goodsName": "mobile1"
//         },
//         "env": {
//           "terminalType": "MINI_APP"
//         },
//         "orderDescription": "meal",
//         "buyer": {
//           "referenceBuyerId": userId
//         }
//       }
//     });

//   const response = await vodaPayRequest(requestBody, paymentURL);
//   res.send(response.data);

// });

app.post("/paymentNotification", async (req, res) => {
  const paymentURL = `${baseUrl}/v2/payments/pay`;
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port http://localhost:${port}...`));
