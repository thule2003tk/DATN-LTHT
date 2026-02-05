const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ltht_thucphamsach' });

const longArticles = {
    16: `HTFood bắt tay cùng nông dân Lâm Đồng phát triển vùng nguyên liệu sạch... (Xem nội dung chi tiết bên dưới)

Hợp tác chiến lược giữa HTFood và nông dân Lâm Đồng không chỉ đơn thuần là một bản thỏa thuận mua bán, mà là một hành trình dài hạn nhằm định nghĩa lại tiêu chuẩn nông sản sạch tại Việt Nam.

PHẦN 1: TẦM NHÌN CHIẾN LƯỢC
Trong bối cảnh người tiêu dùng ngày càng lo ngại về vệ sinh an toàn thực phẩm, HTFood đã xác định rằng việc làm chủ vùng nguyên liệu chính là chìa khóa cốt lõi. Lâm Đồng, với khí hậu ôn hòa và thổ nhưỡng đặc trưng của vùng cao nguyên, là địa điểm lý tưởng nhất để thực hiện giấc mơ này. Chúng tôi không chỉ chọn những mảnh đất tốt nhất, mà còn chọn những người nông dân tâm huyết nhất để đồng hành.

PHẦN 2: QUY TRÌNH CANH TÁC "KHÔNG THỎA HIỆP"
Dưới sự hỗ trợ của các chuyên gia nông nghiệp từ HTFood, hơn 50 hộ nông dân tại Đà Lạt và Lạc Dương đã được đào tạo bài bản về tiêu chuẩn VietGAP và GlobalGAP. Quy trình này bao gồm:
- Kiểm soát nguồn nước tưới: Nước phải được xét nghiệm định kỳ, đảm bảo không nhiễm kim loại nặng hoặc vi khuẩn có hại.
- Sử dụng phân bón hữu cơ: Hoàn toàn loại bỏ phân bón hóa học độc hại, thay vào đó là phân xanh, phân chuồng đã qua xử lý vi sinh.
- Phòng trừ sâu bệnh sinh học: Sử dụng các chế phẩm thảo mộc và bẫy sinh học để bảo vệ cây trồng mà không để lại dư lượng hóa chất.

PHẦN 3: CÔNG NGHỆ SAU THU HOẠCH
Một trong những điểm yếu của nông sản Việt Nam là khâu bảo quản. HTFood đã đầu tư hệ thống kho lạnh ngay tại vùng nguyên liệu. Rau củ ngay sau khi hái sẽ được xử lý nhiệt độ để duy trì độ tươi ngon và hàm lượng dinh dưỡng cao nhất trước khi vận chuyển về các thành phố lớn.

PHẦN 4: Ý NGHĨA CỘNG ĐỒNG VÀ PHÁT TRIỂN BỀN VỮNG
Dự án này mang lại nguồn thu nhập ổn định tăng hơn 30% cho các hộ nông dân tham gia. HTFood cam kết bao tiêu toàn bộ sản phẩm với giá ổn định, giúp bà con yên tâm sản xuất mà không phải lo cảnh "được mùa mất giá".

KẾT LUẬN
Bằng cách siết chặt tay với nông dân, HTFood không chỉ mang đến những bó rau xanh mát cho bàn ăn gia đình bạn, mà còn đang góp phần xây dựng một nền nông nghiệp tử tế, bền vững cho tương lai.`,

    1: `HTFood chính thức đạt chứng nhận GLOBALG.A.P - Bước ngoặt vươn tầm thế giới...

GLOBALG.A.P (Global Good Agricultural Practice) là một bộ tiêu chuẩn quốc tế về thực hành nông nghiệp tốt. Việc HTFood đạt được chứng chỉ này là một minh chứng đanh thép cho chất lượng sản phẩm đỉnh cao của chúng tôi.

CHƯƠNG 1: QUÁ TRÌNH CHINH PHỤC TIÊU CHUẨN KHẮT KHE
Để đạt được GLOBALG.A.P, toàn bộ hệ thống từ trang trại đến khâu đóng gói của HTFood đã phải trải qua 12 tháng cải tổ toàn diện. Mọi khâu nhỏ nhất đều được ghi chép nhật ký sản xuất điện tử (e-log), từ ngày gieo hạt, loại phân bón sử dụng đến danh tính của người thu hoạch.

CHƯƠNG 2: CUỘC CÁCH MẠNG TRONG TÂM THẾ NGƯỜI SẢN XUẤT
Chứng nhận này không chỉ là một tờ giấy, đó là một lối sống. Công nhân tại trang trại HTFood được trang bị đồ bảo hộ chuẩn, có khu vực vệ sinh riêng biệt và được đào tạo về an toàn lao động. Chúng tôi tôn trọng cả thiên nhiên và con người tham gia vào chuỗi cung ứng.

CHƯƠNG 3: LỢI ÍCH TRỰC TIẾP CHO NGƯỜI TIÊU DÙNG
Khi cầm trên tay một sản phẩm được dán nhãn GLOBALG.A.P của HTFood, bạn có thể hoàn toàn yên tâm:
- Sản phẩm có thể truy xuất nguồn gốc đến tận lô đất canh tác.
- Đảm bảo không có dư lượng thuốc bảo vệ thực vật.
- Đảm bảo hàm lượng vi sinh vật có lợi tối ưu.

CHƯƠNG 4: HƯỚNG TỚI THỊ TRƯỜNG XUẤT KHẨU
Với tấm vé thông hành này, HTFood đang lên kế hoạch đưa trái cây đặc sản Việt Nam sang các thị trường khó tính như Nhật Bản và EU trong quý III năm 2026.

LỜI KẾT
Sự kiện này đánh dấu một chương mới cho HTFood. Chúng tôi tự hào là đơn vị tiên phong đưa nông sản Việt sánh ngang với các cường quốc nông nghiệp trên thế giới.`,

    10: `Công nghệ AI giúp tối ưu hóa năng suất rau sạch - Khi Trí tuệ nhân tạo làm "nông dân"...

Cuộc cách mạng công nghiệp 4.0 đang len lỏi vào từng kẽ lá tại các trang trại thông minh của HTFood. AI không còn là khái niệm xa vời, nó đang trực tiếp tạo ra những sản phẩm chất lượng nhất cho bạn.

1. HỆ THỐNG MẮT THẦN (COMPUTER VISION)
Chúng tôi sử dụng hàng loạt camera độ phân giải cao kết nối với hệ thống AI để theo dõi cây trồng 24/7. AI có khả năng phát hiện sớm các dấu hiệu thiếu hụt dinh dưỡng hoặc sâu bệnh ngay cả khi mắt thường chưa nhận ra. Điều này giúp chúng tôi can thiệp kịp thời, tiết kiệm 50% chi phí xử lý.

2. TỰ ĐỘNG HÓA MÔI TRƯỜNG CANH TÁC
AI kết nối với các cảm biến độ ẩm, nhiệt độ và nồng độ CO2. Khi trời nắng gắt, hệ thống sẽ tự động hạ màn che và bật phun sương. Khi đất khô, lượng nước tưới sẽ được tính toán chính xác đến từng mililit cho mỗi gốc cây.

3. DỰ BÁO THU HOẠCH CHÍNH XÁC
Dựa trên dữ liệu lịch sử và diễn biến thời tiết, AI có thể dự báo chính xác ngày thu hoạch tốt nhất - thời điểm mà rau củ đạt hàm lượng vitamin và độ giòn ngọt cao nhất.

4. GIẢM THIỂU TÁC ĐỘNG MÔI TRƯỜNG
Nhờ sự chính xác tuyệt đối, lượng phân bón và nước tưới được tiết kiệm tối đa, tránh lãng phí tài nguyên và bảo vệ hệ sinh thái đất đai.

TƯƠNG LAI
HTFood đang thử nghiệm robot thu hoạch tự động giúp giảm tiếp xúc của con người với thực phẩm, đảm bảo sự vô trùng tuyệt đối từ trang trại đến tay khách hàng. AI không thay thế con người, nhưng AI giúp chúng tôi phục vụ bạn tốt hơn mỗi ngày.`
};

db.connect((err) => {
    if (err) process.exit(1);
    let count = 0;
    const ids = Object.keys(longArticles);
    ids.forEach(id => {
        // Để làm nội dung "dài cực đại", chúng ta sẽ lặp lại nội dung mẫu này nhiều lần nếu cần
        // Ở đây tôi sẽ viết nội dung mẫu chất lượng cho 3 bài quan trọng nhất.
        db.query('UPDATE tintuc SET noi_dung = ? WHERE ma_tt = ?', [longArticles[id], id], (err) => {
            count++;
            if (err) console.error(err);
            if (count === ids.length) {
                console.log('✅ Đã nâng cấp các bài viết trọng điểm lên nội dung chuyên sâu.');
                db.end();
            }
        });
    });
});
