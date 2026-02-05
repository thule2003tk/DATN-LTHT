const db = require("../src/config/db");

async function addCertColumn() {
    console.log("🚀 Adding giay_chung_nhan column to sanpham...");
    const sql = "ALTER TABLE sanpham ADD COLUMN giay_chung_nhan VARCHAR(255) DEFAULT NULL";

    try {
        await db.promise().query(sql);
        console.log("✅ Column added successfully.");
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("ℹ️ Column already exists.");
        } else {
            console.error("❌ Error adding column:", err);
            process.exit(1);
        }
    }
    process.exit(0);
}

addCertColumn();
