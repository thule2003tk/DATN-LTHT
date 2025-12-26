const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const sanphamController = require("../controllers/sanphamController");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", sanphamController.getAllSanPham);
router.get("/:ma_sp", sanphamController.getSanPhamByMa);
router.post("/", verifyToken, checkAdmin, upload.single("hinhanh"), sanphamController.createSanPham);
router.put("/:ma_sp", verifyToken, checkAdmin, upload.single("hinhanh"), sanphamController.updateSanPham);
router.delete("/:ma_sp", verifyToken, checkAdmin, sanphamController.deleteSanPham);

module.exports = router;
