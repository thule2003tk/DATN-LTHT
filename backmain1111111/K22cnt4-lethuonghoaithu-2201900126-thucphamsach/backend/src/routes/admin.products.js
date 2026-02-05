const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===========================
   CẤU HÌNH MULTER
=========================== */
// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===========================
   GET: danh sách sản phẩm
=========================== */
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      sp.ma_sp,
      sp.ten_sp,
      sp.ten_danhmuc,
      sp.ma_danhmuc,
      sp.mota,
      sp.gia,
      sp.soluong_ton,
      sp.hinhanh,
      sp.ma_ncc,
      sp.ma_dvt,
      sp.thongtin_sanpham,
      sp.phan_tram_giam_gia,
      sp.is_featured,
      sp.created_at,
      dvt.ten_dvt,
      ncc.ten_ncc
    FROM sanpham sp
    LEFT JOIN donvitinh dvt ON sp.ma_dvt = dvt.ma_dvt
    LEFT JOIN nhacungcap ncc ON sp.ma_ncc = ncc.ma_ncc
    ORDER BY sp.ma_sp DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ===========================
   GET: chi tiết 1 sản phẩm
=========================== */
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM sanpham WHERE ma_sp = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

      res.json(rows[0]);
    }
  );
});

/* ===========================
   POST: thêm sản phẩm (CÓ UPLOAD ẢNH)
 =========================== */
