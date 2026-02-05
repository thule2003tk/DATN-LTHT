const db = require("../src/config/db");

async function fixColumnSizes() {
    console.log("🚀 Starting Systemic ID Column Expansion...");

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
        "ALTER TABLE giohang MODIFY ma_sp VARCHAR(30)"
    ];

    for (const sql of actions) {
        try {
            console.log(`⏳ Executing: ${sql}`);
            await db.promise().query(sql);
            console.log("✅ Success");
        } catch (error) {
            console.error(`❌ Failed: ${sql}`);
            console.error(`Reason: ${error.message}`);
            // Non-critical if table doesn't exist or column differs
        }
    }

    console.log("🏁 ID Column Expansion Complete.");
    process.exit(0);
}

fixColumnSizes();
