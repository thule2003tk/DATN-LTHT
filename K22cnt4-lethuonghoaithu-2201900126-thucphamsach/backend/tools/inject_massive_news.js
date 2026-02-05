const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

const createSuperLongContent = (title, category) => {
    let intro = `CHƯƠNG 1: GIỚI THIỆU TỔNG QUAN VỀ ${title.toUpperCase()}\n\n`;
    intro += `Trong kỷ nguyên số hiện nay, thông tin chính xác và chi tiết về thực phẩm sạch không chỉ là nhu cầu mà còn là quyền lợi sát sườn của mỗi người tiêu dùng. Bài viết này sẽ đi sâu vào phân tích mọi góc cạnh của nội dung "${title}", một trong những chủ đề đang nhận được sự quan tâm đặc biệt tại hệ thống HTFood.\n\n`;
    intro += `Chúng ta thường nghe nói về thực phẩm sạch, nhưng định nghĩa thực sự đằng sau nó là gì? Tại HTFood, sạch không chỉ là không có thuốc trừ sâu. Sạch là một hệ thống khép kín, từ hơi thở của đất, độ tinh khiết của nước đến bàn tay tận tâm của người nông dân. Nội dung dưới đây sẽ mang đến một cái nhìn toàn cảnh chưa từng có.\n\n`;

    let body = `CHƯƠNG 2: PHÂN TÍCH CHI TIẾT VÀ QUY TRÌNH THỰC HIỆN\n\n`;
    for (let i = 1; i <= 15; i++) {
        body += `Mục ${i}: Phân đoạn kiến thức chuyên sâu thứ ${i}...\n`;
        body += `Để đảm bảo tính chuyên nghiệp của "${title}", đội ngũ kỹ sư của chúng tôi đã triển khai một quy trình giám sát nghiêm ngặt. Phân đoạn này tập trung vào các tiêu chuẩn chất lượng ISO và HACCP mà chúng tôi đang áp dụng. Chúng tôi hiểu rằng mỗi miligram dư lượng chất hóa học đều có thể ảnh hưởng đến sức khỏe lâu dài của gia đình bạn. Vì vậy, các thiết bị cảm biến hiện đại đã được lắp đặt để theo dõi từng chỉ số sinh hóa của nông sản.\n\n`;
        body += `Hơn thế nữa, việc ứng dụng công nghệ ${category === 'HTFood' ? 'quản trị độc quyền' : 'nông nghiệp tiên tiến'} đã giúp giảm thiểu tối đa các rủi ro từ môi trường. Chúng tôi không chỉ trồng cây, chúng tôi đang nuôi dưỡng sự sống. Từng hạt mầm đều mang trong mình sứ mệnh mang lại nụ cười hạnh phúc và cơ thể khỏe mạnh cho quý khách hàng.\n\n`;
        body += `Trong giai đoạn tiếp theo, chúng tôi sẽ phối hợp với các tổ chức quốc tế để nâng cấp toàn diện hạ tầng. Điều này bao gồm việc xây dựng các phòng Lab kiểm định ngay tại cửa hàng, giúp khách hàng có thể kiểm tra mẫu thực phẩm mình mua chỉ trong vài phút. Đây là một sự đầu tư tốn kém nhưng HTFood sẵn sàng thực hiện vì lòng tin của bạn là tài sản quý giá nhất của chúng tôi.\n\n`;
    }

    let expert = `CHƯƠNG 3: GÓC NHÌN CHUYÊN GIA VÀ LỜI KHUYÊN DÀNH CHO GIA ĐÌNH\n\n`;
    expert += `Theo TS. Nguyễn Văn A, chuyên gia hàng đầu về dinh dưỡng và an toàn thực phẩm: "Việc tiếp cận thông tin như trong bài '${title}' là bước đi đột phá của HTFood. Người tiêu dùng cần được trang bị những kiến thức sâu như thế này để có sự lựa chọn thông thái nhất".\n\n`;
    expert += `Dưới đây là 10 lời khuyên hữu ích để bạn tối ưu hóa lợi ích từ chủ đề này:\n`;
    for (let j = 1; j <= 10; j++) {
        expert += `${j}. Bí quyết thứ ${j}: Luôn luôn kiểm tra nguồn gốc và mã QR tại HTFood để biết chi tiết về quá trình canh tác của sản phẩm bạn vừa chọn.\n`;
    }

    let conclusion = `\nCHƯƠNG 4: KẾT LUẬN VÀ TẦM NHÌN TƯƠNG LAI\n\n`;
    conclusion += `Tóm lại, "${title}" không chỉ là một mẩu tin thời sự, mà là một phần trong nỗ lực không ngừng của HTFood nhằm mang lại giá trị bền vững. Chúng tôi sẽ tiếp tục cập nhật những diễn biến mới nhất về chủ đề này trong các bản tin tiếp theo.\n\n`;
    conclusion += `HTFood - Sạch từ tâm, xứng tầm niềm tin. Chúc quý khách và gia đình luôn có những bữa cơm ngon, sạch và tràn đầy hạnh phúc.\n\n`;
    conclusion += `(Ban biên tập nội dung HTFood - Bản tin số hiệu 2026/News-Ref-${Math.floor(Math.random() * 1000)})`;

    return intro + body + expert + conclusion;
};

db.connect((err) => {
    if (err) process.exit(1);
    db.query('SELECT ma_tt, tieu_de, loai_tin FROM tintuc', (err, rows) => {
        if (err) { db.end(); return; }

        let completed = 0;
        rows.forEach(row => {
            const superLongContent = createSuperLongContent(row.tieu_de, row.loai_tin);
            db.query('UPDATE tintuc SET noi_dung = ? WHERE ma_tt = ?', [superLongContent, row.ma_tt], (err) => {
                completed++;
                if (err) console.error(err);
                if (completed === rows.length) {
                    console.log(`✅ Đã nạp thành công ${rows.length} bài viết "khổng lồ" vào DB.`);
                    db.end();
                }
            });
        });
    });
});
