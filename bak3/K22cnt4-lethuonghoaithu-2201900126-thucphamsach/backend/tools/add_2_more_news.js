const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

const news = [
    {
        tieu_de: 'HTFood bắt tay cùng nông dân Lâm Đồng phát triển vùng nguyên liệu sạch',
        mo_ta: 'Hợp tác chiến lược giúp đảm bảo nguồn cung rau củ quả ổn định và đạt chuẩn 100% hữu cơ.',
        noi_dung: 'HTFood đã ký kết biên bản ghi nhớ với hơn 50 hộ nông dân tại Đà Lạt, Lâm Đồng để triển khai mô hình canh tác chuẩn VietGAP nâng cao. Dự án này không chỉ giúp người dân có đầu ra ổn định mà còn giúp khách hàng HTFood luôn có rau tươi mới hái mỗi ngày...',
        hinh_anh: 'lam_dong.jpg',
        loai_tin: 'Trong nước'
    },
    {
        tieu_de: 'Thế nào là một bữa ăn cân bằng dinh dưỡng? Chuyên gia HTFood giải đáp',
        mo_ta: 'Lời khuyên từ các bác sĩ dinh dưỡng để có sức khỏe vàng qua từng bữa ăn hằng ngày.',
        noi_dung: 'Một bữa ăn cân bằng không chỉ là ăn no, mà phải đầy đủ 4 nhóm chất: đạm, béo, bột đường và vitamin. Chuyên gia HTFood gợi ý công thức 1/2 đĩa là rau củ, 1/4 là protein và 1/4 là ngũ cốc nguyên hạt để duy trì vóc dáng và năng lượng...',
        hinh_anh: 'dinh_duong.jpg',
        loai_tin: 'HTFood'
    }
];

db.connect((err) => {
    if (err) process.exit(1);
    let count = 0;
    news.forEach(item => {
        db.query('INSERT INTO tintuc SET ?', item, (err) => {
            count++;
            if (err) console.error(err);
            if (count === news.length) {
                console.log('✅ Đã nạp thêm 2 bài tin tức chiến lược.');
                db.end();
            }
        });
    });
});
