const express = require("express");
const router = express.Router();
const donvisanphamController = require("../controllers/donvisanphamController");

// Lấy tất cả đơn vị sản phẩm
router.get("/", donvisanphamController.getAllDonViSanPham);

// Lấy đơn vị sản phẩm theo mã
router.get("/:ma_donvisp", donvisanphamController.getDonViSanPhamByMa);

// Lấy đơn vị sản phẩm theo mã san pham
router.get("/sanpham/:ma_sp", donvisanphamController.getDonViSanPhamByMaSP);

// Tạo đơn vị sản phẩm mới
router.post("/", donvisanphamController.createDonViSanPham);

// Cập nhật đơn vị sản phẩm
router.put("/:ma_donvisp", donvisanphamController.updateDonViSanPham);

// Xóa đơn vị sản phẩm
router.delete("/:ma_donvisp", donvisanphamController.deleteDonViSanPham);

module.exports = router;
