const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const sanphamController = require("../controllers/sanphamController");

/* ================= DEBUG (DEV ONLY) ================= */
router.use((req, res, next) => {
  console.log("🔥 SANPHAM ROUTE HIT:", req.method, req.originalUrl);
  next();
});

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // phải trùng server.js
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Chỉ cho phép upload ảnh"), false);
};

const upload = multer({ storage, fileFilter });

/* ================= ROUTES ================= */
/* ========= PUBLIC ========= */

console.log("🛠️  Registering SANPHAM public routes...");

// ⭐ Sản phẩm nổi bật (Bán chạy)
router.get("/featured", (req, res, next) => {
  console.log("HIT: /api/sanpham/featured");
  sanphamController.getTopSellingProducts(req, res, next);
});

// 🆕 Sản phẩm mới
router.get("/newest", (req, res, next) => {
  console.log("HIT: /api/sanpham/newest");
  sanphamController.getNewArrivals(req, res, next);
});

// 🎁 Sản phẩm khuyến mãi
router.get("/promotion", (req, res, next) => {
  console.log("HIT: /api/sanpham/promotion");
  sanphamController.getPromotionProducts(req, res, next);
});

// Test router
router.get("/test", (req, res) => {
  console.log("HIT: /api/sanpham/test");
  res.json({ ok: true });
});

// Danh sách sản phẩm (Tất cả)
router.get("/", sanphamController.getAllSanPham);

// 🔥 Đơn vị + giá theo sản phẩm
// GET /api/sanpham/SP021/donvi
router.get("/:ma_sp/donvi", sanphamController.getDonViTheoSanPham);

// Chi tiết sản phẩm
router.get("/:ma_sp", sanphamController.getSanPhamByMa);

/* ========= ADMIN ========= */

// Thêm sản phẩm
router.post(
  "/",
  verifyToken,
  checkAdmin,
  upload.single("hinhanh"),
  sanphamController.createSanPham
);

// Cập nhật sản phẩm
router.put(
  "/:ma_sp",
  verifyToken,
  checkAdmin,
  upload.single("hinhanh"),
  sanphamController.updateSanPham
);

// Xóa sản phẩm
router.delete(
  "/:ma_sp",
  verifyToken,
  checkAdmin,
  sanphamController.deleteSanPham
);

module.exports = router;
