const mysql = require('mysql2/promise');

async function deployNewProducts() {
    const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' };
    try {
        const db = await mysql.createConnection(dbConfig);

        const products = [
            { ma: 'SP' + Date.now() + '21', ten: 'Chuối Sứ Tiền Giang', gia: 25000, dvt: 'DVT1769789', dm: 'DM001', dmn: 'Hoa quả', img: 'chuoi-su.jpg', mota: 'Chuối Sứ chín tự nhiên, không hóa chất, vị ngọt thanh bùi.', detail: 'Chuối Sứ (chuối xiêm) được nhập từ nhà vườn Tiền Giang. Quả to đều, chín vàng tự nhiên, giàu kali và vitamin. Rất tốt cho hệ tiêu hóa và làm món tráng miệng.' },
            { ma: 'SP' + Date.now() + '22', ten: 'Chôm chôm nhãn', gia: 45000, dvt: 'DVT05', dm: 'DM001', dmn: 'Hoa quả', img: 'chom-chom.jpg', mota: 'Chôm chôm nhãn Vĩnh Long, giòn, tróc hạt, ngọt lịm.', detail: 'Chôm chôm nhãn đặc sản Vĩnh Long. Vỏ mỏng, gai ngắn, thịt trắng trong, giòn và ngọt đậm đà. Đảm bảo độ tươi ngon nhất khi giao đến tay khách hàng.' },
            { ma: 'SP' + Date.now() + '23', ten: 'Hồng giòn Đà Lạt', gia: 60000, dvt: 'DVT05', dm: 'DM001', dmn: 'Hoa quả', img: 'hong-gion.jpg', mota: 'Hồng giòn Đà Lạt không chát, vàng tươi, ngọt lịm.', detail: 'Hồng giòn được trồng tại vùng đất Đà Lạt khí hậu mát mẻ. Quả hồng vàng ươm, khi ăn có độ giòn tan, vị ngọt thanh tự nhiên, không còn vị chát sau khi ủ hơi theo phương pháp truyền thống.' },
            { ma: 'SP' + Date.now() + '24', ten: 'Măng tre rừng', gia: 35000, dvt: 'DVT05', dm: 'DM007', dmn: 'Rau củ', img: 'mang-tre.jpg', mota: 'Măng tre rừng tươi sạch, giòn ngọt, không ngâm hóa chất.', detail: 'Măng tre rừng tự nhiên, được thu hái măng tươi mỗi ngày. Măng trắng ngần, giòn, vị ngọt thanh đặc trưng. Thích hợp cho các món xào, canh hoặc làm măng chua.' },
            { ma: 'SP' + Date.now() + '25', ten: 'Sầu riêng Ri6', gia: 155000, dvt: 'DVT05', dm: 'DM001', dmn: 'Hoa quả', img: 'sau-rieng.jpg', mota: 'Sầu riêng Ri6 Cái Mơn cơm vàng, hạt lép, béo ngậy.', detail: 'Sầu riêng Ri6 chuẩn Cái Mơn - Bến Tre. Cơm vàng đậm, khô ráo, vị ngọt đậm đà và béo ngậy đặc trưng. Hạt cực lép, hương thơm nồng nàn quyến rũ.' }
        ];

        for (const p of products) {
            // 1. Insert product
            await db.execute(
                "INSERT INTO sanpham (ma_sp, ten_sp, mota, thongtin_sanpham, gia, ma_dvt, hinhanh, ma_danhmuc, ten_danhmuc, ma_ncc, created_at, giay_chung_nhan, soluong_ton, phan_tram_giam_gia, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NCC01', NOW(), 'vietgap_htfood.png', 30, 0, 1)",
                [p.ma, p.ten, p.mota, p.detail, p.gia, p.dvt, p.img, p.dm, p.dmn]
            );

            // 2. Insert category mapping
            await db.execute(
                "INSERT INTO sanpham_danhmuc (ma_sp, ma_danhmuc) VALUES (?, ?)",
                [p.ma, p.dm]
            );

            // 3. Insert unit/price mapping (donvisanpham)
            const ma_donvisp = 'DVSP' + Date.now() + Math.floor(Math.random() * 1000);
            await db.execute(
                "INSERT IGNORE INTO donvisanpham (ma_donvisp, ma_sp, ma_dvt, gia) VALUES (?, ?, ?, ?)",
                [ma_donvisp, p.ma, p.dvt, p.gia]
            );

            console.log(`Added & Enriched: ${p.ten}`);
        }

        console.log(`Successfully added 5 truly unique products!`);
        await db.end();
    } catch (e) {
        console.error('Phase 2 Error:', e.message);
    }
}

deployNewProducts();
