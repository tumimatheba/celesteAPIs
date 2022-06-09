require("dotenv").config();
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {frontEndRequest, signedFrontEndRequest} = require("../helpers/helpers");
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
 const pricePerPerson = {price: 100} 
 let orders = [];

app.post("/order", (req, res) => {
  const order = req.body;
  orders.push(order);
  console.log(orders);

  res.send("Added order to order table");
});

app.get("/menu", (req, res) => {
  res.send(menu);
});

app.get("/price", (req, res) => {
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

// app.use(verify);
const baseUrl = process.env.BASE_URL;



app.post("/auth", async (req, res) => {
   const { authCode } = req.body;
console.log(authCode);

  const data = JSON.stringify({
    grantType: "AUTHORIZATION_CODE",
    authCode,
  });

  const tokenURL = `${baseUrl}/v2/authorizations/applyTokenSigned`;

  const accessTokenResponse = await frontEndRequest(data, tokenURL);
   console.log(accessTokenResponse);
//   const { accessToken } = accessTokenResponse;
 
// console.log(accessToken);
  // const userUrl = `${baseUrl}/v2/customers/user/inquiryUserInfo`;
  // const userData = JSON.stringify({
  //   accessToken,
  // });

  // const user = await frontEndRequest(userData, userUrl);

  // const userInfo = user;
  // console.log(userInfo);
  // console.log(process.env.ACCESS_TOKEN_SECTRET);
  //  const jsonWebToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECTRET);
  //  res.send({userInfo, jsonWebToken});
  res.send("success");
  
});

// app.post("/auth", async (req, res) => {
//   const { authCode } = req.body;
// console.log(authCode);

//  const data = JSON.stringify({
//    grantType: "AUTHORIZATION_CODE",
//    authCode,
//  });

//  const tokenURL = `${baseUrl}/v2/authorizations/applyToken`;

//  const accessTokenResponse = await signedFrontEndRequest(data, tokenURL);

//  const { accessToken } = accessTokenResponse;
// console.log(accessToken);

// //  const userUrl = `${baseUrl}/v2/customers/user/inquiryUserInfo`;
// //  const userData = JSON.stringify({
// //    accessToken,
// //  });

// //  const user = await frontEndRequest(userData, userUrl);

// //  const userInfo = user;
// //  console.log(userInfo);
// //  console.log(process.env.ACCESS_TOKEN_SECTRET);
// //   const jsonWebToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECTRET);
// //   res.send({userInfo, jsonWebToken});
// res.send("success");
// });

app.post("/verifyToken", (req, res) => {
  res.send("success");
});

app.post("/pay", (req, res) => {
  res.send("success");
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port http://localhost:${port}`));
