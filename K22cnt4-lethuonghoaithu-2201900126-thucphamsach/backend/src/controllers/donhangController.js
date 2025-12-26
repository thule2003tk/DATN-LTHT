const db = require("../config/db");

// Tạo đơn hàng từ giỏ hàng
exports.createDonHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  const { ma_km } = req.body;

  // Lấy sản phẩm từ giỏ hàng
  const sqlCart = "SELECT g.ma_sp, g.soluong, s.gia FROM giohang g JOIN sanpham s ON g.ma_sp=s.ma_sp WHERE g.ma_kh=?";
  db.query(sqlCart, [ma_kh], (err, cartItems) => {
    if (err) return res.status(500).json({ error: err });
    if (cartItems.length === 0) return res.status(400).json({ error: "Giỏ hàng trống" });

    // Tính tổng tiền
    let tongtien = cartItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);

    // Lấy giảm giá nếu có
    if (ma_km) {
      db.query("SELECT mucgiam, giatri_don FROM khuyenmai WHERE ma_km=? AND trangthai='Đang áp dụng'", [ma_km], (err2, km) => {
        if (err2) return res.status(500).json({ error: err2 });
        if (km.length > 0 && tongtien >= km[0].giatri_don) {
          tongtien = tongtien - (tongtien * km[0].mucgiam) / 100;
        }
        createOrder();
      });
    } else {
      createOrder();
    }

    function createOrder() {
      const sqlInsert = "INSERT INTO donhang (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km) VALUES (UUID_SHORT(), ?, NOW(), ?, 'Chưa xử lý', ?)";
      db.query(sqlInsert, [ma_kh, tongtien, ma_km || null], (err3, result) => {
        if (err3) return res.status(500).json({ error: err3 });
        const ma_donhang = result.insertId;

        // Insert chi tiết đơn hàng
        cartItems.forEach(item => {
          const sqlCT = "INSERT INTO chitiet_donhang (ma_ctdh, ma_donhang, ma_sp, soluong, dongia) VALUES (UUID_SHORT(), ?, ?, ?, ?)";
          db.query(sqlCT, [ma_donhang, item.ma_sp, item.soluong, item.gia], (err4) => {
            if (err4) console.log(err4);
          });
        });

        // Xóa giỏ hàng sau khi tạo đơn
        db.query("DELETE FROM giohang WHERE ma_kh=?", [ma_kh], (err5) => {
          if (err5) console.log(err5);
        });

        res.json({ message: "Đơn hàng tạo thành công", tongtien });
      });
    }
  });
};

// Lấy đơn hàng của user
exports.getDonHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  const sql = "SELECT * FROM donhang WHERE ma_kh=?";
  db.query(sql, [ma_kh], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Admin: cập nhật trạng thái đơn hàng
exports.updateTrangThai = (req, res) => {
  const { ma_donhang } = req.params;
  const { trangthai } = req.body;
  const sql = "UPDATE donhang SET trangthai=? WHERE ma_donhang=?";
  db.query(sql, [trangthai, ma_donhang], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
};
