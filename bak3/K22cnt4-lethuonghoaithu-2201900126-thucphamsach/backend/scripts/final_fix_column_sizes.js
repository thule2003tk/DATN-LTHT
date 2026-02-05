const db = require("../src/config/db");

async function finalFix() {
    console.log("🚀 Starting FINAL Aggressive ID Column Expansion...");
    const conn = db.promise();

    try {
        console.log("🔓 Disabling foreign key checks...");
        await conn.query("SET FOREIGN_KEY_CHECKS = 0");

        // 1. DROP Foreign Keys safely
        const fksToDrop = [
            ["chitiet_donhang", "chitiet_donhang_ibfk_1"],
            ["chitiet_donhang", "chitiet_donhang_ibfk_2"],
            ["donhang", "donhang_ibfk_2"],
            ["donvisanpham", "fk_dvsp_dvt"],
            ["giohang", "giohang_ibfk_2"],
            ["sanpham", "fk_sanpham_danhmuc"],
            ["sanpham", "fk_sanpham_dvt"],
            ["sanpham", "sanpham_ibfk_1"],
            ["sanpham", "sanpham_ibfk_2"],
            ["sanpham_danhmuc", "sanpham_danhmuc_ibfk_1"],
            ["sanpham_danhmuc", "sanpham_danhmuc_ibfk_2"]
        ];

        for (const [table, fk] of fksToDrop) {
            try {
                console.log(`⏳ Dropping FK: ${fk} on ${table}`);
                await conn.query(`ALTER TABLE ${table} DROP FOREIGN KEY ${fk}`);
            } catch (e) {
                console.warn(`⚠️ Warning: Skip dropping ${fk} - ${e.message}`);
            }
        }

        // 2. MODIFY Columns
        const columnsToFix = [
            "ALTER TABLE danhmuc MODIFY ma_danhmuc VARCHAR(30)",
            "ALTER TABLE donvitinh MODIFY ma_dvt VARCHAR(30)",
            "ALTER TABLE nhacungcap MODIFY ma_ncc VARCHAR(30)",
            "ALTER TABLE sanpham MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE sanpham MODIFY ma_danhmuc VARCHAR(30)",
            "ALTER TABLE sanpham MODIFY ma_dvt VARCHAR(30)",
            "ALTER TABLE sanpham MODIFY ma_ncc VARCHAR(30)",
            "ALTER TABLE sanpham_danhmuc MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE sanpham_danhmuc MODIFY ma_danhmuc VARCHAR(30)",
            "ALTER TABLE donvisanpham MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE donvisanpham MODIFY ma_dvt VARCHAR(30)",
            "ALTER TABLE chitiet_donhang MODIFY ma_sp VARCHAR(30)",
            "ALTER TABLE khuyenmai MODIFY ma_km VARCHAR(30)",
            "ALTER TABLE giohang MODIFY ma_sp VARCHAR(30)"
        ];

        for (const sql of columnsToFix) {
            try {
                console.log(`⏳ Executing: ${sql}`);
                await conn.query(sql);
                console.log("✅ Success");
            } catch (error) {
                console.error(`❌ Failed: ${sql} - ${error.message}`);
            }
        }

        // 3. RE-ADD Foreign Keys
        const fksToAdd = [
            "ALTER TABLE chitiet_donhang ADD CONSTRAINT chitiet_donhang_ibfk_2 FOREIGN KEY (ma_sp) REFERENCES sanpham(ma_sp)",
            "ALTER TABLE donvisanpham ADD CONSTRAINT fk_dvsp_dvt FOREIGN KEY (ma_dvt) REFERENCES donvitinh(ma_dvt)",
            "ALTER TABLE giohang ADD CONSTRAINT giohang_ibfk_2 FOREIGN KEY (ma_sp) REFERENCES sanpham(ma_sp)",
            "ALTER TABLE sanpham ADD CONSTRAINT fk_sanpham_danhmuc FOREIGN KEY (ma_danhmuc) REFERENCES danhmuc(ma_danhmuc)",
            "ALTER TABLE sanpham ADD CONSTRAINT fk_sanpham_dvt FOREIGN KEY (ma_dvt) REFERENCES donvitinh(ma_dvt)",
            "ALTER TABLE sanpham ADD CONSTRAINT sanpham_ibfk_1 FOREIGN KEY (ma_ncc) REFERENCES nhacungcap(ma_ncc)",
            "ALTER TABLE sanpham_danhmuc ADD CONSTRAINT sanpham_danhmuc_ibfk_1 FOREIGN KEY (ma_sp) REFERENCES sanpham(ma_sp)",
            "ALTER TABLE sanpham_danhmuc ADD CONSTRAINT sanpham_danhmuc_ibfk_2 FOREIGN KEY (ma_danhmuc) REFERENCES danhmuc(ma_danhmuc)"
        ];

        for (const sql of fksToAdd) {
            try {
                console.log(`⏳ Re-adding FK: ${sql}`);
                await conn.query(sql);
                console.log("✅ Success");
            } catch (e) {
                console.error(`❌ Failed Re-adding: ${e.message}`);
            }
        }

        console.log("🔒 Re-enabling foreign key checks...");
        await conn.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("🏁 FINAL ID Column Expansion Complete.");
    } catch (e) {
        console.error("🔥 FATAL ERROR:", e);
    } finally {
        process.exit(0);
    }
}

finalFix();
