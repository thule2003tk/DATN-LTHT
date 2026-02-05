const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/adminSupplierController");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

router.get("/", verifyToken, checkAdmin, supplierController.getAllSuppliers);
router.post("/", verifyToken, checkAdmin, supplierController.createSupplier);
router.put("/:ma_ncc", verifyToken, checkAdmin, supplierController.updateSupplier);
router.delete("/:ma_ncc", verifyToken, checkAdmin, supplierController.deleteSupplier);

module.exports = router;
