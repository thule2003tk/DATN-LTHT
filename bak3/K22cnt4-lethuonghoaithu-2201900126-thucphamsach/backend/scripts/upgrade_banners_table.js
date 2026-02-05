const db = require("../src/config/db");

async function upgradeBannersTable() {
    console.log("🚀 Upgrading banners table...");
    try {
        // Add type column if it doesn't exist
        const [columns] = await db.promise().query("SHOW COLUMNS FROM banners LIKE 'type'");
        if (columns.length === 0) {
            await db.promise().query("ALTER TABLE banners ADD COLUMN type VARCHAR(50) DEFAULT 'main' AFTER hinhanh");
            console.log("✅ Added 'type' column to banners table.");
        } else {
            console.log("ℹ️ 'type' column already exists.");
        }

        // Set all existing banners to 'main'
        await db.promise().query("UPDATE banners SET type = 'main' WHERE type IS NULL");

    } catch (err) {
        console.error("❌ Error upgrading banners table:", err);
        process.exit(1);
    }
    console.log("🏁 Upgrade complete!");
    process.exit(0);
}

upgradeBannersTable();
