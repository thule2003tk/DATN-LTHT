const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối:', err);
        process.exit(1);
    }

    // Câu lệnh xóa các dòng có cùng tiêu đề, chỉ giữ lại dòng có ID nhỏ nhất (hoặc lớn nhất)
    const sql = `
    DELETE t1 FROM tintuc t1
    INNER JOIN tintuc t2 
    WHERE t1.ma_tt > t2.ma_tt AND t1.tieu_de = t2.tieu_de
  `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa trùng lặp:', err);
        } else {
            console.log(`✅ Đã xóa ${result.affectedRows} bài viết trùng lặp.`);

            // Kiểm tra lại danh sách cuối cùng
            db.query('SELECT ma_tt, tieu_de FROM tintuc', (err, rows) => {
                console.log('--- Danh sách tin tức hiện tại ---');
                rows.forEach(r => console.log(`ID: ${r.ma_tt} - ${r.tieu_de}`));
                db.end();
            });
        }
    });
});
