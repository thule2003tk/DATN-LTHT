const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ltht_thucphamsach",
});

const createTableSql = `
CREATE TABLE IF NOT EXISTS tintuc (
  ma_tt INT AUTO_INCREMENT PRIMARY KEY,
  tieu_de VARCHAR(255) NOT NULL,
  mo_ta TEXT,
  noi_dung LONGTEXT,
  hinh_anh VARCHAR(255),
  loai_tin ENUM('HTFood', 'Trong nước', 'Thế giới') DEFAULT 'HTFood',
  ngay_dang TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const insertDataSql = `
INSERT INTO tintuc (tieu_de, mo_ta, noi_dung, hinh_anh, loai_tin) VALUES
('HTFood chính thức đạt chứng nhận GLOBALG.A.P', 'HTFood tự hào thông báo toàn bộ quy trình sản xuất và phân phối đã đạt chuẩn nông nghiệp quốc tế.', 'Đây là cột mốc quan trọng khẳng định cam kết của HTFood về chất lượng thực phẩm sạch phục vụ cộng đồng...', 'https://htfood.vn/images/globalgap.jpg', 'HTFood'),
('Xu hướng tiêu dùng thực phẩm hữu cơ 2026', 'Thị trường thực phẩm sạch tại Việt Nam đang có bước chuyển mình mạnh mẽ theo hướng bền vững.', 'Theo báo cáo mới nhất, hơn 70% người tiêu dùng sẵn sàng chi trả cao hơn cho các sản phẩm có nguồn gốc từ thiên nhiên...', 'https://bizweb.dktcdn.net/100/434/209/files/rau-cu-huu-co-vietgap-1.jpg', 'Trong nước'),
('Liên minh Châu Âu siết chặt quy định về ATTP nhập khẩu', 'Quy định mới về dư lượng hóa chất trong rau củ quả vừa được thông báo tại Brussels.', 'Các nhà xuất khẩu thực phẩm cần lưu ý về các danh mục hoạt chất mới bị cấm để đảm bảo hàng hóa được thông quan...', 'https://i.ytimg.com/vi/X-NWppX0do0/hq720.jpg', 'Thế giới');
`;

db.connect((err) => {
    if (err) process.exit(1);
    db.query(createTableSql, (err) => {
        if (err) {
            console.error(err);
            db.end();
            return;
        }
        db.query(insertDataSql, (err) => {
            if (err) console.error("Lỗi nạp dữ liệu:", err);
            else console.log("✅ Hệ thống Tin tức đã sẵn sàng với nội dung chuyên nghiệp!");
            db.end();
        });
    });
});
