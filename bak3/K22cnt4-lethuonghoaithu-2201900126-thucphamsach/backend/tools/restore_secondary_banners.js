const mysql = require('mysql2/promise');

async function restoreBanners() {
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ltht_thucphamsach'
    };

    try {
        const db = await mysql.createConnection(dbConfig);

        const banners = [
            {
                title: 'Giao Hàng Siêu Tốc',
                description: 'Nông sản sạch từ trang trại đến bàn ăn chỉ trong 2 giờ',
                type: 'secondary',
                hinhanh: 'banner_secondary_delivery.png',
                button_text: 'Xem ngay',
                button_color: 'success',
                link_path: '/products',
                thutu: 1,
                trangthai: 1
            },
            {
                title: 'Thực Phẩm Tươi Sống',
                description: 'Cung cấp nguồn Protein thượng hạng, đạt chuẩn VietGAP',
                type: 'secondary',
                hinhanh: 'banner_secondary_protein.png',
                button_text: 'Khám phá',
                button_color: 'warning',
                link_path: '/products',
                thutu: 2,
                trangthai: 1
            }
        ];

        for (const b of banners) {
            await db.execute(
                "INSERT INTO banners (title, description, type, hinhanh, button_text, button_color, link_path, thutu, trangthai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [b.title, b.description, b.type, b.hinhanh, b.button_text, b.button_color, b.link_path, b.thutu, b.trangthai]
            );
        }

        console.log('Successfully re-inserted 2 secondary banners');
        await db.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

restoreBanners();
