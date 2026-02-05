const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, "banner_" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// GET ALL BANNERS (Admin)
router.get("/", (req, res) => {
    db.query("SELECT * FROM banners ORDER BY thutu ASC, ma_banner DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ADD NEW BANNER
router.post("/", upload.single("hinhanh"), (req, res) => {
    const { title, description, button_text, button_color, link_path, thutu, trangthai, type } = req.body;
    const hinhanh = req.file ? req.file.filename : null;

    const sql = "INSERT INTO banners (title, description, hinhanh, type, button_text, button_color, link_path, thutu, trangthai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, description, hinhanh, type || 'main', button_text, button_color, link_path, thutu || 0, trangthai || 1], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Đã thêm banner mới" });
    });
});

// UPDATE BANNER
router.put("/:id", upload.single("hinhanh"), (req, res) => {
    const { id } = req.params;
    const { title, description, button_text, button_color, link_path, thutu, trangthai, type } = req.body;

    db.query("SELECT hinhanh FROM banners WHERE ma_banner = ?", [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ error: "Không tìm thấy" });

        const oldImage = rows[0].hinhanh;
        const newImage = req.file ? req.file.filename : oldImage;

        if (req.file && oldImage) {
            const oldPath = path.join(uploadDir, oldImage);
            if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => { });
        }

        const sql = "UPDATE banners SET title=?, description=?, hinhanh=?, type=?, button_text=?, button_color=?, link_path=?, thutu=?, trangthai=? WHERE ma_banner=?";
        db.query(sql, [title, description, newImage, type, button_text, button_color, link_path, thutu, trangthai, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "✅ Đã cập nhật banner" });
        });
    });
});

// DELETE BANNER
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT hinhanh FROM banners WHERE ma_banner = ?", [id], (err, rows) => {
        if (rows[0]?.hinhanh) {
            const imgPath = path.join(uploadDir, rows[0].hinhanh);
            if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => { });
        }
        db.query("DELETE FROM banners WHERE ma_banner = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "🗑️ Đã xóa banner" });
        });
    });
});

module.exports = router;