router.post("/", upload.single("hinhanh"), (req, res) => {
  try {
    const {
      ten_sp,
      ten_danhmuc,
      ma_danhmuc,
      mota,
      gia,
      soluong_ton,
      ma_ncc,
      ma_dvt,
      thongtin_sanpham,
      phan_tram_giam_gia,
      is_featured,
    } = req.body;

    const hinhanh = req.file ? req.file.filename : null;

    if (!ten_sp || !gia || !ma_ncc || !ma_dvt || !ma_danhmuc) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc (Tên, Giá, NCC, DVT, Danh mục)" });
    }

    let finalMinGia = Number(gia); // Giá ban đầu từ form

    // --- TÌM GIÁ THẤP NHẤT TỪ CHÈN ĐƠN VỊ ---
    let extraUnitsRaw = [];
    try {
      if (req.body.selectedUnits) {
        extraUnitsRaw = JSON.parse(req.body.selectedUnits);
        if (Array.isArray(extraUnitsRaw)) {
          extraUnitsRaw.forEach(u => {
            const unitPrice = Number(u.gia);
            if (unitPrice > 0 && unitPrice < finalMinGia) {
              finalMinGia = unitPrice;
            }
          });
        }
      }
    } catch (e) {
      console.error("❌ Lỗi parse selectedUnits khi tính min price:", e);
    }

    const ma_sp = "SP" + Date.now();

    const sql = `
      INSERT INTO sanpham
      (ma_sp, ten_sp, ten_danhmuc, ma_danhmuc, mota, gia, soluong_ton, ma_ncc, ma_dvt, hinhanh, thongtin_sanpham, phan_tram_giam_gia, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        ma_sp,
        ten_sp,
        ten_danhmuc || null,
        ma_danhmuc,
        mota || null,
        finalMinGia, // 🚀 Sử dụng giá thấp nhất tìm được
        soluong_ton || 0,
        ma_ncc,
        ma_dvt,
        hinhanh,
        thongtin_sanpham || null,
        phan_tram_giam_gia || 0,
        Number(is_featured) || 0,
      ],
      (err) => {
        if (err) {
          console.error("❌ INSERT Error:", err);
          return res.status(500).json({ error: err.message });
        }

        // --- XỬ LÝ ĐA ĐƠN VỊ TÍNH ---
        let unitsToInsert = [];

        // 1. Luôn thêm đơn vị cơ bản
        unitsToInsert.push([ma_sp, ma_dvt, gia]);

        // 2. Thêm các đơn vị bổ sung được chọn từ frontend (nếu có)
        try {
          if (req.body.selectedUnits) {
            const extraUnits = JSON.parse(req.body.selectedUnits);
            if (Array.isArray(extraUnits)) {
              extraUnits.forEach(u => {
                // Tránh trùng với đơn vị cơ bản đã thêm ở trên
                if (u.ma_dvt !== ma_dvt) {
                  unitsToInsert.push([ma_sp, u.ma_dvt, u.gia]);
                }
              });
            }
          }
        } catch (e) {
          console.error("❌ Lỗi parse selectedUnits:", e);
        }

        const dvspSql = "INSERT INTO donvisanpham (ma_sp, ma_dvt, gia) VALUES ?";
        db.query(dvspSql, [unitsToInsert], (errSync) => {
          if (errSync) {
            console.error("❌ Lỗi đồng bộ donvisanpham:", errSync.message);
            // Vẫn trả về thành công vì sản phẩm chính đã tạo xong
            return res.json({
              message: "✅ Thêm sản phẩm thành công nhưng gặp lỗi khi lưu đơn vị tính bổ sung",
              ma_sp,
              syncError: errSync.message
            });
          }
          res.json({ message: "✅ Thêm sản phẩm và đơn vị tính thành công", ma_sp });
        });
      }
    );
  } catch (crash) {
    console.error("🔥 POST CRITICAL CRASH:", crash);
    res.status(500).json({ error: "Lỗi hệ thống nghiêm trọng" });
  }
});

/* ===========================
   PUT: cập nhật sản phẩm (ĐỔI / GIỮ ẢNH)
=========================== */
router.put("/:id", upload.single("hinhanh"), (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔥 HIT PUT PRODUCT:", id);

    db.query(
      "SELECT hinhanh FROM sanpham WHERE ma_sp = ?",
      [id],
      (err, rows) => {
        if (err) {
          console.error("❌ Link Query Error:", err);
          return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
          console.error("❌ Product Not Found:", id);
          return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        console.log("✅ Found old product data");
        const oldImage = rows[0].hinhanh;
        const newImage = req.file ? req.file.filename : oldImage;

        // xoá ảnh cũ nếu upload ảnh mới
        if (req.file && oldImage) {
          const oldImagePath = path.join(uploadDir, oldImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error("❌ Failed to delete old image:", err);
            });
          }
        }

        const {
          ten_sp,
          ten_danhmuc,
          ma_danhmuc,
          mota,
          gia,
          soluong_ton,
          ma_ncc,
          ma_dvt,
          thongtin_sanpham,
          phan_tram_giam_gia,
          is_featured,
        } = req.body;

        console.log("📝 Updating product with values:", { ten_sp, gia, ma_ncc, ma_danhmuc });

        const sql = `
          UPDATE sanpham SET
            ten_sp = ?,
            ten_danhmuc = ?,
            ma_danhmuc = ?,
            mota = ?,
            gia = ?,
            soluong_ton = ?,
            ma_ncc = ?,
            ma_dvt = ?,
            hinhanh = ?,
            thongtin_sanpham = ?,
            phan_tram_giam_gia = ?,
            is_featured = ?
          WHERE ma_sp = ?
        `;

        db.query(
          sql,
          [
            ten_sp,
            ten_danhmuc || null,
            ma_danhmuc,
            mota || null,
            gia,
            soluong_ton || 0,
            ma_ncc,
            ma_dvt,
            newImage,
            thongtin_sanpham || null,
            phan_tram_giam_gia || 0,
            Number(is_featured) || 0,
            id,
          ],
          (updateErr) => {
            if (updateErr) {
              console.error("❌ Update Query Error:", updateErr);
              return res.status(500).json({ error: updateErr.message });
            }

            console.log("✅ Update query successful");

            // Đồng bộ với bảng donvisanpham cho đơn vị tính cơ bản
            const checkSql = "SELECT * FROM donvisanpham WHERE ma_sp = ? AND ma_dvt = ?";
            db.query(checkSql, [id, ma_dvt], (errCheck, results) => {
              if (errCheck) {
                console.error("❌ Sync Check Error:", errCheck.message);
                return res.json({ message: "✅ Cập nhật sản phẩm thành công (Lỗi đồng bộ)" });
              }

              if (results && results.length > 0) {
                db.query("UPDATE donvisanpham SET gia = ? WHERE ma_sp = ? AND ma_dvt = ?", [gia, id, ma_dvt], (syncUpdErr) => {
                  if (syncUpdErr) console.error("❌ Sync Update Error:", syncUpdErr);
                  res.json({ message: "✅ Cập nhật sản phẩm thành công" });
                });
              } else {
                db.query("INSERT INTO donvisanpham (ma_sp, ma_dvt, gia) VALUES (?, ?, ?)", [id, ma_dvt, gia], (syncInsErr) => {
                  if (syncInsErr) console.error("❌ Sync Insert Error:", syncInsErr);
                  res.json({ message: "✅ Cập nhật sản phẩm thành công" });
                });
              }
            });
          }
        );
      }
    );
  } catch (crash) {
    console.error("🔥 CRITICAL ROUTE CRASH:", crash);
    res.status(500).json({ error: "Lỗi hệ thống nghiêm trọng" });
  }
});

/* ===========================
   DELETE: xoá sản phẩm + ảnh
=========================== */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT hinhanh FROM sanpham WHERE ma_sp = ?",
    [id],
    (err, rows) => {
      if (rows[0]?.hinhanh) {
        fs.unlink(`src/uploads/${rows[0].hinhanh}`, () => { });
      }

      // Xoá đồng bộ trong bảng donvisanpham
      db.query("DELETE FROM donvisanpham WHERE ma_sp = ?", [id], (errSync) => {
        if (errSync) console.error("Lỗi xoá đồng bộ donvisanpham:", errSync.message);

        db.query("DELETE FROM sanpham WHERE ma_sp = ?", [id], () => {
          res.json({ message: "🗑️ Đã xoá" });
        });
      });
    }
  );
});

module.exports = router;
