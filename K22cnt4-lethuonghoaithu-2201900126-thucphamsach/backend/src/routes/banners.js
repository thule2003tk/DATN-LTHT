const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ACTIVE BANNERS FOR HOME
router.get("/", (req, res) => {
    db.query("SELECT * FROM banners WHERE trangthai = 1 ORDER BY thutu ASC, ma_banner DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
