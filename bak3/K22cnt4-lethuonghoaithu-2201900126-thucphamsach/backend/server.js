const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const { verifyToken, checkAdmin, checkStaffOrAdmin, restrictDeleteForStaff } = require("./src/middlewares/auth");

console.log("🚀 [DEBUG] server.js is starting up...");

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
// --- Tin tức Chuyên nghiệp (Độc lập) ---
app.use("/api/tintuc", require("./src/routes/tintuc"));
app.use("/api/admin/tintuc", verifyToken, checkStaffOrAdmin, require("./src/routes/admin.tintuc"));

app.use("/api/blog", require("./src/routes/blog"));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/sanpham", require("./src/routes/sanpham"));
app.use("/api/admin/danhmuc", verifyToken, checkStaffOrAdmin, restrictDeleteForStaff, require("./src/routes/admin.danhmuc"));
app.use("/api/giohang", require("./src/routes/giohang"));
app.use("/api/khuyenmai", require("./src/routes/khuyenmai"));
app.use("/api/donhang", require("./src/routes/donhang"));
app.use("/api/admin/banners", verifyToken, checkStaffOrAdmin, require("./src/routes/admin.banners"));
app.use("/api/banners", require("./src/routes/banners"));

// Route công khai để lấy danh sách danh mục (Chỉ cho phép GET)
app.use("/api/danhmuc", (req, res, next) => {
  if (req.method === "GET") {
    return next();
  }
  return res.status(403).json({ error: "Thao tác này yêu cầu quyền quản trị" });
}, require("./src/routes/admin.danhmuc"));
app.use("/api/lienhe", require("./src/routes/lienhe"));
app.use("/api/admin/users", verifyToken, checkAdmin, require("./src/routes/admin.users"));
app.use("/api/khachhang", verifyToken, checkStaffOrAdmin, require("./src/routes/khachhang"));
app.use("/api/donvisanpham", require("./src/routes/donvisanpham"));
app.use("/api/admin/products", verifyToken, checkStaffOrAdmin, restrictDeleteForStaff, require("./src/routes/admin.products"));
app.use("/api/admin", verifyToken, checkStaffOrAdmin, require("./src/routes/admin.revenue"));
app.use("/api/admin/donvitinh", verifyToken, checkStaffOrAdmin, restrictDeleteForStaff, require("./src/routes/admin.donvitinh"));
app.use("/api/admin/donvisanpham", verifyToken, checkStaffOrAdmin, restrictDeleteForStaff, require("./src/routes/admin.donvisanpham"));
app.use("/api/admin/suppliers", verifyToken, checkStaffOrAdmin, restrictDeleteForStaff, require("./src/routes/admin.suppliers"));
app.use("/api/admin/notifications", verifyToken, checkStaffOrAdmin, require("./src/routes/admin.notifications"));
/* ================= TEST ROOT ================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend đang chạy!");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
