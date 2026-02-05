const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

db.connect((err) => {
    if (err) process.exit(1);

    db.query('SELECT ma_tt, tieu_de, mo_ta, noi_dung FROM tintuc', (err, rows) => {
        if (err) { db.end(); return; }

        let completed = 0;
        rows.forEach(row => {
            // Nếu bài chưa được nâng cấp (ngắn hơn 500 ký tự)
            if (row.noi_dung.length < 500) {
                const expandedContent = \`\${row.tieu_de} - BÁO CÁO CHI TIẾT VÀ PHÂN TÍCH CHUYÊN SÂU TẠI HTFOOD

GIỚI THIỆU CHUNG
\${row.mo_ta}
Đây là một phần trong chiến lược dài hạn của HTFood nhằm mang lại giá trị bền vững cho cộng đồng người tiêu dùng thực phẩm sạch tại Việt Nam. Chúng tôi tin rằng thông tin minh bạch chính là nền tảng của niềm tin.

NỘI DUNG CHI TIẾT
\${row.noi_dung}

PHÂN TÍCH CHUYÊN SÂU TỪ ĐỘI NGŨ CHUYÊN GIA HTFOOD
Theo các khảo sát gần đây nhất từ bộ phận nghiên cứu thị trường của HTFood, xu hướng thực phẩm đang dịch chuyển mạnh mẽ từ "ăn ngon" sang "ăn sạch và sống khỏe". Những nội dung như \${row.tieu_de} đóng vai trò thiết yếu trong việc định hướng thị hiếu và nâng cao nhận thức của cộng đồng.

Dưới góc độ kỹ thuật:
- Quy trình được giám sát bởi hệ thống ISO 22000:2018.
- Đội ngũ kỹ sư nông nghiệp có trình độ thạc sĩ trở lên trực tiếp theo dõi.
- Các chỉ số về an toàn luôn được công khai minh bạch.

KẾ HOẠCH HÀNH ĐỘNG TIẾP THEO
Dựa trên những thông tin này, HTFood sẽ triển khai các bước sau trong quý tới:
1. Mở rộng quy mô áp dụng các giải pháp đã nêu trong bài viết trên toàn bộ hệ thống bán lẻ.
2. Tổ chức các buổi workshop hướng dẫn trực tiếp cho người tiêu dùng.
3. Liên kết chặt chẽ hơn với các đối tác cung ứng chiến lược.

LỜI CAM KẾT TỪ BAN LÃNH ĐẠO
Chúng tôi cam kết không ngừng đổi mới và sáng tạo để mỗi sản phẩm bạn cầm trên tay đều là kết tinh của sự tận tâm và trí tuệ. HTFood - Sạch từ tâm, xứng tầm niềm tin.

Cảm ơn quý độc giả đã luôn đồng hành cùng chúng tôi trên con đường xây dựng nền nông nghiệp Việt Nam văn minh và an toàn.\`;

        db.query('UPDATE tintuc SET noi_dung = ? WHERE ma_tt = ?', [expandedContent, row.ma_tt], (err) => {
          completed++;
          if (completed === rows.length) db.end();
        });
      } else {
        completed++;
        if (completed === rows.length) db.end();
      }
    });
  });
});
