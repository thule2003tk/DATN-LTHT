const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 1️⃣ KHỞI TẠO APP EXPRESS
const app = express();

// 2️⃣ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

// 3️⃣ ROUTES
const authRoutes = require("./src/routes/auth");
app.use("/api/auth", authRoutes);
// upload
const sanphamRoutes = require("./src/routes/sanpham");
app.use("/api/sanpham", sanphamRoutes);
// gio hang
const giohangRoutes = require("./src/routes/giohang");
app.use("/api/giohang", giohangRoutes);
//khuyenn mai
const khuyenmaiRoutes = require("./src/routes/khuyenmai");
app.use("/api/khuyenmai", khuyenmaiRoutes);
// don hàng
const donhangRoutes = require("./src/routes/donhang");
app.use("/api/donhang", donhangRoutes);
//lien he 
app.use("/api/lienhe", require("./src/routes/lienhe"));
// 4️⃣ ROUTE TEST
app.get("/", (req, res) => {
  res.send("🚀 Backend Thực Phẩm Sạch đang chạy");
});

// 5️⃣ SERVER LISTEN
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
