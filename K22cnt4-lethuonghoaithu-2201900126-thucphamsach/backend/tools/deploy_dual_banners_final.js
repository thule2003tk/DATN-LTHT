const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function deployDualBanners() {
    const brainDir = 'C:\\Users\\ThuPC\\.gemini\\antigravity\\brain\\31e65013-d1d9-47f2-a968-4cc3cea15899';
    const uploadDir = 'c:\\Users\\ThuPC\\Documents\\dcd2\\K22cnt4-lethuonghoaithu-2201900126-thucphamsach\\backend\\src\\uploads';

    const files = [
        { src: 'dual_banner_honey_1770188155856.png', dest: 'dual_honey.png' },
        { src: 'dual_banner_spices_1770188173940.png', dest: 'dual_spices.png' },
        { src: 'dual_banner_eggs_1770188193460.png', dest: 'dual_eggs.png' },
        { src: 'dual_banner_tea_1770188207932.png', dest: 'dual_tea.png' }
    ];

    // 1. Copy files
    for (const f of files) {
        try {
            const srcPath = path.join(brainDir, f.src);
            const destPath = path.join(uploadDir, f.dest);
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${f.src} to ${f.dest}`);
        } catch (err) {
            console.error(`Error copying ${f.src}:`, err.message);
        }
    }

    // 2. Update DB
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ltht_thucphamsach'
    };

    try {
        const db = await mysql.createConnection(dbConfig);

        const banners = [
            { title: 'Mật Ong Rừng', description: 'Nguyên chất 100%, bổ dưỡng', hinhanh: 'dual_honey.png' },
            { title: 'Gia Vị Tự Nhiên', description: 'Đậm đà hương vị truyền thống', hinhanh: 'dual_spices.png' },
            { title: 'Trứng Gà Sạch', description: 'Từ trang trại tiêu chuẩn VietGAP', hinhanh: 'dual_eggs.png' },
            { title: 'Trà Thảo Mộc', description: 'Thanh nhiệt, giải độc cơ thể', hinhanh: 'dual_tea.png' }
        ];

        for (const b of banners) {
            await db.execute(
                "INSERT INTO banners (title, description, type, hinhanh, button_text, button_color, link_path, thutu, trangthai) VALUES (?, ?, 'dual', ?, 'Mua ngay', 'success', '/products', 0, 1)",
                [b.title, b.description, b.hinhanh]
            );
        }

        console.log('Successfully populated DB with 4 dual banners');
        await db.end();
    } catch (err) {
        console.error('Error updating DB:', err.message);
    }
}

deployDualBanners();
