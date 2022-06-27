require("dotenv").config();
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const { frontEndRequest, signedFrontEndRequest } = require("../helpers/helpers");
const { verify } = require("../helpers/middleware");

const app = express();
app.use(express.json());

let menu = [
  {
    id: 1,
    food: "Glazed oysters with zucchini pearls and sevruga caviar",
    winePairing: "kleine zalze brut rose",
  },
  {
    id: 2,
    food: "Bream with asparagus, tempura mussels and a lime velouté",
    winePairing: "red city blend",
  },
  {
    id: 3,
    food: "Seared anhi tuna with provincial vegetables and tapenade croutons",
    winePairing: "bizoe semillon",
  },

  {
    id: 4,
    food: "Aged gouda with espresso, hazelnut and onion",
    winePairing: "thelema early harvest",
  },

  {
    id: 5,
    food: "Dark chocolate panna cotta with a rhubarb and cherry compote",
    winePairing: "clarington sauvignon blanc",
  },


];
const pricePerPerson = { price: 100 }
let orders = [];

app.post("/order", (req, res) => {
  const order = req.body;
  orders.push(order);
  console.log(orders);

  res.send("Added order to order table");
});

app.post("/menu", (req, res) => {
  res.send(menu);
});


// const testfunction = async (requestBody, path) => {


//   const options = {
//     method: "POST",
//     data: requestBody,
//     url: path,
//   };

//   const response = await axios(options)

//   return response;
// };

app.post("/price",async (req, res) => {

  res.send(pricePerPerson);
});

app.get("/menu/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  for (let item of menu) {
    console.log(item.id);
    if (item.id == id) {
      res.json(item);
      return;
    }
  }
  res.status(404).send("item not found");
});

app.put("/menu/:id", (req, res) => {
  const id = req.params.id;
  const newWine = "thelema late harvest";

  for (let i = 0; i < menu.length; i++) {
    let menuItem = menu[i];
    console.log(menuItem);
    if (menuItem.id == id) {
      menu[i].winePairing = newWine;
      console.log(menu[i].winePairing);
    }
  }
  res.send("menu Item is edited");
});

app.delete("/menu/:id", (req, res) => {
  const id = req.params.id;

  menu = menu.filter((i) => {
    if (i.id != id) {
      return true;
    }
    return false;
  });
  res.send("Menu item is deleted");
});

app.post("/order", (req, res) => {
  const order = req.body;
  orders.push(order);
  res.send("Added order to order table");
});

app.use(verify);
app.post("/auth", async (req, res) => {
  const { authCode } = req.body;

  const data = ({
    grantType: "AUTHORIZATION_CODE",
    authCode,
  });

  const tokenURL = 'https://vodapay-gateway.sandbox.vfs.africa/v2/authorizations/applyTokenSigned';

  const accessTokenResponse = await frontEndRequest(data, tokenURL);

  const { accessToken } = accessTokenResponse.data;


  const userUrl = `${baseUrl}/v2/customers/user/inquiryUserInfo`;
  const userData = JSON.stringify({
    accessToken,
  });

  const user = await frontEndRequest(userData, userUrl);
  const userInfo = user.data;

  const jsonWebToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECTRET);
  console.log(jsonWebToken);
  res.send({ userInfo, jsonWebToken });

});

const baseUrl = process.env.BASE_URL;
app.post("/payment", async (req, res) => {
  const {userId} = req.body
  const {amount} = req.body
  const paymentURL = "https://vodapay-gateway.sandbox.vfs.africa/v2/payments/pay";
  const requestBody = JSON.stringify(
    {
      "productCode": "CASHIER_PAYMENT", 
      "salesCode": "51051000101000000011", 
      "paymentNotifyUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm", // The endpoint on your server which we send the payment notification to
      "paymentRequestId": uuidv4(), 
      "paymentRedirectUrl": "http://mock.vision.vodacom.aws.corp/mock/api/v1/payments/notifyPayment.htm", 
      // "paymentExpiryTime":"{{paymentExpireyTime}}", // The time until the payment is valid until
      "paymentExpiryTime":"2022-07-22T17:49:31+08:00",
      "paymentAmount": {
        "currency": "ZAR", 
        "value": amount // The amount in South african cents for the sale
      },
      "order": {
        "goods": { // Additional details about the items purchased
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
        "orderDescription": "title", //The title of the payement which is displayed on the payment screens
        "buyer": {
          "referenceBuyerId":  userId 
        }
      }
    });

  const response = await frontEndRequest(requestBody, paymentURL);
  res.send(response.data);
 
});

app.post("/paymentNotification", async (req, res) => {
  const paymentURL = `${baseUrl}/v2/payments/pay`;
})


app.post("/verifyToken", (req, res) => {
  res.send("success");
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port http://localhost:${port}...`));
