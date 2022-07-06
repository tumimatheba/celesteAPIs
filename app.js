const express = require("express");
const { verify } = require("./helpers/middleware");
const app = express();

app.use(express.json());
app.use(verify);

const menuRouter = require('./routes/menuRouter')
app.use(menuRouter)

const priceRouter = require('./routes/priceRouter')
app.use(priceRouter)

const authRouter = require('./routes/authRouter')
app.use(authRouter)

const payRouter = require('./routes/payRouter')
app.use(payRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port http://localhost:${port}...`));
