const db = require("../src/config/db");
const { syncProductMinPrice } = require("../src/controllers/donvisanphamController");

async function verifyPriceSync() {
    console.log("🧪 Verifying Price Sync Logic...");
    const ma_sp = "SP_SYNC_TEST";

    try {
        // 1. Create test product
        await db.promise().query("INSERT IGNORE INTO sanpham (ma_sp, ten_sp, gia, ma_danhmuc) VALUES (?, ?, ?, ?)", [ma_sp, "Sync Test Product", 100000, "DM001"]);

        // 2. Create units
        await db.promise().query("DELETE FROM donvisanpham WHERE ma_sp = ?", [ma_sp]);
        await db.promise().query("INSERT INTO donvisanpham (ma_sp, ma_dvt, gia) VALUES (?, ?, ?), (?, ?, ?)", [ma_sp, "DVT01", 50000, ma_sp, "DVT02", 30000]);

        console.log("⏳ Triggering manual sync...");
        await new Promise(resolve => {
            syncProductMinPrice(ma_sp);
            setTimeout(resolve, 1000); // Wait for async query
        });

        // 3. Verify
        const [rows] = await db.promise().query("SELECT gia FROM sanpham WHERE ma_sp = ?", [ma_sp]);
        const currentGia = rows[0].gia;
        console.log("📊 Product Price in DB:", currentGia);

        if (currentGia == 30000) {
            console.log("✅ Price successfully synced to MIN(30000, 50000) = 30000");
        } else {
            console.error("❌ Sync failed! Expected 30000, got", currentGia);
        }

        // Cleanup
        await db.promise().query("DELETE FROM donvisanpham WHERE ma_sp = ?", [ma_sp]);
        await db.promise().query("DELETE FROM sanpham WHERE ma_sp = ?", [ma_sp]);
        console.log("🗑️ Cleanup done.");
        process.exit(0);
    } catch (e) {
        console.error("🔥 Error during verification:", e);
        process.exit(1);
    }
}

verifyPriceSync();
