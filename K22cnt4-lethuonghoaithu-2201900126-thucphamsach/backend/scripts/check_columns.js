const db = require("../src/config/db");

async function check() {
    try {
        const [rows] = await db.promise().query("DESCRIBE donvitinh");
        const col = rows.find(r => r.Field === 'ma_dvt');
        console.log(`--- Result for donvitinh.ma_dvt ---`);
        console.log(`Type: ${col.Type}`);

        const [rows2] = await db.promise().query("DESCRIBE sanpham");
        const col2 = rows2.find(r => r.Field === 'ma_sp');
        console.log(`--- Result for sanpham.ma_sp ---`);
        console.log(`Type: ${col2.Type}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
