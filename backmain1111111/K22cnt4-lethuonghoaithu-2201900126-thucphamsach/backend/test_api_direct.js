const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

db.connect((err) => {
    if (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }

    // Giả lập logic của route GET /api/tintuc
    db.query('SELECT * FROM tintuc ORDER BY ngay_dang DESC', (err, rows) => {
        if (err) {
            console.error('Query error:', err);
        } else {
            console.log('--- KẾT QUẢ API GIẢ LẬP ---');
            console.log('Số lượng bản tin trả về:', rows.length);
            rows.forEach((r, i) => {
                console.log(`${i + 1}. [${r.ma_tt}] ${r.tieu_de}`);
            });
        }
        db.end();
    });
});
