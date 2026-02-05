const db = require("../config/db");

// ===============================
// LẤY TẤT CẢ ĐƠN VỊ SẢN PHẨM (JOIN TABLE)
// ===============================
exports.getAllDonViSanPham = (req, res) => {
    const sql = `
        SELECT dvsp.*, sp.ten_sp, dvt.ten_dvt
        FROM donvisanpham dvsp
        JOIN sanpham sp ON dvsp.ma_sp = sp.ma_sp
        JOIN donvitinh dvt ON dvsp.ma_dvt = dvt.ma_dvt
        ORDER BY dvsp.ma_donvisp DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server: " + err.message });
        }
        res.json(results);
    });
};

// ===============================
// LẤY ĐƠN VỊ SẢN PHẨM THEO MÃ
// ===============================
exports.getDonViSanPhamByMa = (req, res) => {
    const sql = "SELECT * FROM donvisanpham WHERE ma_donvisp = ?";
    db.query(sql, [req.params.ma_donvisp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy đơn vị sản phẩm" });
        }
        res.json(results[0]);
    });
};

// LẤY ĐƠN VỊ SẢN PHẨM THEO MÃ SẢN PHẨM
// ===============================
exports.getDonViSanPhamByMaSP = (req, res) => {
    const sql = `
        SELECT dvsp.gia, dvsp.ma_donvisp, dvsp.ma_dvt, dvsp.ma_sp, 
               dv.mota, dv.size, dv.trangthai, dv.ten_dvt 
        FROM donvisanpham dvsp 
        INNER JOIN donvitinh dv ON dv.ma_dvt = dvsp.ma_dvt 
        WHERE dvsp.ma_sp = ?
    `;
    db.query(sql, [req.params.ma_sp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server" });
        }
        res.json(results);
    });
};

// ===============================
// TẠO ĐƠN VỊ SẢN PHẨM
// ===============================
exports.createDonViSanPham = (req, res) => {
    const { ma_sp, ma_dvt, gia } = req.body;

    const sql = `
        INSERT INTO donvisanpham (ma_sp, ma_dvt, gia)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [ma_sp, ma_dvt, gia], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Không thể tạo đơn vị sản phẩm: " + err.message });
        }

        // --- SYNC MIN PRICE ---
        syncProductMinPrice(ma_sp);

        res.json({
            message: "Tạo đơn vị sản phẩm thành công",
            ma_donvisp: result.insertId,
        });
    });
};

// ===============================
// CẬP NHẬT ĐƠN VỊ SẢN PHẨM
// ===============================
exports.updateDonViSanPham = (req, res) => {
    const { ma_sp, ma_dvt, gia } = req.body;
    const sql = `
        UPDATE donvisanpham 
        SET ma_sp = ?, ma_dvt = ?, gia = ?
        WHERE ma_donvisp = ?
    `;

    db.query(sql, [ma_sp, ma_dvt, gia, req.params.ma_donvisp], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Không thể cập nhật đơn vị sản phẩm: " + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy đơn vị sản phẩm để cập nhật" });
        }

        // --- SYNC MIN PRICE ---
        syncProductMinPrice(ma_sp);

        res.json({ message: "Cập nhật đơn vị sản phẩm thành công" });
    });
};

// ===============================
// XÓA ĐƠN VỊ SẢN PHẨM
// ===============================
exports.deleteDonViSanPham = (req, res) => {
    // Lấy ma_sp trước khi xoá để sync
    db.query("SELECT ma_sp FROM donvisanpham WHERE ma_donvisp = ?", [req.params.ma_donvisp], (errS, rows) => {
        const ma_sp = rows?.[0]?.ma_sp;

        const sql = "DELETE FROM donvisanpham WHERE ma_donvisp = ?";
        db.query(sql, [req.params.ma_donvisp], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Không thể xóa đơn vị sản phẩm: " + err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy đơn vị sản phẩm để xóa" });
            }

            // --- SYNC MIN PRICE ---
            if (ma_sp) syncProductMinPrice(ma_sp);

            res.json({ message: "Xóa đơn vị sản phẩm thành công" });
        });
    });
};

// ===============================
// HELER: ĐỒNG BỘ GIÁ THẤP NHẤT
// ===============================
function syncProductMinPrice(ma_sp) {
    if (!ma_sp) return;

    // Tìm giá thấp nhất trong các đơn vị
    const sqlMin = "SELECT MIN(gia) as min_gia FROM donvisanpham WHERE ma_sp = ?";
    db.query(sqlMin, [ma_sp], (err, rows) => {
        if (err || rows.length === 0) return;

        const minGia = rows[0].min_gia;
        if (minGia !== null) {
            console.log(`🔄 Syncing product ${ma_sp} to min price: ${minGia}`);
            db.query("UPDATE sanpham SET gia = ? WHERE ma_sp = ?", [minGia, ma_sp]);
        }
    });
}

exports.syncProductMinPrice = syncProductMinPrice;

