const db = require("../config/db");

// ========== TẠO ĐƠN HÀNG ==========
exports.createDonHang = (req, res) => {
  const ma_kh = req.user.ma_kh || req.user.ma_nguoidung || req.user.id;
  const { ma_km, hoten_nhan, sdt_nhan, diachi_nhan, ghichu, items } = req.body;

  // Hàm tạo mã ngẫu nhiên 10 ký tự
  const generateId = () => Math.random().toString(36).substr(2, 10).toUpperCase();

  const processOrder = (orderItems) => {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm trống" });
    }

    // Tính tổng tiền từ items (sử dụng dongia từ FE gửi lên)
    let tongtien = orderItems.reduce(
      (sum, item) => sum + item.soluong * item.dongia,
      0
    );

    const applyPromoAndInsert = (discountPercent = 0) => {
      const discountAmount = (tongtien * discountPercent) / 100;
      const finalTotal = tongtien - discountAmount;
      const ma_donhang = generateId();

      const insertDonHang = `
        INSERT INTO donhang (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km, hoten_nhan, sdt_nhan, diachi_nhan, ghichu)
        VALUES (?, ?, NOW(), ?, 'Chờ xử lý', ?, ?, ?, ?, ?)
      `;

      db.query(insertDonHang, [ma_donhang, ma_kh, finalTotal, ma_km || null, hoten_nhan, sdt_nhan, diachi_nhan, ghichu], (err2) => {
        if (err2) {
          console.error("Lỗi insert DonHang:", err2);
          return res.status(500).json(err2);
        }

        // Chèn chi tiết đơn hàng
        const detailPromises = orderItems.map(item => {
          return new Promise((resolve, reject) => {
            const ma_ctdh = generateId();
            db.query(
              `INSERT INTO chitiet_donhang (ma_ctdh, ma_donhang, ma_sp, soluong, dongia) VALUES (?, ?, ?, ?, ?)`,
              [ma_ctdh, ma_donhang, item.ma_sp, item.soluong, item.dongia],
              (errDetail) => {
                if (errDetail) reject(errDetail);
                else resolve();
              }
            );
          });
        });

        Promise.all(detailPromises)
          .then(() => {
            // Nếu không phải "Buy Now" (tức là thanh toán từ giỏ hàng), xóa giỏ hàng
            if (!req.body.isBuyNow) {
              db.query("DELETE FROM giohang WHERE ma_kh = ?", [ma_kh]);
            }

            res.json({
              message: "Đặt hàng thành công",
              ma_donhang,
              tongtien: finalTotal
            });
          })
          .catch(errDetail => {
            console.error("Lỗi insert ChiTietDonHang:", errDetail);
            res.status(500).json({ error: "Lỗi lưu chi tiết đơn hàng" });
          });
      });
    };

    if (ma_km) {
      db.query("SELECT * FROM khuyenmai WHERE ma_km = ? AND trangthai = 'Đang áp dụng'", [ma_km], (err3, promoResults) => {
        if (err3) return res.status(500).json(err3);

        if (promoResults.length > 0) {
          const promo = promoResults[0];
          if (tongtien >= promo.giatri_don) {
            applyPromoAndInsert(promo.mucgiam);
          } else {
            return res.status(400).json({ message: `Đơn hàng tối thiểu ${Number(promo.giatri_don).toLocaleString()}đ để áp dụng mã này.` });
          }
        } else {
          return res.status(400).json({ message: "Mã khuyến mãi không tồn tại hoặc đã hết hạn." });
        }
      });
    } else {
      applyPromoAndInsert(0);
    }
  };

  if (items && items.length > 0) {
    // Nếu FE gửi items kèm theo (Mua ngay hoặc có truyền list)
    processOrder(items);
  } else {
    // Fallback: Lấy từ giỏ hàng nếu FE không gửi items
    const sqlCart = `
      SELECT g.ma_sp, g.soluong, s.gia as dongia
      FROM giohang g
      JOIN sanpham s ON g.ma_sp = s.ma_sp
      WHERE g.ma_kh = ?
    `;
    db.query(sqlCart, [ma_kh], (err, cartItems) => {
      if (err) return res.status(500).json(err);
      processOrder(cartItems);
    });
  }
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
  const { trangthai, ly_do_huy } = req.body;

  db.query(
    "UPDATE donhang SET trangthai=?, ly_do_huy=? WHERE ma_donhang=?",
    [trangthai, ly_do_huy || null, ma_donhang],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật trạng thái thành công" });
    }
  );
};
