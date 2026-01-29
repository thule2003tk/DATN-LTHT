const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/revenue-week", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DAYOFWEEK(ngay_dat) AS day, SUM(tongtien) AS total
      FROM donhang
      WHERE trangthai IN ('Đã đặt', 'Đang giao')
      GROUP BY day
    `);

    const data = [0, 0, 0, 0, 0, 0, 0]; // CN → T7

    rows.forEach(r => {
      data[r.day - 1] = Number(r.total);
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi doanh thu" });
  }
});

module.exports = router;
