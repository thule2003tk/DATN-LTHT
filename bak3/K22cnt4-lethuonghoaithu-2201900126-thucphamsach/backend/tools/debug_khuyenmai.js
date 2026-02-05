const db = require("./src/config/db");

db.query("DESCRIBE khuyenmai", (err, results) => {
    if (err) {
        console.error("Error describing table:", err);
    } else {
        console.table(results);
    }
    db.end();
    process.exit();
});
