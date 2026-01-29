const db = require("./src/config/db");

db.query("SELECT COUNT(*) as count FROM sanpham", (err, results) => {
  if (err) {
    console.error("Error querying sanpham:", err);
  } else {
    console.log("Number of products:", results[0].count);
  }
  
  db.query("SELECT COUNT(*) as count FROM blog", (err, results) => {
    if (err) {
      console.error("Error querying blog:", err);
    } else {
      console.log("Number of blogs:", results[0].count);
    }
    process.exit();
  });
});
