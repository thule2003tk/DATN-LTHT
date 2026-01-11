const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Helper: Tạo mã đơn hàng tự động (nếu bạn chưa có auto-increment hoặc muốn format DHxxxx)
function generateMaDonHang() {
  return "DH" + Date.now().toString().slice(-8);
}

// TẠO ĐƠN HÀNG MỚI - Hoàn chỉnh
router.post("/", (req, res) => {
  const { ma_kh, ngay_dat, tongtien, trangthai = "Chờ xử lý", ma_km, items } = req.body;

  console.log("=== NHẬN YÊU CẦU TẠO ĐƠN HÀNG ===");
  console.log("Body:", JSON.stringify(req.body, null, 2));

  // Validate cơ bản
  if (!tongtien || tongtien <= 0) {
    return res.status(400).json({ error: "Tổng tiền không hợp lệ" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Danh sách sản phẩm không hợp lệ" });
  }

  // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
  db.beginTransaction((err) => {
    if (err) {
      console.error("Lỗi bắt đầu transaction:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    // 1. Insert vào bảng donhang
    const ma_donhang = generateMaDonHang(); // hoặc để auto-increment thì bỏ dòng này và lấy insertId

    const sqlDonHang = `
      INSERT INTO donhang (ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sqlDonHang,
      [ma_donhang, ma_kh || null, ngay_dat || new Date(), tongtien, trangthai, ma_km || null],
      (err, result) => {
        if (err) {
          db.rollback(() => {
            console.error("LỖI INSERT DONHANG:", err.message, err.sql);
            return res.status(500).json({ error: "Lỗi tạo đơn hàng", details: err.message });
          });
          return;
        }

        // 2. Insert chi tiết sản phẩm (chitiet_donhang)
        const valuesChiTiet = items.map((item, index) => [
          `CT${ma_donhang.slice(2)}${String(index + 1).padStart(2, "0")}`, // tạo ma_ctdh: CT + phần số của DH + index
          ma_donhang,
          item.ma_sp,
          item.soluong,
          item.dongia || item.gia, // frontend gửi dongia hoặc gia đều được
        ]);

        if (valuesChiTiet.length > 0) {
          const sqlChiTiet = `
            INSERT INTO chitiet_donhang (ma_ctdh, ma_donhang, ma_sp, soluong, dongia)
            VALUES ?
          `;

          db.query(sqlChiTiet, [valuesChiTiet], (err) => {
            if (err) {
              db.rollback(() => {
                console.error("LỖI INSERT CHITIET_DONHANG:", err.message, err.sql);
                return res.status(500).json({ error: "Lỗi lưu chi tiết sản phẩm", details: err.message });
              });
              return;
            }

            // Thành công → commit
            db.commit((err) => {
              if (err) {
                db.rollback(() => res.status(500).json({ error: "Lỗi commit transaction" }));
                return;
              }

              console.log(`Tạo đơn hàng thành công: ${ma_donhang}, ${items.length} sản phẩm`);
              res.status(201).json({
                message: "Tạo đơn hàng thành công",
                ma_donhang: ma_donhang,
              });
            });
          });
        } else {
          // Không có items → vẫn commit
          db.commit(() => {
            res.status(201).json({ message: "Tạo đơn hàng thành công (không có sản phẩm)", ma_donhang });
          });
        }
      }
    );
  });
});

// LẤY TẤT CẢ ĐƠN HÀNG (ADMIN) - ĐÃ SỬA TÊN CỘT
router.get("/admin", (req, res) => {
  const sql = `
    SELECT ma_donhang, ma_kh, ngay_dat, tongtien, trangthai, ma_km 
    FROM donhang 
    ORDER BY ngay_dat DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("LỖI LẤY DANH SÁCH ĐƠN HÀNG:", err.message);
      return res.status(500).json({ error: "Lỗi server", details: err.message });
    }
    res.json(rows);
  });
});

// LẤY CHI TIẾT ĐƠN HÀNG (đã có, chỉ sửa tên cột nếu cần)
router.get("/detail/:ma_donhang", (req, res) => {
  const { ma_donhang } = req.params;
  const sql = `
    SELECT ma_ctdh, ma_sp, soluong, dongia 
    FROM chitiet_donhang 
    WHERE ma_donhang = ?
  `;

  db.query(sql, [ma_donhang], (err, rows) => {
    if (err) {
      console.error("LỖI LẤY CHI TIẾT:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(rows);
  });
});

// CẬP NHẬT TRẠNG THÁI - ĐÃ SỬA TÊN CỘT
router.put("/:ma_donhang", (req, res) => {
  const { ma_donhang } = req.params;
  const { trangthai } = req.body;

  if (!trangthai) {
    return res.status(400).json({ error: "Thiếu trạng thái mới" });
  }

  const sql = "UPDATE donhang SET trangthai = ? WHERE ma_donhang = ?";

  db.query(sql, [trangthai, ma_donhang], (err, result) => {
    if (err) {
      console.error("LỖI CẬP NHẬT TRẠNG THÁI:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

module.exports = router;