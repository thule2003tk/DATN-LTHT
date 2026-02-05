const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ltht_thucphamsach'
});

console.log("🚀 Starting Customer Sync: (Ordering Users Only)");

// Bước 1: Lấy tất cả mã khách hàng duy nhất từ bảng donhang
db.query("SELECT DISTINCT ma_kh FROM donhang WHERE ma_kh IS NOT NULL", (err, orders) => {
    if (err) {
        console.error("❌ Error fetching orders:", err);
        process.exit(1);
    }

    const maKhList = orders.map(o => o.ma_kh);
    console.log(`🔍 Found ${maKhList.length} unique customer IDs in donhang table.`);

    let processed = 0;
    if (maKhList.length === 0) {
        console.log("✅ No ordering customers found.");
        process.exit(0);
    }

    maKhList.forEach(id => {
        // Bước 2: Kiểm tra xem ID này thuộc về nguoidung, khachhang hay là khách vãng lai (REC_...)
        const sqlUser = "SELECT * FROM nguoidung WHERE ma_nguoidung = ?";
        db.query(sqlUser, [id], (err, users) => {
            if (!err && users && users.length > 0) {
                const u = users[0];
                sync(String(u.ma_nguoidung), u.hoten, u.email, u.sodienthoai, u.diachi, u.ngay_tao, u.trangthai);
            } else {
                // Thử tìm trong bảng khachhang cũ
                const sqlKH = "SELECT * FROM khachhang WHERE ma_kh = ?";
                db.query(sqlKH, [id], (err, legacy) => {
                    if (!err && legacy && legacy.length > 0) {
                        const l = legacy[0];
                        sync(l.ma_kh, l.ten_kh, l.email, l.sodienthoai, l.diachi, l.ngay_tao, l.trangthai);
                    } else {
                        // Có thể là khách vãng lai hoặc người nhận (REC_...)
                        // Lấy thông tin từ đơn hàng gần nhất
                        const sqlOrderInfo = "SELECT hoten_nhan, email_nhan, sdt_nhan, diachi_nhan, ngay_dat FROM donhang WHERE ma_kh = ? ORDER BY ngay_dat DESC LIMIT 1";
                        db.query(sqlOrderInfo, [id], (err, orderInfo) => {
                            if (!err && orderInfo && orderInfo.length > 0) {
                                const oi = orderInfo[0];
                                sync(id, oi.hoten_nhan, oi.email_nhan, oi.sdt_nhan, oi.diachi_nhan, oi.ngay_dat, 'active');
                            } else {
                                checkDone();
                            }
                        });
                    }
                });
            }
        });
    });

    function sync(ma_kh, ten, email, sdt, diachi, ngay, status) {
        const sqlSync = `
      INSERT INTO khachhang (ma_kh, ten_kh, email, sodienthoai, diachi, ngay_tao, trangthai)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        ten_kh = VALUES(ten_kh),
        email = VALUES(email),
        sodienthoai = VALUES(sodienthoai),
        diachi = VALUES(diachi)
    `;
        db.query(sqlSync, [ma_kh, ten, email, sdt, diachi, ngay, status], (err) => {
            if (err) console.error(`❌ Sync error for ${ma_kh}:`, err.message);
            checkDone();
        });
    }

    function checkDone() {
        processed++;
        if (processed === maKhList.length) {
            console.log("✅ Physical sync to 'khachhang' table completed successfully!");
            db.end();
        }
    }
});
