// Thống kê doanh thu theo tuần hiện tại
router.get("/revenue-week", verifyToken, checkAdmin, async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT DAYOFWEEK(ngay_dat) AS day, SUM(tongtien) AS total
      FROM donhang
      WHERE YEARWEEK(ngay_dat, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY DAYOFWEEK(ngay_dat)
    `);
    // map dữ liệu thành mảng 7 ngày
    const weekRevenue = Array(7).fill(0);
    data.forEach(item => {
      weekRevenue[item.day - 1] = Number(item.total);
    });
    res.json(weekRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});
