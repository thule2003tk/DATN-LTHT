const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ltht_thucphamsach'
});

async function fixSchema() {
    console.log("🚀 Fixing khachhang table schema...");

    try {
        // 1. Tăng độ dài ma_kh
        await db.promise().query("ALTER TABLE khachhang MODIFY ma_kh VARCHAR(50);");
        console.log("✅ Increased ma_kh length to 50.");

        // 2. Thêm cột ngay_tao nếu chưa có
        const [cols] = await db.promise().query("SHOW COLUMNS FROM khachhang LIKE 'ngay_tao'");
        if (cols.length === 0) {
            await db.promise().query("ALTER TABLE khachhang ADD COLUMN ngay_tao DATETIME DEFAULT NOW();");
            console.log("✅ Added column ngay_tao.");
        } else {
            console.log("ℹ️ Column ngay_tao already exists.");
        }

        console.log("🎉 Schema fixed successfully!");
    } catch (err) {
        console.error("❌ Error fixing schema:", err.message);
    } finally {
        db.end();
    }
}

fixSchema();
