const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const kmController = require("../controllers/khuyenmaiController");

// Lấy danh sách khuyến mãi
router.get("/", kmController.getKhuyenMai);

// Admin: CRUD
router.post("/", verifyToken, checkAdmin, kmController.createKhuyenMai);
router.put("/:ma_km", verifyToken, checkAdmin, kmController.updateKhuyenMai);
router.delete("/:ma_km", verifyToken, checkAdmin, kmController.deleteKhuyenMai);

// Khách: Lưu và Lấy mã của tôi
router.post("/save", verifyToken, kmController.saveKhuyenMai);
router.get("/mine", verifyToken, kmController.getMineKhuyenMai);

module.exports = router;
