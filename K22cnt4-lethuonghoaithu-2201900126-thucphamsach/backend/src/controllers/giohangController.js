const db = require("../config/db");

// Lấy giỏ hàng của khách hàng
exports.getGioHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung; // từ token
  const sql = `
    SELECT g.ma_giohang, g.ma_sp, g.soluong, s.ten_sp, s.gia, s.hinhanh
    FROM giohang g
    JOIN sanpham s ON g.ma_sp = s.ma_sp
    WHERE g.ma_kh = ?`;
  
  db.query(sql, [ma_kh], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Thêm sản phẩm vào giỏ hàng
exports.addToGioHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  const { ma_sp, soluong } = req.body;

  const sqlCheck = "SELECT * FROM giohang WHERE ma_kh=? AND ma_sp=?";
  db.query(sqlCheck, [ma_kh, ma_sp], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      // Update số lượng
      const sqlUpdate = "UPDATE giohang SET soluong = soluong + ? WHERE ma_giohang = ?";
      db.query(sqlUpdate, [soluong, results[0].ma_giohang], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: "Cập nhật giỏ hàng thành công" });
      });
    } else {
      // Insert mới
      const sqlInsert = "INSERT INTO giohang (ma_giohang, ma_kh, ma_sp, soluong) VALUES (UUID_SHORT(), ?, ?, ?)";
      db.query(sqlInsert, [ma_kh, ma_sp, soluong], (err3) => {
        if (err3) return res.status(500).json({ error: err3 });
        res.json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
      });
    }
  });
};

// Xóa sản phẩm khỏi giỏ hàng
exports.deleteFromGioHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  const ma_giohang = req.params.ma_giohang;

  const sql = "DELETE FROM giohang WHERE ma_giohang=? AND ma_kh=?";
  db.query(sql, [ma_giohang, ma_kh], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
  });
};
