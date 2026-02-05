const db = require("../src/config/db");

async function testInsert() {
    console.log("🧪 Testing Manual Insert into donvitinh...");
    const ma_dvt = "DVT_TEST_" + Date.now();
    const sql = "INSERT INTO donvitinh (ma_dvt, ten_dvt, mota, size, trangthai) VALUES (?, ?, ?, ?, ?)";
    const values = [ma_dvt, "Test Unit", "Manual test", "N/A", "active"];

    try {
        const [result] = await db.promise().query(sql, values);
        console.log("✅ Success! Inserted ID:", ma_dvt);

        // Cleanup
        await db.promise().query("DELETE FROM donvitinh WHERE ma_dvt = ?", [ma_dvt]);
        console.log("🗑️ Cleanup successful.");
        process.exit(0);
    } catch (error) {
        console.error("❌ FAILED!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("SQL:", error.sql);
        process.exit(1);
    }
}

testInsert();
