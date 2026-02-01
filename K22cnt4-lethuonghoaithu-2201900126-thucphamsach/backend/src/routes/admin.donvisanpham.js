const express = require("express");
const router = express.Router();
const donvisanphamController = require("../controllers/donvisanphamController");

/* ================= GET ================= */
router.get("/", donvisanphamController.getAllDonViSanPham);

// Lấy đơn vị theo mã sản phẩm
router.get("/sanpham/:ma_sp", donvisanphamController.getDonViSanPhamByMaSP);

/* ================= POST ================= */
router.post("/", donvisanphamController.createDonViSanPham);

/* ================= PUT ================= */
router.put("/:ma_donvisp", donvisanphamController.updateDonViSanPham);

/* ================= DELETE ================= */
router.delete("/:ma_donvisp", donvisanphamController.deleteDonViSanPham);

module.exports = router;
