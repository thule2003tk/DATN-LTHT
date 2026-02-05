// Lấy thống kê
const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const db = require("../db"); // tùy cấu trúc project

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

module.exports = router;
