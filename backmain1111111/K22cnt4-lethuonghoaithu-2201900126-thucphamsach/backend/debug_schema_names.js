const db = require("./src/config/db");

db.query("DESCRIBE sanpham", (err, results) => {
    if (err) {
        console.error("Error describing table:", err);
    } else {
        results.forEach(col => console.log(col.Field));
    }
    db.end();
    process.exit();
});
