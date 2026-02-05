const db = require("../src/config/db");

async function verify() {
    console.log("🔍 Kiểm tra dữ liệu sau migration...");

    try {
        // 1. Kiểm tra số lượng bản ghi trong bảng junction
        const [junctionCount] = await db.promise().query("SELECT COUNT(*) as count FROM sanpham_danhmuc");
        console.log(`📊 Số bản ghi trong sanpham_danhmuc: ${junctionCount[0].count}`);

        // 2. Chạy thử một query JOIN giống trong Controller
        const sql = `
            SELECT sp.ma_sp, sp.ten_sp, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
            FROM sanpham sp
            LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
            GROUP BY sp.ma_sp
            LIMIT 5
        `;
        const [results] = await db.promise().query(sql);

        console.log("📦 Dữ liệu sản phẩm mẫu:");
        results.forEach(r => {
            console.log(`- ${r.ma_sp}: ${r.ten_sp} -> Categories: [${r.danhmuc_ids}]`);
        });

        if (junctionCount[0].count > 0) {
            console.log("✅ Xác nhận: Dữ liệu đã được liên kết thành công.");
        } else {
            console.warn("⚠️ Cảnh báo: Bảng sanpham_danhmuc đang trống!");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi kiểm tra:", error);
        process.exit(1);
    }
}

verify();
