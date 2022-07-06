require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretMerchantId = process.env.MERCHANT_ID;
const sectretAccessToken = process.env.ACCESS_TOKEN_SECTRET;

const verify = (req, res, next) => {
  if (req.path === "/payment") {
    verifyToken(req, res, next);
  } else {
    verifyMerchant(req, res, next);
  }
};

const verifyMerchant = (req, res, next) => {
  const { merchantId } = req.body;
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

module.exports = { verify };
