const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const giohangController = require("../controllers/giohangController");

router.get("/", verifyToken, giohangController.getGioHang);
router.post("/", verifyToken, giohangController.addToGioHang);
router.put("/:ma_giohang", verifyToken, giohangController.updateSoLuong);
router.delete("/:ma_giohang", verifyToken, giohangController.deleteFromGioHang);

module.exports = router;
