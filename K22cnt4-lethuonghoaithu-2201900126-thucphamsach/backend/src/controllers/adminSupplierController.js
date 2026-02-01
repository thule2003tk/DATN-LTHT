const db = require("../config/db");

// Lấy danh sách tất cả nhà cung cấp
exports.getAllSuppliers = (req, res) => {
    const sql = "SELECT * FROM nhacungcap ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Thêm nhà cung cấp mới
exports.createSupplier = (req, res) => {
    try {
        const { ma_ncc, ten_ncc, diachi, sodienthoai, email } = req.body;
        const sql = "INSERT INTO nhacungcap (ma_ncc, ten_ncc, diachi, sodienthoai, email) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [ma_ncc, ten_ncc, diachi, sodienthoai, email], (err) => {
            if (err) {
                console.error("Database Error:", err);
                let msg = err.message;
                let status = 500;

                if (err.code === 'ER_DUP_ENTRY') {
                    msg = `Mã nhà cung cấp "${ma_ncc}" đã tồn tại! Vui lòng dùng mã khác.`;
                    status = 400;
                }

                return res.status(status).json({
                    error: "Lỗi Database",
                    message: msg,
                    code: err.code
                });
            }
            res.json({ message: "Thêm nhà cung cấp thành công" });
        });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: "Lỗi hệ thống", message: error.message });
    }
};

// Cập nhật nhà cung cấp
exports.updateSupplier = (req, res) => {
    try {
        const { ma_ncc } = req.params;
        const { ten_ncc, diachi, sodienthoai, email } = req.body;
        const sql = "UPDATE nhacungcap SET ten_ncc=?, diachi=?, sodienthoai=?, email=? WHERE ma_ncc=?";
        db.query(sql, [ten_ncc, diachi, sodienthoai, email, ma_ncc], (err) => {
            if (err) {
                console.error("Database Error:", err);
                let msg = err.message;
                let status = 500;

                if (err.code === 'ER_DUP_ENTRY') {
                    msg = "Dữ liệu bị trùng lặp (Email hoặc Mã NCC)!";
                    status = 400;
                }

                return res.status(status).json({
                    error: "Lỗi Database",
                    message: msg,
                    code: err.code
                });
            }
            res.json({ message: "Cập nhật nhà cung cấp thành công" });
        });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: "Lỗi hệ thống", message: error.message });
    }
};

// Xóa nhà cung cấp
exports.deleteSupplier = (req, res) => {
    const { ma_ncc } = req.params;
    const sql = "DELETE FROM nhacungcap WHERE ma_ncc=?";
    db.query(sql, [ma_ncc], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Xóa nhà cung cấp thành công" });
    });
};
