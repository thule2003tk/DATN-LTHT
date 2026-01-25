// Lấy thống kê
const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const db = require("../config/db"); // Correct path

// Thống kê tổng quan
router.get("/stats", verifyToken, checkAdmin, async (req, res) => {
  try {
    // Tổng số đơn hàng hôm nay
    const [ordersToday] = await db.query(
      `SELECT COUNT(*) AS count FROM donhang WHERE DATE(ngay_dat) = CURDATE()`
    );

    // Doanh thu tháng này
    const [revenueMonth] = await db.query(
      `SELECT SUM(tongtien) AS total FROM donhang 
       WHERE MONTH(ngay_dat) = MONTH(CURDATE()) AND YEAR(ngay_dat) = YEAR(CURDATE())`
    );

    // Tổng khách hàng
    const [customers] = await db.query(`SELECT COUNT(*) AS count FROM khachhang`);

    // Tổng sản phẩm
    const [products] = await db.query(`SELECT COUNT(*) AS count FROM sanpham`);

    res.json({
      ordersToday: ordersToday[0].count,
      revenueMonth: revenueMonth[0].total || 0,
      customers: customers[0].count,
      products: products[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Thống kê doanh thu theo tuần hiện tại (New Route)
router.get("/revenue-week", verifyToken, checkAdmin, async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT DAYOFWEEK(ngay_dat) AS day, SUM(tongtien) AS total
      FROM donhang
      WHERE YEARWEEK(ngay_dat, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY DAYOFWEEK(ngay_dat)
    `);

    // map dữ liệu thành mảng 7 ngày (CN=0, T2=1, ..., T7=6 in array logic, but DAYOFWEEK returns 1=Sun, 2=Mon...)
    // DAYOFWEEK: 1=Sun, 2=Mon, ..., 7=Sat
    // Array index: 0=Sun, 1=Mon, ..., 6=Sat
    const weekRevenue = Array(7).fill(0);

    data.forEach(item => {
      // item.day is 1..7
      if (item.day >= 1 && item.day <= 7) {
        weekRevenue[item.day - 1] = Number(item.total);
      }
    });

    res.json(weekRevenue);
  } catch (err) {
    console.error("Lỗi /revenue-week:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
