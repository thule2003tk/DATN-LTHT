const db = require("../src/config/db");

async function migrate() {
    console.log("🚀 Bắt đầu khởi tạo bảng sanpham_danhmuc...");

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS sanpham_danhmuc (
            ma_sp VARCHAR(10),
            ma_danhmuc VARCHAR(10),
            PRIMARY KEY (ma_sp, ma_danhmuc),
            FOREIGN KEY (ma_sp) REFERENCES sanpham(ma_sp) ON DELETE CASCADE,
            FOREIGN KEY (ma_danhmuc) REFERENCES danhmuc(ma_danhmuc) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

    try {
        // 1. Tạo bảng junction
        await db.promise().query(createTableSql);
        console.log("✅ Đã tạo bảng sanpham_danhmuc.");

        // 2. Chuyển dữ liệu cũ từ bảng sản phẩm sang
        const selectExistingSql = "SELECT ma_sp, ma_danhmuc FROM sanpham WHERE ma_danhmuc IS NOT NULL AND ma_danhmuc != ''";
        const [rows] = await db.promise().query(selectExistingSql);

        if (rows.length > 0) {
            console.log(`📦 Tìm thấy ${rows.length} sản phẩm cần chuyển dữ liệu danh mục.`);

            const insertValues = rows.map(r => [r.ma_sp, r.ma_danhmuc]);
            const insertSql = "INSERT IGNORE INTO sanpham_danhmuc (ma_sp, ma_danhmuc) VALUES ?";

            await db.promise().query(insertSql, [insertValues]);
            console.log("✅ Đã chuyển dữ liệu sang bảng mới thành công.");
        } else {
            console.log("ℹ️ Không có dữ liệu cũ cần chuyển.");
        }

        console.log("🎉 Hoàn thành migration!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi migration:", error);
        process.exit(1);
    }
}

migrate();
