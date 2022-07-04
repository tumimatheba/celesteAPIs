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

app.post("/paymentNotification", async (req, res) => {
  const paymentURL = `${baseUrl}/v2/payments/pay`;
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port http://localhost:${port}...`));
