const db = require("../src/config/db");

async function syncCertificates() {
    console.log("🚀 Starting Global Certificate Update...");
    const certFilename = "vietgap_htfood.png";

    try {
        // Update all products that don't have a certificate yet
        const [result] = await db.promise().query(
            "UPDATE sanpham SET giay_chung_nhan = ? WHERE giay_chung_nhan IS NULL OR giay_chung_nhan = ''",
            [certFilename]
        );

        console.log(`✅ Success! Updated ${result.affectedRows} products with the VietGAP certificate.`);
    } catch (err) {
        console.error("❌ Error updating certificates:", err);
        process.exit(1);
    }
    process.exit(0);
}

syncCertificates();
