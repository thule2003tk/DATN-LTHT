const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function deployCleanBanners() {
    const brainDir = 'C:\\Users\\ThuPC\\.gemini\\antigravity\\brain\\31e65013-d1d9-47f2-a968-4cc3cea15899';
    const uploadDir = 'c:\\Users\\ThuPC\\Documents\\dcd2\\K22cnt4-lethuonghoaithu-2201900126-thucphamsach\\backend\\src\\uploads';

    const files = [
        { src: 'clean_secondary_delivery_v2_1770154566067.png', dest: 'banner_secondary_v2_delivery.png' },
        { src: 'clean_secondary_protein_v2_1770154583180.png', dest: 'banner_secondary_v2_protein.png' }
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

        await db.execute(
            "UPDATE banners SET hinhanh = 'banner_secondary_v2_delivery.png' WHERE title = 'Giao Hàng Siêu Tốc' AND type = 'secondary'"
        );
        await db.execute(
            "UPDATE banners SET hinhanh = 'banner_secondary_v2_protein.png' WHERE title = 'Thực Phẩm Tươi Sống' AND type = 'secondary'"
        );

        console.log('Successfully updated DB with clean, text-free banner images');
        await db.end();
    } catch (err) {
        console.error('Error updating DB:', err.message);
    }
}

deployCleanBanners();
