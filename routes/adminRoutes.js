const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    showDashboard,
    showAddProduct,
    addProduct,
    updateProductStock
} = require("../controllers/adminController");

const router = express.Router();

router.get("/",authMiddleware,adminMiddleware,showDashboard);
router.get("/products/new",authMiddleware,adminMiddleware,showAddProduct);
router.post("/products",authMiddleware,adminMiddleware,addProduct);
router.post("/products/:productId/stock",authMiddleware,adminMiddleware,updateProductStock);

module.exports = router;
