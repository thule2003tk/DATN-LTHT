const db = require("./src/config/db");

db.query("DESCRIBE khuyenmai", (err, results) => {
    if (err) {
        console.error("Error describing table:", err);
    } else {
        results.forEach(row => {
            console.log(`${row.Field} | ${row.Type} | ${row.Null} | ${row.Key} | ${row.Default} | ${row.Extra}`);
        });
    }
    db.end();
    process.exit();
});
