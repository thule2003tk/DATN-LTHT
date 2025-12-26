const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const donhangController = require("../controllers/donhangController");
const db = require("../config/db");

router.post("/", verifyToken, donhangController.createDonHang);
router.get("/", verifyToken, donhangController.getDonHang);
router.put("/:ma_donhang", verifyToken, checkAdmin, donhangController.updateTrangThai);

module.exports = router;

// ====== TẠO ĐƠN HÀNG (khách hàng) ======
router.post("/", verifyToken, async (req, res) => {
  const { ma_kh, ma_km } = req.body;

  try {
    // Lấy giỏ hàng
    const [cartItems] = await db.promise().query(
      "SELECT * FROM giohang INNER JOIN sanpham ON giohang.ma_sp = sanpham.ma_sp WHERE ma_kh = ?",
      [ma_kh]
    );

    if (cartItems.length === 0) return res.status(400).json({ error: "Giỏ hàng trống" });

    // Tính tổng tiền
    let tongtien = 0;
    cartItems.forEach(item => {
      tongtien += item.soluong * item.gia;
    });

    // Kiểm tra khuyến mãi
    let maKmInsert = null;
    if (ma_km) {
      const [km] = await db.promise().query("SELECT * FROM khuyenmai WHERE ma_km = ?", [ma_km]);
      if (km.length > 0 && tongtien >= km[0].giatri_don) {
        tongtien -= (tongtien * km[0].mucgiam) / 100;
        maKmInsert = ma_km;
      }
    }

    // Tạo đơn hàng
    const [result] = await db.promise().query(
      "INSERT INTO donhang (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km) VALUES (UUID_SHORT(), ?, NOW(), ?, 'Đang xử lý', ?)",
      [ma_kh, tongtien, maKmInsert]
    );

    const ma_donhang = result.insertId;

    // Thêm chi tiết đơn hàng
    for (const item of cartItems) {
      await db.promise().query(
        "INSERT INTO chitiet_donhang (ma_ctdh, ma_donhang, ma_sp, soluong, dongia) VALUES (UUID_SHORT(), ?, ?, ?, ?)",
        [ma_donhang, item.ma_sp, item.soluong, item.gia]
      );
    }

    res.json({ message: "Đặt hàng thành công", ma_donhang });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

// ====== LẤY TẤT CẢ ĐƠN HÀNG (admin) ======
router.get("/", verifyToken, checkAdmin, async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT d.ma_donhang, d.ngay_dat, d.tongtien, d.trangthai, k.ten_kh
      FROM donhang d
      JOIN khachhang k ON d.ma_kh = k.ma_kh
      ORDER BY d.ngay_dat DESC
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ====== LẤY CHI TIẾT ĐƠN HÀNG ======
router.get("/detail/:id", verifyToken, checkAdmin, async (req, res) => {
  const ma_donhang = req.params.id;
  try {
    const [orderDetails] = await db.promise().query(`
      SELECT c.ma_sp, s.ten_sp, c.soluong, c.dongia
      FROM chitiet_donhang c
      JOIN sanpham s ON c.ma_sp = s.ma_sp
      WHERE c.ma_donhang = ?
    `, [ma_donhang]);

    res.json({ ma_donhang, items: orderDetails });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ====== CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ======
router.put("/status/:id", verifyToken, checkAdmin, async (req, res) => {
  const ma_donhang = req.params.id;
  const { trangthai } = req.body;

  try {
    await db.promise().query(
      "UPDATE donhang SET trangthai = ? WHERE ma_donhang = ?",
      [trangthai, ma_donhang]
    );
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
