const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());

/* ================= STATIC UPLOADS ================= */
/*
  📌 RẤT QUAN TRỌNG
  - Multer lưu ảnh vào thư mục: uploads/
  - Express phải trỏ đúng uploads/
*/
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

/* ================= ROUTES ================= */
app.use("/api/blog", require("./src/routes/blog"));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/sanpham", require("./src/routes/sanpham"));
app.use("/api/admin/danhmuc", require("./src/routes/admin.danhmuc"));
app.use("/api/giohang", require("./src/routes/giohang"));
app.use("/api/khuyenmai", require("./src/routes/khuyenmai"));
app.use("/api/donhang", require("./src/routes/donhang"));
app.use("/api/lienhe", require("./src/routes/lienhe"));
app.use("/api/admin/users", require("./src/routes/admin.users"));
app.use("/api/khachhang", require("./src/routes/khachhang"));
app.use("/api/donvisanpham", require("./src/routes/donvisanpham"));
app.use("/api/admin/products", require("./src/routes/admin.products"));
app.use("/api/admin", require("./src/routes/admin.revenue"));
app.use("/api/admin/donvitinh", require("./src/routes/admin.donvitinh"));
app.use("/api/admin/donvisanpham", require("./src/routes/admin.donvisanpham"));
/* ================= TEST ROOT ================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend đang chạy!");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
