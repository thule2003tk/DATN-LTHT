const mysql = require('mysql2/promise');

async function updateDB() {
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ltht_thucphamsach'
    };

    try {
        const db = await mysql.createConnection(dbConfig);
        const banners = [
            { title: 'Mật Ong Rừng', desc: 'Nguyên chất 100%, bổ dưỡng', img: 'dual_honey.png' },
            { title: 'Gia Vị Tự Nhiên', desc: 'Đậm đà hương vị truyền thống', img: 'dual_spices.png' },
            { title: 'Trứng Gà Sạch', desc: 'Từ trang trại tiêu chuẩn VietGAP', img: 'dual_eggs.png' },
            { title: 'Trà Thảo Mộc', desc: 'Thanh nhiệt, giải độc cơ thể', img: 'dual_tea.png' }
        ];

        for (const b of banners) {
            await db.execute(
                'INSERT INTO banners (title, description, type, hinhanh, button_text, button_color, link_path, thutu, trangthai) VALUES (?, ?, "dual", ?, "Mua ngay", "success", "/products", 0, 1)',
                [b.title, b.desc, b.img]
            );
        }
        console.log('Successfully inserted 4 dual banners');
        await db.end();
    } catch (err) {
        console.error('Database error:', err.message);
    }
}

updateDB();
