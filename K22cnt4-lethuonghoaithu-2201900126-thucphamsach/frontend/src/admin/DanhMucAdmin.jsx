import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Modal, Form, InputGroup } from "react-bootstrap";
import { getDanhMuc, addDanhMuc, updateDanhMuc, deleteDanhMuc } from "../api/adminDanhMuc";
import { useAuth } from "../context/AuthContext";

import { getCategoryIcon, ICON_SUGGESTIONS } from "../utils/iconHelper";


function DanhMucAdmin() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredCategories = categories.filter(c =>
        c.ten_danhmuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ma_danhmuc.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <h2 className="text-success mb-0">Quản lý danh mục</h2>

                <div className="d-flex gap-3 align-items-center">
                    <InputGroup style={{ maxWidth: "250px" }}>
                        <InputGroup.Text className="bg-white border-end-0 text-success">
                            🔍
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm tên hoặc mã..."
                            className="border-start-0 shadow-none border-success-subtle"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    {user.vai_tro === "admin" && (
                        <Button variant="success" onClick={() => handleShowModal()}>
                            + Thêm danh mục
                        </Button>
                    )}
                </div>
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
                    {filteredCategories.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-5">
                                <div className="text-muted fs-5">🔍 Không tìm thấy danh mục nào phù hợp</div>
                            </td>
                        </tr>
                    ) : (
                        filteredCategories.map((c, index) => (
                            <tr key={c.ma_danhmuc}>
                                <td>{index + 1}</td>
                                <td>{c.ma_danhmuc}</td>
                                <td>{c.ten_danhmuc}</td>
                                <td style={{ fontSize: "1.2rem" }} className="text-success">
                                    {getCategoryIcon(c.icon, c.ten_danhmuc)}
                                </td>
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
                            <Form.Label className="fw-bold">Icon (Emoji hoặc Class name)</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white" style={{ fontSize: '1.2rem' }}>
                                    {getCategoryIcon(currentCategory.icon, currentCategory.ten_danhmuc)}
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Ví dụ: 🥦 hoặc fa-leaf"
                                    value={currentCategory.icon}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                                />
                            </InputGroup>

                            {/* ICON PICKER QUICK SELECT */}
                            <div className="mt-3 p-3 bg-light rounded-3 border">
                                <small className="text-muted mb-2 d-block fw-bold">Gợi ý Icon nhanh:</small>
                                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                    {ICON_SUGGESTIONS.map((group) => (
                                        <div key={group.label} className="mb-2">
                                            <div className="text-dark x-small fw-bold opacity-75 mb-1" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                                {group.label}
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {group.icons.map((icon) => (
                                                    <Button
                                                        key={icon}
                                                        variant="white"
                                                        size="sm"
                                                        className={`border p-2 shadow-sm d-flex align-items-center justify-content-center ${currentCategory.icon === icon ? 'bg-success text-white' : 'bg-white'}`}
                                                        style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
                                                        onClick={() => setCurrentCategory({ ...currentCategory, icon: icon })}
                                                        type="button"
                                                    >
                                                        {icon}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
