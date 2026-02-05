const db = require("../src/config/db");

async function fixColumnSizes() {
    console.log("🚀 Starting Aggressive Systemic ID Column Expansion...");

    try {
        console.log("🔓 Disabling foreign key checks...");
        await db.promise().query("SET FOREIGN_KEY_CHECKS = 0");

        const actions = [
            "ALTER TABLE danhmuc MODIFY ma_danhmuc VARCHAR(30)",
            "ALTER TABLE donvitinh MODIFY ma_dvt VARCHAR(30)",
            "ALTER TABLE nhacungcap MODIFY ma_ncc VARCHAR(30)",
            "ALTER TABLE sanpham MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE sanpham MODIFY ma_danhmuc VARCHAR(30)",
            "ALTER TABLE sanpham_danhmuc MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE sanpham_danhmuc MODIFY ma_danhmuc VARCHAR(30)",
            "ALTER TABLE donvisanpham MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE donvisanpham MODIFY ma_dvt VARCHAR(30)",
            "ALTER TABLE chitiet_donhang MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE khuyenmai MODIFY ma_km VARCHAR(30)",
            "ALTER TABLE giohang MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE lichsu_tonkho MODIFY ma_sp VARCHAR(30)" // Dự phòng nếu đã tạo
        ];

        for (const sql of actions) {
            try {
                console.log(`⏳ Executing: ${sql}`);
                await db.promise().query(sql);
                console.log("✅ Success");
            } catch (error) {
                console.warn(`⚠️ Warning: ${sql} failed - ${error.message}`);
            }
        }

        console.log("🔒 Re-enabling foreign key checks...");
        await db.promise().query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("🏁 ID Column Expansion Complete.");
    } catch (e) {
        console.error("🔥 FATAL ERROR during migration:", e);
    } finally {
        process.exit(0);
    }
}

fixColumnSizes();
