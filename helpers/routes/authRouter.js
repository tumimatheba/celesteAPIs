const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken");
const { vodaPayRequest } = require("../vodaPayRequest");
const baseUrl = process.env.BASE_URL;
// const app = express();
// app.use(express.json());

router.post("/auth", async (req, res) => {
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

module.exports = router;