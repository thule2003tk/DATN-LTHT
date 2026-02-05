const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ltht_thucphamsach",
});

const createTableSql = `
CREATE TABLE IF NOT EXISTS banners (
  ma_banner INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  hinhanh VARCHAR(255),
  button_text VARCHAR(100) DEFAULT 'Mua ngay',
  button_color VARCHAR(50) DEFAULT 'success',
  link_path VARCHAR(255) DEFAULT '/products',
  thutu INT DEFAULT 0,
  trangthai TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

db.connect((err) => {
    if (err) {
        console.error("❌ Lỗi kết nối:", err);
        process.exit(1);
    }
    db.query(createTableSql, (err) => {
        if (err) {
            console.error("❌ Lỗi tạo bảng:", err);
        } else {
            console.log("✅ Đã tạo bảng 'banners' thành công!");
        }
        db.end();
    });
});
