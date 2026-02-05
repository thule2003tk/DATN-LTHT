import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { getDonViTinh, addDonViTinh, updateDonViTinh, deleteDonViTinh } from "../api/adminDonViTinh";
import { useAuth } from "../context/AuthContext";

function DonViTinhAdmin() {
    const { user } = useAuth();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUnit, setCurrentUnit] = useState({ ma_dvt: "", ten_dvt: "", mota: "", size: "", trangthai: 'active' });

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const data = await getDonViTinh();
            setUnits(data);
            setError("");
        } catch (err) {
            setError("Không thể tải danh sách đơn vị tính");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleShowModal = (unit = { ma_dvt: "", ten_dvt: "", mota: "", size: "", trangthai: 'active' }) => {
        setCurrentUnit(unit);
        setEditMode(!!unit.ma_dvt);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentUnit({ ma_dvt: "", ten_dvt: "", mota: "", size: "", trangthai: 'active' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateDonViTinh(currentUnit.ma_dvt, currentUnit);
                alert("Cập nhật thành công!");
            } else {
                await addDonViTinh(currentUnit);
                alert("Thêm thành công!");
            }
            handleCloseModal();
            fetchUnits();
        } catch (err) {
            alert("Thao tác thất bại: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá đơn vị tính này?")) return;
        try {
            await deleteDonViTinh(id);
            setUnits(units.filter((u) => u.ma_dvt !== id));
            alert("Đã xoá thành công!");
        } catch (err) {
            alert("Xoá thất bại");
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success">Quản lý đơn vị sản phẩm</h2>
                {user.vai_tro === "admin" && (
                    <Button variant="success" onClick={() => handleShowModal()}>
                        + Thêm đơn vị tính
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table bordered hover responsive className="bg-white shadow-sm">
                <thead className="table-success">
                    <tr>
                        <th>#</th>
                        <th>Mã DVT</th>
                        <th>Tên DVT</th>
                        <th>Mô tả</th>
                        <th>Size</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {units.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">Chưa có đơn vị tính nào</td>
                        </tr>
                    ) : (
                        units.map((u, index) => (
                            <tr key={u.ma_dvt}>
                                <td>{index + 1}</td>
                                <td>{u.ma_dvt}</td>
                                <td>{u.ten_dvt}</td>
                                <td>{u.mota || "N/A"}</td>
                                <td>{u.size || "N/A"}</td>
                                <td>
                                    <span className={`badge bg-${u.trangthai === 'active' ? "success" : "danger"}`}>
                                        {u.trangthai === 'active' ? "Hoạt động" : "Ngưng"}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleShowModal(u)}
                                    >
                                        Sửa
                                    </Button>
                                    {user.vai_tro === "admin" && (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(u.ma_dvt)}
                                        >
                                            Xoá
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Modal Add/Edit */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Sửa đơn vị tính" : "Thêm đơn vị tính mới"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên đơn vị tính</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: Kg, Gam, Thùng..."
                                value={currentUnit.ten_dvt}
                                onChange={(e) => setCurrentUnit({ ...currentUnit, ten_dvt: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Mô tả chi tiết"
                                value={currentUnit.mota}
                                onChange={(e) => setCurrentUnit({ ...currentUnit, mota: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Size</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: L, XL, 500g..."
                                value={currentUnit.size}
                                onChange={(e) => setCurrentUnit({ ...currentUnit, size: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                value={currentUnit.trangthai}
                                onChange={(e) => setCurrentUnit({ ...currentUnit, trangthai: parseInt(e.target.value) })}
                            >
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Ngưng hoạt động</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Huỷ
                        </Button>
                        <Button variant="success" type="submit">
                            {editMode ? "Lưu thay đổi" : "Thêm mới"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default DonViTinhAdmin;
