const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function deployNewProducts() {
    const brainDir = 'C:\\Users\\ThuPC\\.gemini\\antigravity\\brain\\31e65013-d1d9-47f2-a968-4cc3cea15899';
    const uploadDir = 'c:\\Users\\ThuPC\\Documents\\dcd2\\K22cnt4-lethuonghoaithu-2201900126-thucphamsach\\backend\\src\\uploads';

    const imageFiles = [
        { src: 'prod_blueberries_v4_1770190753291.png', dest: 'prod_blueberry.png' },
        { src: 'prod_avocado_v4_1770190768369.png', dest: 'prod_avocado.png' },
        { src: 'prod_broccoli_v4_1770190782667.png', dest: 'prod_broccoli.png' },
        { src: 'prod_spinach_v4_1770190798731.png', dest: 'prod_spinach.png' },
        { src: 'prod_beef_sirloin_v4_1770190814669.png', dest: 'prod_beef.png' },
        { src: 'prod_chicken_breast_v4_1770190830678.png', dest: 'prod_chicken.png' },
        { src: 'prod_shrimps_v4_1770190846542.png', dest: 'prod_shrimp.png' },
        { src: 'prod_seabass_v4_1770190865398.png', dest: 'prod_seabass.png' },
        { src: 'prod_brown_rice_v4_1770190880711.png', dest: 'prod_rice.png' }
    ];

    // 1. Copy images
    for (const f of imageFiles) {
        try {
            fs.copyFileSync(path.join(brainDir, f.src), path.join(uploadDir, f.dest));
            console.log(`Copied ${f.dest}`);
        } catch (e) {
            console.error(`Error copying ${f.dest}:`, e.message);
        }
    }

    // 2. Insert into DB
    const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' };
    try {
        const db = await mysql.createConnection(dbConfig);

        const products = [
            { ma: 'SP' + Date.now() + '01', ten: 'Việt quất tươi', gia: 120000, dvt: 'DVT05', dm: 'DM001', dmn: 'Hoa quả', img: 'prod_blueberry.png', mota: 'Việt quất nhập khẩu, quả mọng, ngọt thanh và giàu vitamin.' },
            { ma: 'SP' + Date.now() + '02', ten: 'Bơ sáp Đắk Lắk', gia: 55000, dvt: 'DVT06', dm: 'DM001', dmn: 'Hoa quả', img: 'prod_avocado.png', mota: 'Bơ sáp loại 1 Đắk Lắk, cơm vàng, dẻo và béo ngậy.' },
            { ma: 'SP' + Date.now() + '03', ten: 'Súp lơ xanh Đà Lạt', gia: 35000, dvt: 'DVT05', dm: 'DM007', dmn: 'Rau củ', img: 'prod_broccoli.png', mota: 'Súp lơ xanh tươi sạch Đà Lạt, giòn ngọt, giàu dưỡng chất.' },
            { ma: 'SP' + Date.now() + '04', ten: 'Cải bó xôi hữu cơ', gia: 25000, dvt: 'DVT1769789', dm: 'DM007', dmn: 'Rau củ', img: 'prod_spinach.png', mota: 'Rau chân vịt chuẩn hữu cơ, tươi non giàu sắt.' },
            { ma: 'SP' + Date.now() + '05', ten: 'Thăn ngoại bò Úc', gia: 450000, dvt: 'DVT05', dm: 'DM008', dmn: 'Thịt tươi', img: 'prod_beef.png', mota: 'Thịt bò Úc cao cấp, vân mỡ đều, mềm tan trong miệng.' },
            { ma: 'SP' + Date.now() + '06', ten: 'Ức gà phi lê', gia: 95000, dvt: 'DVT05', dm: 'DM008', dmn: 'Thịt tươi', img: 'prod_chicken.png', mota: 'Ức gà sạch, không kháng sinh, tốt cho sức khỏe.' },
            { ma: 'SP' + Date.now() + '07', ten: 'Tôm sú tươi sống', gia: 380000, dvt: 'DVT05', dm: 'DM002', dmn: 'Thực phẩm tươi', img: 'prod_shrimp.png', mota: 'Tôm sú biển tươi sống, thịt chắc và rất ngọt.' },
            { ma: 'SP' + Date.now() + '08', ten: 'Phi lê cá chẽm', gia: 220000, dvt: 'DVT05', dm: 'DM002', dmn: 'Thực phẩm tươi', img: 'prod_seabass.png', mota: 'Cá chẽm tươi phi lê sẵn, da giòn thịt trắng thơm.' },
            { ma: 'SP' + Date.now() + '09', ten: 'Gạo lứt đỏ hữu cơ', gia: 65000, dvt: 'DVT05', dm: 'DM005', dmn: 'Ngũ cốc', img: 'prod_rice.png', mota: 'Gạo lứt đỏ hữu cơ, tốt cho người ăn kiêng và tim mạch.' }
        ];

        for (const p of products) {
            // Insert product
            await db.execute(
                "INSERT INTO sanpham (ma_sp, ten_sp, mota, gia, ma_dvt, hinhanh, ma_danhmuc, ten_danhmuc, ma_ncc, created_at, giay_chung_nhan, soluong_ton, phan_tram_giam_gia, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'NCC01', NOW(), 'vietgap_htfood.png', 100, 0, 1)",
                [p.ma, p.ten, p.mota, p.gia, p.dvt, p.img, p.dm, p.dmn]
            );
            // Insert category mapping
            await db.execute(
                "INSERT INTO sanpham_danhmuc (ma_sp, ma_danhmuc) VALUES (?, ?)",
                [p.ma, p.dm]
            );
        }

        console.log(`Successfully added 9 new products to DB (Final Fix)`);
        await db.end();
    } catch (e) {
        console.error('DB Error:', e.message);
    }
}

deployNewProducts();
