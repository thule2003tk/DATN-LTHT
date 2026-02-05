const mysql = require('mysql2/promise');

async function debugBanners() {
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ltht_thucphamsach'
    };

    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT * FROM banners WHERE type = "secondary"');
        console.log('--- Secondary Banners in DB ---');
        console.log(JSON.stringify(rows, null, 2));
        await db.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

debugBanners();
