const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // đổi nếu bạn dùng mật khẩu
  database: "ltht_thucphamsach",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi kết nối MySQL:", err);
  } else {
    console.log("✅ MySQL đã kết nối!");
  }
});

module.exports = db;
