const express = require("express")
const router = express.Router()

const pricePerPerson = { price: 100 }

router.post("/price", (req, res) => {
    res.send(pricePerPerson);
});

module.exports = router;