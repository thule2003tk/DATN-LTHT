const db = require("./src/config/db");

async function migrate() {
    console.log("🚀 Starting Category Migration...");

    // 1. Lấy danh sách danh mục làm map
    db.query("SELECT ma_danhmuc, ten_danhmuc FROM danhmuc", (err, cats) => {
        if (err) throw err;

        console.log(`Found ${cats.length} categories.`);

        // 2. Lấy sản phẩm thiếu ma_danhmuc
        db.query("SELECT ma_sp, ten_sp, ten_danhmuc FROM sanpham WHERE ma_danhmuc IS NULL OR ma_danhmuc = ''", (err2, prods) => {
            if (err2) throw err2;

            console.log(`Found ${prods.length} products with missing ma_danhmuc.`);

            if (prods.length === 0) {
                console.log("✅ No products need migration.");
                process.exit(0);
            }

            let updatedCount = 0;
            let total = prods.length;

            prods.forEach(p => {
                // Thử tìm category khớp tên
                const cat = cats.find(c => c.ten_danhmuc.toLowerCase() === (p.ten_danhmuc || "").toLowerCase());

                if (cat) {
                    db.query("UPDATE sanpham SET ma_danhmuc = ? WHERE ma_sp = ?", [cat.ma_danhmuc, p.ma_sp], (err3) => {
                        if (err3) console.error(`Failed to update ${p.ma_sp}:`, err3);
                        else {
                            updatedCount++;
                            console.log(`Updated ${p.ma_sp} (${p.ten_sp}) -> ${cat.ma_danhmuc} (${cat.ten_danhmuc})`);
                        }

                        if (updatedCount + (total - updatedCount) === total) {
                            // Cẩn thận với logic finish này nếu có lỗi update
                        }
                    });
                } else {
                    console.log(`⚠️ Could not find matching category for product ${p.ma_sp} (ten_danhmuc: ${p.ten_danhmuc})`);
                    total--; // Giảm total để callback finish hoạt động đúng nếu dùng promise
                }
            });

            // Tạm thời dùng timeout để kết thúc cho đơn giản vì script này chạy 1 lần
            setTimeout(() => {
                console.log(`🏁 Migration finished. Updated ${updatedCount} products.`);
                process.exit(0);
            }, 5000);
        });
    });
}

migrate();
