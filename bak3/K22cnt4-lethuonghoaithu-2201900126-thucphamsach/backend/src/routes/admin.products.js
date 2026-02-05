const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { syncProductMinPrice } = require("../controllers/donvisanphamController");

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
      ncc.ten_ncc,
      GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp
    LEFT JOIN donvitinh dvt ON sp.ma_dvt = dvt.ma_dvt
    LEFT JOIN nhacungcap ncc ON sp.ma_ncc = ncc.ma_ncc
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    GROUP BY sp.ma_sp
    ORDER BY sp.ma_sp DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Chuyển chuỗi mã danh mục thành mảng
    const data = rows.map(r => ({
      ...r,
      danhmuc_ids: r.danhmuc_ids ? r.danhmuc_ids.split(',') : (r.ma_danhmuc ? [r.ma_danhmuc] : [])
    }));
    res.json(data);
  });
});

/* ===========================
   GET: chi tiết 1 sản phẩm
=========================== */
router.get("/:id", (req, res) => {
  const sql = `
    SELECT sp.*, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    WHERE sp.ma_sp = ?
    GROUP BY sp.ma_sp
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    const product = {
      ...rows[0],
      danhmuc_ids: rows[0].danhmuc_ids ? rows[0].danhmuc_ids.split(",") : []
    };
    res.json(product);
  });
});

/* ===========================
   POST: thêm sản phẩm (CÓ UPLOAD ẢNH)
 =========================== */
router.post("/", upload.fields([
  { name: 'hinhanh', maxCount: 1 },
  { name: 'giay_chung_nhan', maxCount: 1 }
]), (req, res) => {
  try {
    // Defensive check
    const getSingle = (val) => Array.isArray(val) ? val[0] : val;

    const ten_sp = getSingle(req.body.ten_sp);
    const ten_danhmuc = getSingle(req.body.ten_danhmuc);
    const ma_danhmuc = getSingle(req.body.ma_danhmuc);
    const mota = getSingle(req.body.mota);
    const gia = getSingle(req.body.gia);
    const soluong_ton = getSingle(req.body.soluong_ton);
    const ma_ncc = getSingle(req.body.ma_ncc);
    const ma_dvt = getSingle(req.body.ma_dvt);
    const thongtin_sanpham = getSingle(req.body.thongtin_sanpham);
    const phan_tram_giam_gia = getSingle(req.body.phan_tram_giam_gia);
    const is_featured = getSingle(req.body.is_featured);

    const hinhanh = req.files['hinhanh'] ? req.files['hinhanh'][0].filename : null;
    const giay_chung_nhan = req.files['giay_chung_nhan'] ? req.files['giay_chung_nhan'][0].filename : null;

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
      (ma_sp, ten_sp, ten_danhmuc, ma_danhmuc, mota, gia, soluong_ton, ma_ncc, ma_dvt, hinhanh, giay_chung_nhan, thongtin_sanpham, phan_tram_giam_gia, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        giay_chung_nhan,
        thongtin_sanpham || null,
        phan_tram_giam_gia || 0,
        Number(is_featured) || 0,
      ],
      (err) => {
        if (err) {
          console.error("❌ INSERT Error:", err);
          return res.status(500).json({ error: err.message });
        }

        // --- XỬ LÝ NHIỀU DANH MỤC ---
        let categoryList = [];
        try {
          if (req.body.ma_danhmuc_list) {
            categoryList = JSON.parse(req.body.ma_danhmuc_list);
          } else {
            categoryList = [ma_danhmuc]; // Mặc định là danh mục chính
          }

          if (Array.isArray(categoryList) && categoryList.length > 0) {
            const catSql = "INSERT IGNORE INTO sanpham_danhmuc (ma_sp, ma_danhmuc) VALUES ?";
            const catValues = categoryList.map(cid => [ma_sp, cid]);
            db.query(catSql, [catValues], (errCat) => {
              if (errCat) console.error("❌ Lỗi lưu danh mục phụ:", errCat.message);
            });
          }
        } catch (e) {
          console.error("❌ Lỗi parse ma_danhmuc_list:", e);
        }

        // --- XỬ LÝ ĐA ĐƠN VỊ TÍNH ---
        let unitsToInsert = [];
        unitsToInsert.push([ma_sp, ma_dvt, gia]);

        try {
          if (req.body.selectedUnits) {
            const extraUnits = JSON.parse(req.body.selectedUnits);
            if (Array.isArray(extraUnits)) {
              extraUnits.forEach(u => {
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
router.put("/:id", upload.fields([
  { name: 'hinhanh', maxCount: 1 },
  { name: 'giay_chung_nhan', maxCount: 1 }
]), (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔥 HIT PUT PRODUCT:", id);

    db.query(
      "SELECT hinhanh, giay_chung_nhan FROM sanpham WHERE ma_sp = ?",
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
        const oldCert = rows[0].giay_chung_nhan;

        const newImage = req.files['hinhanh'] ? req.files['hinhanh'][0].filename : oldImage;
        const newCert = req.files['giay_chung_nhan'] ? req.files['giay_chung_nhan'][0].filename : oldCert;

        // xoá ảnh cũ nếu upload ảnh mới
        if (req.files['hinhanh'] && oldImage) {
          const oldImagePath = path.join(uploadDir, oldImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error("❌ Failed to delete old image:", err);
            });
          }
        }

        // xoá chứng nhận cũ nếu upload mới
        if (req.files['giay_chung_nhan'] && oldCert) {
          const oldCertPath = path.join(uploadDir, oldCert);
          if (fs.existsSync(oldCertPath)) {
            fs.unlink(oldCertPath, (err) => {
              if (err) console.error("❌ Failed to delete old certificate:", err);
            });
          }
        }

        // Defensive check: if Multer/Body-parser received multiple values, they come as an array.
        // We pick the last/first one to avoid SQL crashes.
        const getSingle = (val) => Array.isArray(val) ? val[0] : val;

        const ten_sp = getSingle(req.body.ten_sp);
        const ten_danhmuc = getSingle(req.body.ten_danhmuc);
        const ma_danhmuc = getSingle(req.body.ma_danhmuc);
        const mota = getSingle(req.body.mota);
        const gia = getSingle(req.body.gia);
        const soluong_ton = getSingle(req.body.soluong_ton);
        const ma_ncc = getSingle(req.body.ma_ncc);
        const ma_dvt = getSingle(req.body.ma_dvt);
        const thongtin_sanpham = getSingle(req.body.thongtin_sanpham);
        const phan_tram_giam_gia = getSingle(req.body.phan_tram_giam_gia);
        const is_featured = getSingle(req.body.is_featured);

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
            giay_chung_nhan = ?,
            thongtin_sanpham = ?,
            phan_tram_giam_gia = ?,
            is_featured = ?
          WHERE ma_sp = ?
        `;

        // Đảm bảo ma_danhmuc luôn có giá trị hợp lệ
        let finalMaDanhmuc = ma_danhmuc;
        if (!finalMaDanhmuc && req.body.ma_danhmuc_list) {
          try {
            const list = JSON.parse(req.body.ma_danhmuc_list);
            if (Array.isArray(list) && list.length > 0) {
              finalMaDanhmuc = list[0];
            }
          } catch (e) { }
        }

        // Chống lỗi NOT NULL/Foreign Key rỗng
        if (finalMaDanhmuc === "" || !finalMaDanhmuc) {
          finalMaDanhmuc = "DM001"; // Fallback an toàn (giả định DM001 tồn tại)
        }

        console.log("🚀 Executing SQL UPDATE with values:", [ten_sp, finalMaDanhmuc, gia, id]);

        db.query(
          sql,
          [
            ten_sp,
            ten_danhmuc || null,
            finalMaDanhmuc,
            mota || null,
            gia || 0,
            soluong_ton || 0,
            ma_ncc,
            ma_dvt,
            newImage,
            newCert,
            thongtin_sanpham || null,
            phan_tram_giam_gia || 0,
            Number(is_featured) || 0,
            id,
          ],
          (updateErr) => {
            if (updateErr) {
              console.error("❌ Update Query Error:", updateErr);
              return res.status(500).json({
                error: "Lỗi cập nhật sản phẩm trong database",
                details: updateErr.message,
                sql: updateErr.sql
              });
            }

            // --- XỬ LÝ NHIỀU DANH MỤC ---
            if (req.body.ma_danhmuc_list) {
              try {
                const categoryList = JSON.parse(req.body.ma_danhmuc_list);
                if (Array.isArray(categoryList)) {
                  // Xóa cũ thêm mới (Chạy độc lập, không chặn phản hồi chính)
                  db.query("DELETE FROM sanpham_danhmuc WHERE ma_sp = ?", [id], (errDel) => {
                    if (!errDel && categoryList.length > 0) {
                      const catSql = "INSERT IGNORE INTO sanpham_danhmuc (ma_sp, ma_danhmuc) VALUES ?";
                      const catValues = categoryList.map(cid => [id, cid]);
                      db.query(catSql, [catValues], (errCat) => {
                        if (errCat) console.error("❌ Lỗi update danh mục phụ:", errCat.message);
                      });
                    }
                  });
                }
              } catch (e) {
                console.error("❌ Lỗi parse ma_danhmuc_list:", e);
              }
            }

            console.log("✅ Update query successful");

            // Đồng bộ với bảng donvisanpham cho tất cả các đơn vị đã chọn
            if (req.body.selectedUnits) {
              try {
                const selectedUnits = JSON.parse(req.body.selectedUnits) || [];
                const unitsToInsert = [];
                // Thêm đơn vị chính trước
                unitsToInsert.push([id, ma_dvt, gia]);

                // Thêm các đơn vị phụ
                if (Array.isArray(selectedUnits)) {
                  selectedUnits.forEach(u => {
                    if (u.ma_dvt !== ma_dvt) {
                      unitsToInsert.push([id, u.ma_dvt, u.gia]);
                    }
                  });
                }

                // Xóa cũ và thêm mới
                db.query("DELETE FROM donvisanpham WHERE ma_sp = ?", [id], (errDel) => {
                  if (errDel) console.error("❌ Lỗi xoá donvisanpham cũ:", errDel.message);

                  const dvspSql = "INSERT INTO donvisanpham (ma_sp, ma_dvt, gia) VALUES ?";
                  db.query(dvspSql, [unitsToInsert], (syncErr) => {
                    if (syncErr) console.error("❌ Lỗi đồng bộ unitsToInsert:", syncErr.message);
                    // Tính lại min price sau khi đồng bộ
                    syncProductMinPrice(id);
                  });
                });
              } catch (e) {
                console.error("❌ Lỗi parse selectedUnits:", e);
              }
            } else {
              // Fallback nếu không gửi selectedUnits (chỉ giữ đơn vị chính)
              db.query("DELETE FROM donvisanpham WHERE ma_sp = ?", [id], () => {
                db.query("INSERT INTO donvisanpham (ma_sp, ma_dvt, gia) VALUES (?, ?, ?)", [id, ma_dvt, gia], () => {
                  syncProductMinPrice(id);
                });
              });
            }

            res.json({ message: "✅ Cập nhật sản phẩm thành công" });
          }
        );
      }
    );
  } catch (crash) {
    console.error("🔥 CRITICAL ROUTE CRASH:", crash);
    res.status(500).json({
      error: "Lỗi hệ thống nghiêm trọng",
      details: crash.message,
      stack: crash.stack
    });
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
