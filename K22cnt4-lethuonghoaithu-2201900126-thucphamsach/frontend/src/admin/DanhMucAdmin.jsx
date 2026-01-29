import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { getDanhMuc, addDanhMuc, updateDanhMuc, deleteDanhMuc } from "../api/adminDanhMuc";
import { useAuth } from "../context/AuthContext";

function DanhMucAdmin() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ ma_danhmuc: "", ten_danhmuc: "", icon: "" });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getDanhMuc();
            setCategories(data);
            setError("");
        } catch (err) {
            setError("Không thể tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleShowModal = (category = { ma_danhmuc: "", ten_danhmuc: "", icon: "" }) => {
        setCurrentCategory(category);        
        setEditMode(!!category.ma_danhmuc);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCategory({ ma_danhmuc: "", ten_danhmuc: "", icon: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(currentCategory)
            if (editMode) {
                await updateDanhMuc(currentCategory.ma_danhmuc, currentCategory);
                alert("Cập nhật thành công!");
            } else {
                await addDanhMuc(currentCategory);
                alert("Thêm thành công!");
            }            
            handleCloseModal();
            fetchCategories();
        } catch (err) {
            alert("Thao tác thất bại: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá danh mục này?")) return;
        try {
            await deleteDanhMuc(id);
            setCategories(categories.filter((c) => c.ma_danhmuc !== id));
            alert("Đã xoá thành công!");
        } catch (err) {
            alert("Xoá thất bại");
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success">Quản lý danh mục</h2>
                {user.vai_tro === "admin" && (
                    <Button variant="success" onClick={() => handleShowModal()}>
                        + Thêm danh mục
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table bordered hover responsive className="bg-white shadow-sm">
                <thead className="table-success">
                    <tr>
                        <th>#</th>
                        <th>Mã danh mục</th>
                        <th>Tên danh mục</th>
                        <th>Icon</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">Chưa có danh mục nào</td>
                        </tr>
                    ) : (
                        categories.map((c, index) => (
                            <tr key={c.ma_danhmuc}>
                                <td>{index + 1}</td>
                                <td>{c.ma_danhmuc}</td>
                                <td>{c.ten_danhmuc}</td>
                                <td style={{ fontSize: "1.2rem" }}>{c.icon || "N/A"}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleShowModal(c)}
                                    >
                                        Sửa
                                    </Button>
                                    {user.vai_tro === "admin" && (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(c.ma_danhmuc)}
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
                    <Modal.Title>{editMode ? "Sửa danh mục" : "Thêm danh mục mới"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên danh mục"
                                value={currentCategory.ten_danhmuc}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, ten_danhmuc: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon (Emoji hoặc Class name)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: 🥦 hoặc fa-leaf"
                                value={currentCategory.icon}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                            />
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

export default DanhMucAdmin;
