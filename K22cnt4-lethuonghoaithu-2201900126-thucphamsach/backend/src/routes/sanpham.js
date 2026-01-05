const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { verifyToken, checkAdmin } = require("../middlewares/auth");
const sanphamController = require("../controllers/sanphamController");

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ⚠️ QUAN TRỌNG: KHÔNG phải src/uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file ảnh"), false);
  }
};

const upload = multer({ storage, fileFilter });

/* ================= ROUTES ================= */

// Lấy danh sách sản phẩm (PUBLIC)
router.get("/", sanphamController.getAllSanPham);

// Lấy chi tiết sản phẩm theo mã (PUBLIC)
router.get("/:ma_sp", sanphamController.getSanPhamByMa);

// Thêm sản phẩm (ADMIN)
router.post(
  "/",
  verifyToken,
  checkAdmin,
  upload.single("hinhanh"),
  sanphamController.createSanPham
);

// Cập nhật sản phẩm (ADMIN)
router.put(
  "/:ma_sp",
  verifyToken,
  checkAdmin,
  upload.single("hinhanh"),
  sanphamController.updateSanPham
);

// Xóa sản phẩm (ADMIN)
router.delete(
  "/:ma_sp",
  verifyToken,
  checkAdmin,
  sanphamController.deleteSanPham
);

module.exports = router;
