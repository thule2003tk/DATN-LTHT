const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

console.log("✅ [DEBUG] Route file 'donhang.js' is being loaded by the server");

// ================= HELPER =================
function generateMaDonHang() {
  return "DH" + Date.now().toString().slice(-8);
}

// ================= TEST ROUTE =================
router.get("/test-route", (req, res) => {
  res.json({ message: "Don Hang Route is working!" });
});

// ================= CHI TIẾT ĐƠN HÀNG =================
router.get("/detail/:ma_donhang", (req, res) => {
  console.log("🔍 Fetching details for Order:", req.params.ma_donhang);
  const sql = `
    SELECT ct.*, s.ten_sp, s.hinhanh
    FROM chitiet_donhang ct
    JOIN sanpham s ON ct.ma_sp = s.ma_sp
    WHERE ct.ma_donhang = ?
  `;
  db.query(sql, [req.params.ma_donhang], (err, rows) => {
    if (err) {
      console.error("❌ Lỗi database detail:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    console.log(`✅ Trả về ${rows.length} sản phẩm cho đơn ${req.params.ma_donhang}`);
    res.json(rows);
  });
});

// ================= TẠO ĐƠN HÀNG =================
router.post("/", (req, res) => {
  console.log("📥 Incoming Order Request:", JSON.stringify(req.body, null, 2));
  const {
    ma_kh, tongtien, ma_km, items, phuongthuc,
    hoten_nhan, sdt_nhan, diachi_nhan, ghichu
  } = req.body;

  // 🛡️ Kiểm tra tài khoản có bị chặn không
  if (ma_kh) {
    const checkStatusSql = "SELECT trangthai FROM khachhang WHERE ma_kh = ?";
    db.query(checkStatusSql, [ma_kh], (err, results) => {
      if (!err && results.length > 0 && results[0].trangthai === 'blocked') {
        return res.status(403).json({ error: "Tài khoản của bạn hiện đang bị chặn đặt hàng. Vui lòng liên hệ hotline." });
      }
      // Tiếp tục xử lý tạo đơn hàng nếu không bị chặn
      proceedOrder();
    });
  } else {
    proceedOrder(); // Khách vãng lai
  }

  function proceedOrder() {
    if (!tongtien || tongtien <= 0)
      return res.status(400).json({ error: "Tổng tiền không hợp lệ" });

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "Danh sách sản phẩm không hợp lệ" });

    // Trạng thái ban đầu: 
    // - COD: Chờ xử lý
    // - Chuyển khoản: Chờ thanh toán
    const trangthai = phuongthuc === "COD" ? "Chờ xử lý" : "Chờ thanh toán";
    const ma_donhang = generateMaDonHang();

    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: "Lỗi server" });

      const sqlDonHang = `
      INSERT INTO donhang 
      (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km, 
       hoten_nhan, sdt_nhan, diachi_nhan, ghichu, phuongthuc)
      VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      // 🔍 Sử dụng ma_kh được gửi từ frontend (đã drop FK nên chấp nhận cả numeric ID)
      const insert_ma_kh = ma_kh || null;

      db.query(
        sqlDonHang,
        [
          ma_donhang,
          insert_ma_kh,
          tongtien,
          trangthai,
          ma_km || null,
          hoten_nhan || null,
          sdt_nhan || null,
          diachi_nhan || null,
          ghichu || null,
          phuongthuc || "COD"
        ],
        (err) => {
          if (err) {
            console.error("❌ Lỗi insert donhang:", err);
            return db.rollback(() =>
              res.status(500).json({ error: "Lỗi tạo đơn hàng: " + err.message })
            );
          }

          const values = items.map((item, i) => [
            `C${ma_donhang.slice(3)}${String(i + 1).padStart(2, "0")}`, // Truncate to 1 + 7 + 2 = 10 chars
            ma_donhang,
            item.ma_sp,
            item.soluong,
            item.dongia || item.gia,
          ]);

          const sqlCT = `
          INSERT INTO chitiet_donhang (ma_ctdh, ma_donhang, ma_sp, soluong, dongia)
          VALUES ?
        `;

          db.query(sqlCT, [values], (err) => {
            if (err) {
              console.error("❌ Lỗi insert chitiet_donhang:", err);
              return db.rollback(() =>
                res.status(500).json({ error: "Lỗi lưu chi tiết đơn hàng: " + err.message })
              );
            }

            // Xóa giỏ hàng trong database
            db.query("DELETE FROM giohang WHERE ma_kh = ?", [ma_kh], (err) => {
              if (err) console.error("❌ Lỗi xóa giỏ hàng database:", err);

              db.commit(() => {
                res.status(201).json({
                  message: "Tạo đơn hàng thành công",
                  ma_donhang,
                  trangthai
                });
              });
            });
          });
        }
      );
    });
  }
});

// ================= THANH TOÁN =================
router.post("/thanhtoan", (req, res) => {
  const { ma_donhang, phuongthuc, sotien } = req.body;
  if (!ma_donhang || !phuongthuc || !sotien)
    return res.status(400).json({ error: "Thiếu dữ liệu" });

  const ma_thanhtoan = "TT" + Date.now().toString().slice(-13);

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });

    const sqlTT = `
      INSERT INTO thanhtoan (ma_thanhtoan, ma_donhang, phuongthuc, sotien, trangthai, thoigian_thanhtoan)
      VALUES (?, ?, ?, ?, 'Đã thanh toán', NOW())
    `;

    db.query(sqlTT, [ma_thanhtoan, ma_donhang, phuongthuc, sotien], (err) => {
      if (err) {
        console.error("❌ Lỗi insert thanhtoan:", err);
        return db.rollback(() =>
          res.status(500).json({ error: "Lỗi ghi nhận thanh toán" })
        );
      }

      db.query(
        "UPDATE donhang SET trangthai = 'Chờ xử lý' WHERE ma_donhang = ?",
        [ma_donhang],
        (err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ error: "Lỗi cập nhật trạng thái đơn hàng" })
            );
          }

          db.commit(() =>
            res.json({ message: "Xác nhận thanh toán thành công", ma_thanhtoan })
          );
        }
      );
    });
  });
});

// ================= ADMIN =================
router.get("/admin", (req, res) => {
  console.log("👉 Admin fetching all orders...");
  db.query(
    `SELECT * FROM donhang ORDER BY ngay_dat DESC`,
    (err, rows) => {
      if (err) {
        console.error("❌ Lỗi lấy đơn hàng admin:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }
      console.log(`✅ Trả về ${rows.length} đơn hàng`);
      res.json(rows);
    }
  );
});

// ================= USER =================
router.get("/user/:ma_kh", (req, res) => {
  db.query(
    `SELECT * FROM donhang WHERE ma_kh = ? ORDER BY ngay_dat DESC`,
    [req.params.ma_kh],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Lỗi server" });
      res.json(rows);
    }
  );
});

// ================= CẬP NHẬT TRẠNG THÁI =================
router.put("/:ma_donhang", (req, res) => {
  const { trangthai, ly_do_huy } = req.body;
  db.query(
    "UPDATE donhang SET trangthai = ?, ly_do_huy = ? WHERE ma_donhang = ?",
    [trangthai, ly_do_huy || null, req.params.ma_donhang],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi server" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

// (Moved to top)

module.exports = router;
