const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "src/uploads/"),
    filename: (req, file, cb) => cb(null, "news_" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET ALL
router.get("/", (req, res) => {
    db.query("SELECT * FROM tintuc ORDER BY ngay_dang DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ADD
router.post("/", upload.single("hinh_anh"), (req, res) => {
    const { tieu_de, mo_ta, noi_dung, loai_tin } = req.body;
    const hinh_anh = req.file ? req.file.filename : req.body.hinh_anh_url;
    const sql = "INSERT INTO tintuc (tieu_de, mo_ta, noi_dung, hinh_anh, loai_tin) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [tieu_de, mo_ta, noi_dung, hinh_anh, loai_tin], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã thêm tin tức" });
    });
});

// UPDATE
router.put("/:id", upload.single("hinh_anh"), (req, res) => {
    const { id } = req.params;
    const { tieu_de, mo_ta, noi_dung, loai_tin } = req.body;
    const hinh_anh = req.file ? req.file.filename : req.body.hinh_anh_cu;
    const sql = "UPDATE tintuc SET tieu_de=?, mo_ta=?, noi_dung=?, hinh_anh=?, loai_tin=? WHERE ma_tt=?";
    db.query(sql, [tieu_de, mo_ta, noi_dung, hinh_anh, loai_tin, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã cập nhật" });
    });
});

// DELETE
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM tintuc WHERE ma_tt = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã xóa" });
    });
});

module.exports = router;
