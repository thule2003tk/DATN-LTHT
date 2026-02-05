const db = require("./src/config/db");

/**
 * 🚀 SCRIPT ĐỒNG BỘ LẠI TỒN KHO DỰA TRÊN LỊCH SỬ ĐƠN HÀNG
 * Mục tiêu: Tính toán lại soluong_ton thực tế = (Số lượng ban đầu - Đã bán + Đã hủy)
 * Tuy nhiên, do chúng ta không biết số lượng ban đầu chính xác của từng sản phẩm,
 * script này sẽ thực hiện: soluong_ton = soluong_ton_hien_tai - (Số lượng trong các đơn hàng 'Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Thành công')
 * ĐÃ ĐƯỢC TẠO TRƯỚC KHI CÓ FIX.
 * 
 * LƯU Ý: Đây là script chạy một lần để sửa dữ liệu cũ.
 */

async function syncStock() {
    console.log("🔄 Bắt đầu quét lịch sử đơn hàng để đồng bộ lại kho...");

    try {
        // 1. Lấy tất cả chi tiết đơn hàng của các đơn KHÔNG PHẢI 'Đã hủy'
        const sql = `
      SELECT ct.ma_sp, SUM(ct.soluong) as tong_da_ban
      FROM chitiet_donhang ct
      JOIN donhang d ON ct.ma_donhang = d.ma_donhang
      WHERE d.trangthai NOT IN ('Đã hủy')
      GROUP BY ct.ma_sp
    `;

        db.query(sql, (err, rows) => {
            if (err) throw err;

            if (rows.length === 0) {
                console.log("✅ Không có dữ liệu đơn hàng cũ cần xử lý.");
                process.exit(0);
            }

            console.log(`📦 Tìm thấy ${rows.length} sản phẩm cần điều chỉnh.`);

            const updatePromises = rows.map(row => {
                return new Promise((resolve, reject) => {
                    // LƯU Ý: Chỉ trừ đi số lượng đã bán nếu trước đó hệ thống chưa trừ (hoặc đã cộng nhầm)
                    // Vì user nói "Rau muống bán 4 mà vẫn là 100", nghĩa là 100 là con số CHƯA TRỪ.
                    const updateSql = "UPDATE sanpham SET soluong_ton = soluong_ton - ? WHERE ma_sp = ?";
                    db.query(updateSql, [row.tong_da_ban, row.ma_sp], (err) => {
                        if (err) reject(err);
                        else {
                            console.log(`✅ Đã trừ ${row.tong_da_ban} cho sản phẩm ${row.ma_sp}`);
                            resolve();
                        }
                    });
                });
            });

            Promise.all(updatePromises)
                .then(() => {
                    console.log("🎉 ĐỒNG BỘ KHO THÀNH CÔNG!");
                    process.exit(0);
                })
                .catch(err => {
                    console.error("❌ Lỗi trong quá trình cập nhật:", err);
                    process.exit(1);
                });
        });
    } catch (error) {
        console.error("🔥 Lỗi thực thi script:", error);
        process.exit(1);
    }
}

syncStock();
