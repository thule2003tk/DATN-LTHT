const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, checkStaffOrAdmin } = require("../middlewares/auth");

/**
 * GET: /api/admin/notifications
 * Lấy danh sách các thông báo mới (Đơn hàng, Tồn kho, Người dùng)
 */
router.get("/", verifyToken, checkStaffOrAdmin, async (req, res) => {
    try {
        const notifications = [];
        const isAll = req.query.all === 'true';
        const interval = isAll ? '30 DAY' : '2 DAY';
        const limit = isAll ? 100 : 20;

        // 1. Kiểm tra đơn hàng mới (Chờ xử lý)
        const [orders] = await db.promise().query(`
      SELECT 'order' as type, ma_donhang as id, hoten_nhan as title, tongtien as content, ngay_dat as time
      FROM donhang 
      WHERE (trangthai LIKE '%Chờ xử lý%' OR trangthai = 'Chờ xử lý')
      AND ngay_dat >= NOW() - INTERVAL ${interval}
      ORDER BY ngay_dat DESC
      LIMIT ${limit}
    `);

        orders.forEach(o => {
            notifications.push({
                type: 'order',
                id: o.id,
                title: `Đơn hàng mới từ ${o.title || "Khách ẩn danh"}`,
                content: o.content ? `Tổng tiền: ${Number(o.content).toLocaleString()}đ` : "Giá trị chưa xác định",
                time: o.time,
                link: `/admin/orders`
            });
        });

        // 2. Kiểm tra sản phẩm sắp hết hàng (Số lượng <= 5)
        const [lowStock] = await db.promise().query(`
      SELECT 'stock' as type, ma_sp as id, ten_sp as title, soluong_ton as content
      FROM sanpham
      WHERE soluong_ton <= 5
      LIMIT ${isAll ? 50 : 10}
    `);

        lowStock.forEach(s => {
            notifications.push({
                type: 'stock',
                id: s.id,
                title: `Cảnh báo kho: ${s.title}`,
                content: `Mặt hàng này chỉ còn ${s.content} sản phẩm`,
                time: new Date(),
                link: `/admin/products`
            });
        });

        // 3. Kiểm tra người dùng mới đăng ký
        const [newUsers] = await db.promise().query(`
      SELECT 'user' as type, ma_nguoidung as id, ten_dangnhap as title, ngay_tao as time
      FROM nguoidung
      WHERE vai_tro IN ('member', 'customer', 'CUSTOMER')
      AND ngay_tao >= NOW() - INTERVAL ${interval}
      ORDER BY ngay_tao DESC
      LIMIT ${limit}
    `);

        newUsers.forEach(u => {
            notifications.push({
                type: 'user',
                id: u.id,
                title: `Thành viên mới: ${u.title}`,
                content: `Vừa tạo tài khoản trên hệ thống`,
                time: u.time,
                link: `/admin/users`
            });
        });

        // Sắp xếp theo thời gian mới nhất
        notifications.sort((a, b) => {
            const timeB = b.time ? new Date(b.time) : new Date(0);
            const timeA = a.time ? new Date(a.time) : new Date(0);
            return timeB - timeA;
        });

        res.json(notifications);
    } catch (err) {
        console.error("❌ Lỗi API Notifications:", err);
        res.status(500).json({ error: "Lỗi server khi lấy thông báo" });
    }
});

module.exports = router;
