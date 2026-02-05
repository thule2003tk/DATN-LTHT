const db = require("./src/config/db");

db.query("SELECT ma_danhmuc, ten_danhmuc FROM danhmuc", (err, cats) => {
    if (err) { console.error("Error fetching categories:", err); process.exit(1); }

    db.query("SELECT ma_sp, ten_sp, ma_danhmuc, ten_danhmuc FROM sanpham", (err2, prods) => {
        if (err2) { console.error("Error fetching products:", err2); process.exit(1); }

        console.log("--- CATEGORIES IN DB ---");
        cats.forEach(c => console.log(`${c.ma_danhmuc}: ${c.ten_danhmuc}`));

        console.log("\n--- PRODUCTS DATA CHECK ---");
        let matches = 0;
        let mismatches = 0;
        let nulls = 0;

        prods.forEach(p => {
            if (!p.ma_danhmuc) {
                nulls++;
            } else if (cats.find(c => c.ma_danhmuc === p.ma_danhmuc)) {
                matches++;
            } else {
                mismatches++;
                console.log(`Mismatch: Product ${p.ma_sp} (${p.ten_sp}) has category code ${p.ma_danhmuc} which NOT exists in danhmuc table.`);
            }
        });

        console.log(`\nResults: ${matches} matches, ${mismatches} mismatches, ${nulls} null/empty ma_danhmuc.`);
        process.exit(0);
    });
});
