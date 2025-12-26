const express = require("express");
const router = express.Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const lhController = require("../controllers/lienheController");

// User gửi liên hệ
router.post("/", lhController.createLienHe);

// Admin quản lý liên hệ
router.get("/", verifyToken, checkAdmin, lhController.getAllLienHe);
router.put("/:id", verifyToken, checkAdmin, lhController.replyLienHe);
router.delete("/:id", verifyToken, checkAdmin, lhController.deleteLienHe);

module.exports = router;
