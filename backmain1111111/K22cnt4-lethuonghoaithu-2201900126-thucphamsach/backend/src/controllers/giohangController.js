const db = require("../config/db");

// 1️⃣ Lấy giỏ hàng theo user (từ token)
exports.getGioHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;

  const sql = `
    SELECT g.ma_giohang, g.ma_sp, g.soluong,
           s.ten_sp, s.gia, s.hinhanh
    FROM giohang g
    JOIN sanpham s ON g.ma_sp = s.ma_sp
    WHERE g.ma_kh = ?
  `;

  db.query(sql, [ma_kh], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// 2️⃣ Thêm vào giỏ
exports.addToGioHang = (req, res) => {
  const ma_kh = req.user.ma_nguoidung;
  const { ma_sp, soluong } = req.body;

  const checkSql = `
    SELECT * FROM giohang WHERE ma_kh=? AND ma_sp=?
  `;

  db.query(checkSql, [ma_kh, ma_sp], (err, rows) => {
    if (rows.length > 0) {
      db.query(
        "UPDATE giohang SET soluong = soluong + ? WHERE ma_giohang=?",
        [soluong, rows[0].ma_giohang],
        () => res.json({ message: "Đã cập nhật số lượng" })
      );
    } else {
      db.query(
        "INSERT INTO giohang VALUES (UUID_SHORT(), ?, ?, ?)",
        [ma_kh, ma_sp, soluong],
        () => res.json({ message: "Đã thêm vào giỏ hàng" })
      );
    }
  });
};

// 3️⃣ Update số lượng
exports.updateSoLuong = (req, res) => {
  db.query(
    "UPDATE giohang SET soluong=? WHERE ma_giohang=?",
    [req.body.soluong, req.params.ma_giohang],
    () => res.json({ message: "Cập nhật thành công" })
  );
};

// 4️⃣ Xóa
exports.deleteFromGioHang = (req, res) => {
  db.query(
    "DELETE FROM giohang WHERE ma_giohang=?",
    [req.params.ma_giohang],
    () => res.json({ message: "Đã xóa" })
  );
};
