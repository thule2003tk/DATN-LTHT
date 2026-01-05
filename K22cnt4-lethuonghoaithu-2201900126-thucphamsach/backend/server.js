const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// 1️⃣ KHỞI TẠO APP
const app = express();

// 2️⃣ MIDDLEWARE
app.use(cors());
app.use(express.json());

// 👉 PUBLIC THƯ MỤC UPLOADS (CỰC KỲ QUAN TRỌNG)
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// 3️⃣ ROUTES
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/sanpham", require("./src/routes/sanpham"));
app.use("/api/giohang", require("./src/routes/giohang"));
app.use("/api/khuyenmai", require("./src/routes/khuyenmai"));
app.use("/api/donhang", require("./src/routes/donhang"));
app.use("/api/lienhe", require("./src/routes/lienhe"));
app.use("/api/admin/users", require("./src/routes/admin.users"));


// 4️⃣ ROUTE TEST
app.get("/", (req, res) => {
  res.send("🚀 Backend Thực Phẩm Sạch đang chạy");
});

// 5️⃣ SERVER LISTEN
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
