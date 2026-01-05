const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const donhangController = require("../controllers/donhangController");

// Khách hàng tạo đơn hàng
router.post("/", verifyToken, donhangController.createDonHang);

// Khách hàng xem đơn của mình
router.get("/", verifyToken, donhangController.getDonHangByUser);

// Admin xem tất cả đơn
router.get("/admin", verifyToken, checkAdmin, donhangController.getAllDonHang);

// Admin cập nhật trạng thái
router.put("/:ma_donhang", verifyToken, checkAdmin, donhangController.updateTrangThai);

module.exports = router;
