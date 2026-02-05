const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function fixBanners() {
    const brainDir = 'C:\\Users\\ThuPC\\.gemini\\antigravity\\brain\\31e65013-d1d9-47f2-a968-4cc3cea15899';
    const uploadDir = 'c:\\Users\\ThuPC\\Documents\\dcd2\\K22cnt4-lethuonghoaithu-2201900126-thucphamsach\\backend\\src\\uploads';

    const files = [
        { src: 'secondary_banner_farm_fresh_1770152040794.png', dest: 'banner_farm_fresh.png' },
        { src: 'secondary_banner_tropical_fruits_1770152058875.png', dest: 'banner_tropical_fruits.png' }
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
        await db.execute("UPDATE banners SET hinhanh = 'banner_farm_fresh.png' WHERE title = 'Ưu đãi Nông Sản Sạch' AND type = 'secondary'");
        await db.execute("UPDATE banners SET hinhanh = 'banner_tropical_fruits.png' WHERE title = 'Trái Cây Nhiệt Đới' AND type = 'secondary'");
        console.log('Successfully updated database with correct banner filenames');
        await db.end();
    } catch (err) {
        console.error('Error updating DB:', err.message);
    }
}

fixBanners();
