const db = require("../config/db");

// ========== TẠO ĐƠN HÀNG ==========
exports.createDonHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  const { ma_km } = req.body;

  const sqlCart = `
    SELECT g.ma_sp, g.soluong, s.gia
    FROM giohang g
    JOIN sanpham s ON g.ma_sp = s.ma_sp
    WHERE g.ma_kh = ?
  `;

  db.query(sqlCart, [ma_kh], (err, cartItems) => {
    if (err) return res.status(500).json(err);
    if (cartItems.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống" });

    let tongtien = cartItems.reduce(
      (sum, item) => sum + item.soluong * item.gia,
      0
    );

    const insertDonHang = `
      INSERT INTO donhang (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km)
      VALUES (UUID_SHORT(), ?, NOW(), ?, 'Chờ xử lý', ?)
    `;

    db.query(insertDonHang, [ma_kh, tongtien, ma_km || null], (err2, result) => {
      if (err2) return res.status(500).json(err2);

      const ma_donhang = result.insertId;

      cartItems.forEach(item => {
        db.query(
          `INSERT INTO chitiet_donhang
           (ma_ctdh, ma_donhang, ma_sp, soluong, dongia)
           VALUES (UUID_SHORT(), ?, ?, ?, ?)`,
          [ma_donhang, item.ma_sp, item.soluong, item.gia]
        );
      });

      db.query("DELETE FROM giohang WHERE ma_kh = ?", [ma_kh]);

      res.json({
        message: "Đặt hàng thành công",
        ma_donhang,
        tongtien
      });
    });
  });
};

// ========== USER XEM ĐƠN ==========
exports.getDonHangByUser = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  db.query(
    "SELECT * FROM donhang WHERE ma_kh = ? ORDER BY ngay_dat DESC",
    [ma_kh],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ========== ADMIN XEM TẤT CẢ ==========
exports.getAllDonHang = (req, res) => {
  db.query(
    "SELECT * FROM donhang ORDER BY ngay_dat DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ========== ADMIN CẬP NHẬT ==========
exports.updateTrangThai = (req, res) => {
  const { ma_donhang } = req.params;
  const { trangthai } = req.body;

  db.query(
    "UPDATE donhang SET trangthai=? WHERE ma_donhang=?",
    [trangthai, ma_donhang],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật trạng thái thành công" });
    }
  );
};
