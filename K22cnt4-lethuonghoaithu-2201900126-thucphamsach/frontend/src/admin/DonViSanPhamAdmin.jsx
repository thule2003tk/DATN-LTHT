import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { getDonViSanPham, addDonViSanPham, updateDonViSanPham, deleteDonViSanPham } from "../api/adminDonViSanPham";
import { getProducts } from "../api/adminProducts";
import { getDonViTinh } from "../api/adminDonViTinh";
import { useAuth } from "../context/AuthContext";

function DonViSanPhamAdmin() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState({ ma_donvisp: "", ma_sp: "", ma_dvt: "", gia: "" });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [dvspData, productsData, unitsData] = await Promise.all([
                getDonViSanPham(),
                getProducts(),
                getDonViTinh()
            ]);
            setItems(dvspData);
            setProducts(productsData);
            setUnits(unitsData);
            setError("");
        } catch (err) {
            setError("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowModal = (item = { ma_donvisp: "", ma_sp: "", ma_dvt: "", gia: "" }) => {
        setCurrentItem(item);
        setEditMode(!!item.ma_donvisp);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentItem({ ma_donvisp: "", ma_sp: "", ma_dvt: "", gia: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateDonViSanPham(currentItem.ma_donvisp, currentItem);
                alert("Cập nhật thành công!");
            } else {
                await addDonViSanPham(currentItem);
                alert("Thêm thành công!");
            }
            handleCloseModal();
            fetchData();
        } catch (err) {
            alert("Thao tác thất bại: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá?")) return;
        try {
            await deleteDonViSanPham(id);
            setItems(items.filter((i) => i.ma_donvisp !== id));
            alert("Đã xoá thành công!");
        } catch (err) {
            alert("Xoá thất bại");
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success">Quản lý Giá theo Đơn vị</h2>
                {user.vai_tro === "admin" && (
                    <Button variant="success" onClick={() => handleShowModal()}>
                        + Thêm Giá theo Đơn vị
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table bordered hover responsive className="bg-white shadow-sm">
                <thead className="table-success">
                    <tr>
                        <th>#</th>
                        <th>Sản phẩm</th>
                        <th>Đơn vị tính</th>
                        <th>Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">Chưa có dữ liệu</td>
                        </tr>
                    ) : (
                        items.map((i, index) => (
                            <tr key={i.ma_donvisp}>
                                <td>{index + 1}</td>
                                <td>{i.ten_sp} ({i.ma_sp})</td>
                                <td>{i.ten_dvt} ({i.ma_dvt})</td>
                                <td>{Number(i.gia).toLocaleString()} đ</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleShowModal(i)}
                                    >
                                        Sửa
                                    </Button>
                                    {user.vai_tro === "admin" && (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(i.ma_donvisp)}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Sửa" : "Thêm mới"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Sản phẩm</Form.Label>
                            <Form.Select
                                value={currentItem.ma_sp}
                                onChange={(e) => setCurrentItem({ ...currentItem, ma_sp: e.target.value })}
                                required
                            >
                                <option value="">Chọn sản phẩm</option>
                                {products.map(p => (
                                    <option key={p.ma_sp} value={p.ma_sp}>{p.ten_sp}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Đơn vị tính</Form.Label>
                            <Form.Select
                                value={currentItem.ma_dvt}
                                onChange={(e) => setCurrentItem({ ...currentItem, ma_dvt: e.target.value })}
                                required
                            >
                                <option value="">Chọn đơn vị</option>
                                {units.map(u => (
                                    <option key={u.ma_dvt} value={u.ma_dvt}>{u.ten_dvt}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá"
                                value={currentItem.gia}
                                onChange={(e) => setCurrentItem({ ...currentItem, gia: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Huỷ</Button>
                        <Button variant="success" type="submit">{editMode ? "Lưu" : "Thêm"}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default DonViSanPhamAdmin;
