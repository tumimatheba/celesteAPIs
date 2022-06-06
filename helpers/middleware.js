require("dotenv").config();
const { append } = require("express/lib/response");
const jwt = require("jsonwebtoken");

const secretMerchantId = process.env.MERCHANT_ID;
 console.log(secretMerchantId);
const sectretAccessToken = process.env.ACCESS_TOKEN_SECTRET;

const verify = (req, res, next) => {
  
  if (req.path === "/auth") {
    console.log(req.path)
    verifyMerchant(req, res, next);
  } else {
    verifyToken(req, res, next);
  }
};

const verifyMerchant = (req, res, next) => {
  const { merchantId } = req.body;
  console.log(merchantId)
  if (!merchantId) return res.sendStatus(401);
  if (merchantId === secretMerchantId) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  const accessToken = authorization && authorization.split(" ")[1];
  if (accessToken == null) return res.sendStatus(401);

  jwt.verify(accessToken, sectretAccessToken, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Payment


module.exports = { verify };
