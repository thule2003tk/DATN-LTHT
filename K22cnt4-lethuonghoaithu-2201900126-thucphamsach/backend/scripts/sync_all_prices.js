const db = require("../src/config/db");

async function syncAllPrices() {
    console.log("🚀 Starting Global Price Synchronization...");
    const conn = db.promise();

    try {
        // 1. Lấy danh sách tất cả mã sản phẩm
        const [products] = await conn.query("SELECT ma_sp FROM sanpham");
        console.log(`📦 Found ${products.length} products to sync.`);

        let updatedCount = 0;
        for (const p of products) {
            const ma_sp = p.ma_sp;

            // 2. Tìm giá thấp nhất từ đơn vị
            const [rows] = await conn.query("SELECT MIN(gia) as min_gia FROM donvisanpham WHERE ma_sp = ?", [ma_sp]);
            const minGia = rows[0]?.min_gia;

            if (minGia !== null && minGia !== undefined) {
                // 3. Cập nhật vào bảng sanpham
                await conn.query("UPDATE sanpham SET gia = ? WHERE ma_sp = ?", [minGia, ma_sp]);
                console.log(`✅ Synchronized ${ma_sp}: New Price = ${minGia}`);
                updatedCount++;
            } else {
                console.log(`⚠️ Skipped ${ma_sp}: No unit prices found.`);
            }
        }

        console.log(`🏁 Sync Complete! Updated ${updatedCount} products.`);
        process.exit(0);
    } catch (error) {
        console.error("🔥 Global Sync Failed:", error);
        process.exit(1);
    }
}

syncAllPrices();
