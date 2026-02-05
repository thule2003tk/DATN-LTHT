const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ltht_thucphamsach",
});

const banners = [
    { img: "banner_veggies.png", title: "Rau Củ Hữu Cơ", desc: "Tươi ngon như vừa mới hái tại vườn", btn: "Mua ngay", color: "success", path: "/products?category=Rau củ", order: 1 },
    { img: "banner_meat.png", title: "Thịt & Hải Sản", desc: "Nguồn gốc rõ ràng, đạt chuẩn VietGAP", btn: "Xem ngay", color: "danger", path: "/products?category=Thịt tươi", order: 2 },
    { img: "banner_fruits.png", title: "Trái Cây Nhiệt Đới", desc: "Mọng nước và giàu Vitamin cho gia đình", btn: "Mua ngay", color: "warning", path: "/products?category=Hoa quả", order: 3 },
    { img: "banner_brand2.png", title: "Bữa Ăn Hạnh Phúc", desc: "Nấu ăn ngon hơn với nguyên liệu sạch", btn: "Khám phá", color: "success", path: "/tintuc", order: 4 },
];

db.connect((err) => {
    if (err) process.exit(1);

    const sql = "INSERT INTO banners (hinhanh, title, description, button_text, button_color, link_path, thutu) VALUES ?";
    const values = banners.map(b => [b.img, b.title, b.desc, b.btn, b.color, b.path, b.order]);

    db.query(sql, [values], (err) => {
        if (err) console.error("❌ Lỗi di chuyển dữ liệu:", err);
        else console.log("✅ Đã di chuyển 4 banner vào Database!");
        db.end();
    });
});
