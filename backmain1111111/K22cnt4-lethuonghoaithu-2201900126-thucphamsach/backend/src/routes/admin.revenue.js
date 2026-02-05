const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/revenue-week", (req, res) => {
  db.query(`
    SELECT DAYOFWEEK(ngay_dat) AS day, SUM(tongtien) AS total
    FROM donhang
    WHERE trangthai NOT IN ('Đã hủy') 
      AND YEARWEEK(ngay_dat, 0) = YEARWEEK(CURDATE(), 0)
    GROUP BY day
  `, (err, rows) => {
    if (err) {
      console.error("❌ Lỗi doanh thu tuần:", err);
      return res.status(500).json({ error: "Lỗi doanh thu tuần" });
    }

    const data = [0, 0, 0, 0, 0, 0, 0]; // CN → T7
    if (rows && rows.length > 0) {
      rows.forEach(r => {
        data[r.day - 1] = Number(r.total);
      });
    }
    res.json(data);
  });
});

// Thống kê tổng quan (Thẻ số liệu)
router.get("/summary", (req, res) => {
  const sql = `
    SELECT 
      (SELECT IFNULL(SUM(tongtien), 0) FROM donhang WHERE trangthai NOT IN ('Đã hủy')) AS totalRevenue,
      (SELECT COUNT(*) FROM donhang) AS totalOrders,
      (SELECT COUNT(DISTINCT ma_kh) FROM donhang) AS totalCustomers,
      (SELECT COUNT(*) FROM sanpham) AS totalProducts
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Phân bố trạng thái đơn hàng (Biểu đồ tròn)
router.get("/order-status", (req, res) => {
  const sql = "SELECT trangthai as label, COUNT(*) as value FROM donhang GROUP BY trangthai";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Top 5 sản phẩm bán chạy (Biểu đồ cột)
router.get("/top-products", (req, res) => {
  const sql = `
    SELECT sp.ten_sp as label, SUM(ct.soluong) as value 
    FROM chitiet_donhang ct
    JOIN sanpham sp ON ct.ma_sp = sp.ma_sp
    JOIN donhang d ON ct.ma_donhang = d.ma_donhang
    WHERE d.trangthai NOT IN ('Đã hủy')
    GROUP BY sp.ma_sp
    ORDER BY value DESC
    LIMIT 5
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.json([]);
    }
    res.json(results);
  });
});

module.exports = router;
