const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// ================= HELPER =================
function generateMaDonHang() {
  return "DH" + Date.now().toString().slice(-8);
}

// ================= TẠO ĐƠN HÀNG =================
router.post("/", (req, res) => {
  const { ma_kh, ngay_dat, tongtien, ma_km, items, phuongthuc } = req.body;

  if (!tongtien || tongtien <= 0)
    return res.status(400).json({ error: "Tổng tiền không hợp lệ" });

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "Danh sách sản phẩm không hợp lệ" });

  const trangthai = phuongthuc === "COD" ? "Chờ xử lý" : "Chưa thanh toán";
  const ma_donhang = generateMaDonHang();

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });

    const sqlDonHang = `
      INSERT INTO donhang (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sqlDonHang,
      [ma_donhang, ma_kh, ngay_dat || new Date(), tongtien, trangthai, ma_km || null],
      (err) => {
        if (err) {
          return db.rollback(() =>
            res.status(500).json({ error: "Lỗi tạo đơn hàng" })
          );
        }

        const values = items.map((item, i) => [
          `CT${ma_donhang.slice(2)}${String(i + 1).padStart(2, "0")}`,
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
            return db.rollback(() =>
              res.status(500).json({ error: "Lỗi lưu chi tiết đơn hàng" })
            );
          }

          db.commit(() => {
            res.status(201).json({
              message: "Tạo đơn hàng thành công",
              ma_donhang,
            });
          });
        });
      }
    );
  });
});

// ================= THANH TOÁN =================
router.post("/thanhtoan", (req, res) => {
  const { ma_donhang, phuongthuc, sotien } = req.body;
  if (!ma_donhang || !phuongthuc || !sotien)
    return res.status(400).json({ error: "Thiếu dữ liệu" });

  const ma_thanhtoan = "TT" + Math.floor(100000 + Math.random() * 900000);

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });

    const sqlTT = `
      INSERT INTO thanhtoan (ma_thanhtoan, ma_donhang, phuongthuc, sotien, trangthai, thoigian_thanhtoan)
      VALUES (?, ?, ?, ?, 'Đã thanh toán', NOW())
    `;

    db.query(sqlTT, [ma_thanhtoan, ma_donhang, phuongthuc, sotien], (err) => {
      if (err) {
        return db.rollback(() =>
          res.status(500).json({ error: "Lỗi thanh toán" })
        );
      }

      db.query(
        "UPDATE donhang SET trangthai = 'Chờ xử lý' WHERE ma_donhang = ?",
        [ma_donhang],
        (err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ error: "Lỗi cập nhật đơn hàng" })
            );
          }

          db.commit(() =>
            res.json({ message: "Thanh toán thành công" })
          );
        }
      );
    });
  });
});

// ================= ADMIN =================
router.get("/admin", (req, res) => {
  db.query(
    `SELECT * FROM donhang ORDER BY ngay_dat DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Lỗi server" });
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
  const { trangthai } = req.body;
  db.query(
    "UPDATE donhang SET trangthai = ? WHERE ma_donhang = ?",
    [trangthai, req.params.ma_donhang],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi server" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

module.exports = router;
