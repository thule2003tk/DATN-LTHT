import { useEffect, useState } from "react";
import { Modal, Button, Table, Form, Spinner, Alert } from "react-bootstrap";
import { getDonViSanPhamByMaSP, addDonViSanPham, updateDonViSanPham, deleteDonViSanPham } from "../api/adminDonViSanPham";
import { getDonViTinh } from "../api/adminDonViTinh";

function ProductUnitsModal({ ma_sp, ten_sp, show, onHide }) {
    const [units, setUnits] = useState([]); // Units already assigned to this product
    const [allDVT, setAllDVT] = useState([]); // All available unit types (donvitinh)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ma_donvisp: "", ma_dvt: "", gia: "" });

    const fetchData = async () => {
        if (!ma_sp) return;
        setLoading(true);
        try {
            const [dvspData, dvtData] = await Promise.all([
                getDonViSanPhamByMaSP(ma_sp),
                getDonViTinh()
            ]);
            setUnits(dvspData);
            setAllDVT(dvtData);
            setError("");
        } catch (err) {
            setError("Không thể tải dữ liệu đơn vị");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchData();
            setEditMode(false);
            setFormData({ ma_donvisp: "", ma_dvt: "", gia: "" });
        }
    }, [show, ma_sp]);

    const handleEdit = (unit) => {
        setFormData({
            ma_donvisp: unit.ma_donvisp,
            ma_dvt: unit.ma_dvt,
            gia: unit.gia
        });
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá đơn vị này?")) return;
        try {
            await deleteDonViSanPham(id);
            setUnits(units.filter(u => u.ma_donvisp !== id));
        } catch (err) {
            alert("Xoá thất bại");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateDonViSanPham(formData.ma_donvisp, { ...formData, ma_sp });
                alert("Cập nhật thành công!");
            } else {
                await addDonViSanPham({ ...formData, ma_sp });
                alert("Thêm thành công!");
            }
            setEditMode(false);
            setFormData({ ma_donvisp: "", ma_dvt: "", gia: "" });
            fetchData();
        } catch (err) {
            alert("Thao tác thất bại: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Quản lý đơn vị: {ten_sp}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center"><Spinner animation="border" /></div>
                ) : (
                    <>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Đơn vị tính</th>
                                    <th>Giá</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center">Chưa có đơn vị tính nào</td></tr>
                                ) : (
                                    units.map(u => (
                                        <tr key={u.ma_donvisp}>
                                            <td>{u.ten_dvt}</td>
                                            <td>{Number(u.gia).toLocaleString()} đ</td>
                                            <td>
                                                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(u)}>Sửa</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(u.ma_donvisp)}>Xoá</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>

                        <hr />
                        <h5>{editMode ? "Sửa đơn vị tính" : "Thêm đơn vị tính mới"}</h5>
                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <Form.Group className="col-md-5 mb-3">
                                    <Form.Label>Đơn vị tính</Form.Label>
                                    <Form.Select
                                        value={formData.ma_dvt}
                                        onChange={(e) => setFormData({ ...formData, ma_dvt: e.target.value })}
                                        required
                                        disabled={editMode}
                                    >
                                        <option value="">-- Chọn đơn vị --</option>
                                        {allDVT.map(dvt => (
                                            <option key={dvt.ma_dvt} value={dvt.ma_dvt}>{dvt.ten_dvt}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="col-md-4 mb-3">
                                    <Form.Label>Giá</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.gia}
                                        onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                                        required
                                        placeholder="Nhập giá"
                                    />
                                </Form.Group>
                                <div className="col-md-3 d-flex align-items-end mb-3">
                                    <Button variant={editMode ? "primary" : "success"} type="submit" className="w-100">
                                        {editMode ? "Lưu" : "Thêm"}
                                    </Button>
                                    {editMode && (
                                        <Button variant="secondary" className="ms-2" onClick={() => {
                                            setEditMode(false);
                                            setFormData({ ma_donvisp: "", ma_dvt: "", gia: "" });
                                        }}>Hủy</Button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductUnitsModal;
