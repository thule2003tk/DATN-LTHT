const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL
router.get("/", (req, res) => {
    db.query("SELECT * FROM tintuc ORDER BY ngay_dang DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET DETAIL
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM tintuc WHERE ma_tt = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows[0]);
    });
});

module.exports = router;
