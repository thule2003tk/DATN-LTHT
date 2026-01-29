const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===========================
   CẤU HÌNH MULTER
=========================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
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
      sp.loai_sp,
      sp.mota,
      sp.gia,
      sp.soluong_ton,
      sp.hinhanh,
      sp.ma_ncc,
      sp.ma_dvt,
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
  const {
    ten_sp,
    loai_sp,
    mota,
    gia,
    soluong_ton,
    ma_ncc,
    ma_dvt,
  } = req.body;

  const hinhanh = req.file ? req.file.filename : null;

  if (!ten_sp || !gia || !ma_ncc || !ma_dvt) {
    return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
  }

  const ma_sp = "SP" + Date.now();

  const sql = `
    INSERT INTO sanpham
    (ma_sp, ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, ma_dvt, hinhanh)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      ma_sp,
      ten_sp,
      loai_sp || null,
      mota || null,
      gia,
      soluong_ton || 0,
      ma_ncc,
      ma_dvt,
      hinhanh,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Thêm sản phẩm thành công", ma_sp });
    }
  );
});

/* ===========================
   PUT: cập nhật sản phẩm (ĐỔI / GIỮ ẢNH)
=========================== */
router.put("/:id", upload.single("hinhanh"), (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT hinhanh FROM sanpham WHERE ma_sp = ?",
    [id],
    (err, rows) => {
      if (err || rows.length === 0)
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

      const oldImage = rows[0].hinhanh;
      const newImage = req.file ? req.file.filename : oldImage;

      // xoá ảnh cũ nếu upload ảnh mới
      if (req.file && oldImage) {
        fs.unlink(`src/uploads/${oldImage}`, () => {});
      }

      const {
        ten_sp,
        loai_sp,
        mota,
        gia,
        soluong_ton,
        ma_ncc,
        ma_dvt,
      } = req.body;

      const sql = `
        UPDATE sanpham SET
          ten_sp = ?,
          loai_sp = ?,
          mota = ?,
          gia = ?,
          soluong_ton = ?,
          ma_ncc = ?,
          ma_dvt = ?,
          hinhanh = ?
        WHERE ma_sp = ?
      `;

      db.query(
        sql,
        [
          ten_sp,
          loai_sp || null,
          mota || null,
          gia,
          soluong_ton || 0,
          ma_ncc,
          ma_dvt,
          newImage,
          id,
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "✅ Cập nhật sản phẩm thành công" });
        }
      );
    }
  );
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
        fs.unlink(`src/uploads/${rows[0].hinhanh}`, () => {});
      }

      db.query("DELETE FROM sanpham WHERE ma_sp = ?", [id], () => {
        res.json({ message: "🗑️ Đã xoá" });
      });
    }
  );
});

module.exports = router;
