const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { showCart, addToCart, changeQuantity, removeFromCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", authMiddleware, showCart);
router.post("/add/:productId", authMiddleware, addToCart);
router.post("/quantity/:productId", authMiddleware, changeQuantity);
router.post("/remove/:productId", authMiddleware, removeFromCart);

module.exports = router;
