const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Lấy danh sách khách hàng (Có cả thông tin người đặt và thông tin nhận hàng cuối cùng)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      merged.ma_kh,
      merged.ten_kh,
      merged.email_taikhoan,
      merged.sdt_taikhoan,
      merged.diachi_taikhoan,
      merged.vai_tro,
      merged.trangthai,
      d_last.hoten_nhan as ten_nhan_cuoi,
      d_last.email_nhan as email_nhan_cuoi,
      d_last.sdt_nhan as sdt_nhan_cuoi,
      d_last.diachi_nhan as diachi_nhan_cuoi
    FROM (
      -- 1. Tài khoản người dùng đã đăng ký
      SELECT 
        CAST(ma_nguoidung AS CHAR) COLLATE utf8mb4_general_ci as ma_kh,
        hoten as ten_kh,
        email as email_taikhoan,
        sodienthoai as sdt_taikhoan,
        diachi as diachi_taikhoan,
        vai_tro,
        trangthai
      FROM nguoidung
      WHERE vai_tro != 'admin'

      UNION ALL

      -- 2. Khách hàng cũ (legacy) - Chỉ lấy nếu chưa có trong bảng người dùng để tránh trùng ID
      SELECT 
        ma_kh COLLATE utf8mb4_general_ci,
        ten_kh,
        email as email_taikhoan,
        sodienthoai as sdt_taikhoan,
        diachi as diachi_taikhoan,
        'member' as vai_tro,
        trangthai
      FROM khachhang
      WHERE ma_kh NOT IN (
        SELECT CAST(ma_nguoidung AS CHAR) COLLATE utf8mb4_general_ci FROM nguoidung
      )
    ) AS merged
    -- Join với đơn hàng gần nhất (Dùng INNER JOIN để chỉ lấy những ai đã đặt hàng theo yêu cầu của user)
    INNER JOIN donhang d_last ON d_last.ma_donhang = (
      SELECT ma_donhang FROM donhang 
      WHERE ma_kh = merged.ma_kh 
      ORDER BY ngay_dat DESC, ma_donhang DESC 
      LIMIT 1
    )
    ORDER BY merged.ma_kh ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi lấy danh sách khách hàng:", err.message);
      return res.status(500).json({ error: "Lỗi server", details: err.message });
    }
    res.json(rows);
  });
});

// Cập nhật thông tin khách hàng (Sửa)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { ten_kh, email, sodienthoai, diachi } = req.body;

  let sql;
  let params;

  if (id.startsWith("KH")) {
    sql = `
      UPDATE khachhang 
      SET ten_kh = ?, email = ?, sodienthoai = ?, diachi = ? 
      WHERE ma_kh = ?
    `;
    params = [ten_kh, email, sodienthoai, diachi, id];
  } else {
    sql = `
      UPDATE nguoidung 
      SET hoten = ?, email = ?, sodienthoai = ?, diachi = ? 
      WHERE ma_nguoidung = ?
    `;
    params = [ten_kh, email, sodienthoai, diachi, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật khách hàng:", err.message);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json({ message: "Cập nhật thành công" });
  });
});

// Chặn/Mở chặn người dùng (Khách hàng/Nhân viên)
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { trangthai } = req.body; // 'active' hoặc 'blocked'

  if (!['active', 'blocked'].includes(trangthai)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  let sql;
  if (id.startsWith("KH")) {
    sql = "UPDATE khachhang SET trangthai = ? WHERE ma_kh = ?";
  } else {
    sql = "UPDATE nguoidung SET trangthai = ? WHERE ma_nguoidung = ?";
  }

  db.query(sql, [trangthai, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật trạng thái người dùng:", err.message);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

module.exports = router;