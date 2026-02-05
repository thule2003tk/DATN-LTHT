const db = require("./src/config/db");

console.log("--- DATABASE DIAGNOSTIC START ---");

db.query("SELECT COUNT(*) as count FROM donhang", (err, results) => {
    if (err) {
        console.error("❌ Error counting orders:", err.message);
    } else {
        console.log("✅ Total orders in database:", results[0].count);
    }

    db.query("SELECT ma_donhang, trangthai, ly_do_huy FROM donhang LIMIT 5", (err, rows) => {
        if (err) {
            console.error("❌ Error fetching sample orders:", err.message);
        } else {
            console.log("📋 Sample orders:", JSON.stringify(rows, null, 2));
        }
        db.end();
        console.log("--- DATABASE DIAGNOSTIC END ---");
    });
});
