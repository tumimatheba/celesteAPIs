const express = require("express")
const { v4: uuidv4 } = require('uuid');
const router = express.Router()
const { vodaPayRequest } = require("../vodaPayRequest");
const baseUrl = process.env.BASE_URL;

router.post("/payment", async (req, res) => {
    const { userId } = req.body
    const expiry = DateTime.now().plus({ hours: 24 })
    const paymentExpiry = expiry.toISO('yyyy-MM-ddTHH:mm:ssZZ');
    const { amount } = req.body
    const paymentURL = `${baseUrl}/v2/payments/pay`;
    const requestBody = JSON.stringify(
        {
            "productCode": "CASHIER_PAYMENT",
            "salesCode": "51051000101000000011",
            "paymentNotifyUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm", // The endpoint on your server which we send the payment notification to
            "paymentRequestId": uuidv4(),
            "paymentRedirectUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm",
            "paymentExpiryTime": paymentExpiry,
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

module.exports = router;
