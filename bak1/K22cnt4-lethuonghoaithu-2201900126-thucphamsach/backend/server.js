const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// 🟢 CORS – đặt đầu tiên
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🟢 Body Parser
app.use(express.json());

// 🟢 Static for uploads
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// 🟢 Import routes
app.use("/api/blog", require("./src/routes/blog"));
app.use("/api/admin", require("./src/routes/admin")); // New admin route
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/sanpham", require("./src/routes/sanpham"));
app.use("/api/giohang", require("./src/routes/giohang"));
app.use("/api/khuyenmai", require("./src/routes/khuyenmai"));
app.use("/api/donhang", require("./src/routes/donhang"));
app.use("/api/lienhe", require("./src/routes/lienhe"));
app.use("/api/admin/users", require("./src/routes/admin.users"));
app.use("/api/khachhang", require("./src/routes/khachhang"));
app.use("/api/donvisanpham", require("./src/routes/donvisanpham"));
// 🟢 Test endpoint
app.get("/", (req, res) => {
  res.send("🚀 Backend đang chạy!");
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log("✅ CORS active for: http://localhost:5173, http://localhost:5174");
});
