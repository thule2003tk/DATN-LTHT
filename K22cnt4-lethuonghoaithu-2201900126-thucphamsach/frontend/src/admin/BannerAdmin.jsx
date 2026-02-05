import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";

const BannerAdmin = () => {
    const [banners, setBanners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "main",
        button_text: "Xem ngay",
        button_color: "success",
        link_path: "/products",
        thutu: 0,
        trangthai: 1,
        hinhanh: null,
    });

    const fetchBanners = async () => {
        try {
            const res = await axiosClient.get("/admin/banners");
            setBanners(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách banner:", err);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleShow = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                ...banner,
                hinhanh: null, // Không reset ảnh cũ nếu không chọn file mới
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: "",
                description: "",
                type: "main",
                button_text: "Xem ngay",
                button_color: "success",
                link_path: "/products",
                thutu: 0,
                trangthai: 1,
                hinhanh: null,
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "hinhanh") {
                if (formData[key]) data.append("hinhanh", formData[key]);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            if (editingBanner) {
                await axiosClient.put(`/admin/banners/${editingBanner.ma_banner}`, data);
            } else {
                await axiosClient.post("/admin/banners", data);
            }
            setShowModal(false);
            fetchBanners();
        } catch (err) {
            alert("Lỗi khi lưu banner: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
            try {
                await axiosClient.delete(`/admin/banners/${id}`);
                fetchBanners();
            } catch (err) {
                alert("Lỗi khi xóa banner");
            }
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-success">🎨 Quản lý Banner & Quảng cáo</h3>
                <Button variant="success" onClick={() => handleShow()}>
                    <FaPlus className="me-2" /> Thêm Banner mới
                </Button>
            </div>

            <Table striped bordered hover responsive className="shadow-sm bg-white">
                <thead className="bg-success text-white">
                    <tr>
                        <th>Thứ tự</th>
                        <th>Hình ảnh</th>
                        <th>Tiêu đề / Loại</th>
                        <th>Nút / Link</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.map((b) => (
                        <tr key={b.ma_banner} className="align-middle">
                            <td>{b.thutu}</td>
                            <td style={{ width: "150px" }}>
                                <img
                                    src={b.hinhanh?.startsWith("banner_") ? `http://localhost:3001/uploads/${b.hinhanh}` : `/images/${b.hinhanh}`}
                                    alt={b.title}
                                    className="img-fluid rounded shadow-sm"
                                    style={{ maxHeight: "60px" }}
                                />
                            </td>
                            <td>
                                <div className="fw-bold">{b.title || "(Không có)"}</div>
                                <Badge bg={b.type === "main" ? "primary" : "info"} className="mt-1">
                                    {b.type === "main" ? "Banner chính" : "Banner giữa trang"}
                                </Badge>
                            </td>
                            <td>
                                <Badge bg={b.button_color} className="me-1">{b.button_text}</Badge>
                                <div className="small text-muted">{b.link_path}</div>
                            </td>
                            <td>
                                <Badge bg={b.trangthai ? "success" : "secondary"}>
                                    {b.trangthai ? "Hiện" : "Ẩn"}
                                </Badge>
                            </td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(b)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(b.ma_banner)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner mới"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Tiêu đề</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="VD: Rau củ tươi sạch mỗi ngày"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Loại Banner</Form.Label>
                                    <Form.Select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="main">Banner chính (Trượt phía trên)</option>
                                        <option value="middle">Banner giữa trang (Khuyến mãi/Câu chuyện)</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-12 mb-3">
                                <Form.Group>
                                    <Form.Label>Mô tả ngắn</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4 mb-3">
                                <Form.Group>
                                    <Form.Label>Văn bản nút</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.button_text}
                                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4 mb-3">
                                <Form.Group>
                                    <Form.Label>Màu sắc nút</Form.Label>
                                    <Form.Select
                                        value={formData.button_color}
                                        onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                                    >
                                        <option value="success">Xanh lá</option>
                                        <option value="danger">Đỏ</option>
                                        <option value="warning">Vàng</option>
                                        <option value="primary">Xanh dương</option>
                                        <option value="dark">Đen</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-4 mb-3">
                                <Form.Group>
                                    <Form.Label>Đường dẫn link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.link_path}
                                        onChange={(e) => setFormData({ ...formData, link_path: e.target.value })}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Hình ảnh {editingBanner && "(Để trống nếu không muốn đổi)"}</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setFormData({ ...formData, hinhanh: e.target.files[0] })}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3 mb-3">
                                <Form.Group>
                                    <Form.Label>Thứ tự hiển thị</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.thutu}
                                        onChange={(e) => setFormData({ ...formData, thutu: e.target.value })}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3 mb-3">
                                <Form.Group>
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Select
                                        value={formData.trangthai}
                                        onChange={(e) => setFormData({ ...formData, trangthai: e.target.value })}
                                    >
                                        <option value={1}>Hiển thị</option>
                                        <option value={0}>Ẩn</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button variant="success" type="submit">Lưu Banner</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default BannerAdmin;
