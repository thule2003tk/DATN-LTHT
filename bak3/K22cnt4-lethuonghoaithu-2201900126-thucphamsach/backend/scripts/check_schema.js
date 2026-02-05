const db = require("../src/config/db");

async function checkSchema() {
    try {
        const [sanpham] = await db.promise().query("DESCRIBE sanpham");
        console.log("--- sanpham ---");
        console.table(sanpham);

        const [danhmuc] = await db.promise().query("DESCRIBE danhmuc");
        console.log("--- danhmuc ---");
        console.table(danhmuc);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSchema();
