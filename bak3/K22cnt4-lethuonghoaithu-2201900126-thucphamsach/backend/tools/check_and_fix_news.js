const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối:', err);
        process.exit(1);
    }

    // 1. Kiểm tra hiện tại
    db.query('SELECT ma_tt, tieu_de FROM tintuc', (err, rows) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            db.end();
            return;
        }
        console.log('--- Dữ liệu hiện tại (' + rows.length + ' bản tin) ---');
        rows.forEach(r => console.log(`ID: ${r.ma_tt} - ${r.tieu_de}`));

        // 2. Nếu thiếu dữ liệu (ví dụ chỉ có 1 bài), nạp thêm các bài còn lại
        const tieuDeHienTai = rows.map(r => r.tieu_de);

        const tinMoi = [
            {
                tieu_de: 'Xu hướng tiêu dùng thực phẩm hữu cơ 2026',
                mo_ta: 'Thị trường thực phẩm sạch tại Việt Nam đang có bước chuyển mình mạnh mẽ theo hướng bền vững.',
                noi_dung: 'Theo báo cáo mới nhất, hơn 70% người tiêu dùng sẵn sàng chi trả cao hơn cho các sản phẩm có nguồn gốc từ thiên nhiên...',
                hinh_anh: 'hydroponic.jpg',
                loai_tin: 'Trong nước'
            },
            {
                tieu_de: 'Liên minh Châu Âu siết chặt quy định về ATTP nhập khẩu',
                mo_ta: 'Quy định mới về dư lượng hóa chất trong rau củ quả vừa được thông báo tại Brussels.',
                noi_dung: 'Các nhà xuất khẩu thực phẩm cần lưu ý về các danh mục hoạt chất mới bị cấm để đảm bảo hàng hóa được thông quan...',
                hinh_anh: 'tom-su.jpg',
                loai_tin: 'Thế giới'
            }
        ];

        const tinCanNap = tinMoi.filter(t => !tieuDeHienTai.includes(t.tieu_de));

        if (tinCanNap.length > 0) {
            console.log('Đang nạp thêm ' + tinCanNap.length + ' bản tin mới...');
            let inserted = 0;
            tinCanNap.forEach(t => {
                db.query('INSERT INTO tintuc SET ?', t, (err) => {
                    inserted++;
                    if (err) console.error('Lỗi khi chèn bài ' + t.tieu_de, err);
                    if (inserted === tinCanNap.length) {
                        console.log('✅ Đã nạp xong toàn bộ dữ liệu!');
                        db.end();
                    }
                });
            });
        } else {
            console.log('✅ Dữ liệu đã đầy đủ, không cần nạp thêm.');
            db.end();
        }
    });
});
