import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal, Badge } from "react-bootstrap";
import axiosClient from "../api/axiosClient";

function AdminBanners() {
    const [banners, setBanners] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        button_text: "Mua ngay",
        button_color: "success",
        link_path: "/products",
        thutu: 0,
        trangthai: 1,
        hinhanh: null,
    });

    const fetchBanners = async () => {
        try {
            const res = await axiosClient.get("/admin/banners");
            setBanners(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi lấy banner:", err);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleOpen = (b = null) => {
        if (b) {
            setEditId(b.ma_banner);
            setFormData({
                title: b.title || "",
                description: b.description || "",
                button_text: b.button_text || "Mua ngay",
                button_color: b.button_color || "success",
                link_path: b.link_path || "/products",
                thutu: b.thutu || 0,
                trangthai: b.trangthai,
                hinhanh: null,
            });
        } else {
            setEditId(null);
            setFormData({
                title: "",
                description: "",
                button_text: "Mua ngay",
                button_color: "success",
                link_path: "/products",
                thutu: 0,
                trangthai: 1,
                hinhanh: null,
            });
        }
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "hinhanh") {
                if (formData[key]) data.append(key, formData[key]);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            if (editId) {
                await axiosClient.put(`/admin/banners/${editId}`, data);
            } else {
                await axiosClient.post("/admin/banners", data);
            }
            setShow(false);
            fetchBanners();
        } catch (err) {
            alert("Lỗi khi lưu: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa banner này?")) {
            try {
                await axiosClient.delete(`/admin/banners/${id}`);
                fetchBanners();
            } catch (err) {
                alert("Lỗi khi xóa");
            }
        }
    };

    const imageSrc = (img) => img ? `http://localhost:3001/uploads/${img}` : "https://via.placeholder.com/200x100";

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success fw-bold">🖼️ Quản lý Banner Trang chủ</h2>
                <Button variant="success" onClick={() => handleOpen()}>+ Thêm Banner Mới</Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Table responsive hover>
                        <thead className="table-light">
                            <tr>
                                <th>Ảnh</th>
                                <th>Tiêu đề & Nội dung</th>
                                <th>Nút bấm</th>
                                <th>Đường dẫn</th>
                                <th>Thứ tự</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((b) => (
                                <tr key={b.ma_banner}>
                                    <td>
                                        <img src={imageSrc(b.hinhanh)} width="120" className="rounded" alt="thumb" />
                                    </td>
                                    <td>
                                        <div className="fw-bold">{b.title}</div>
                                        <small className="text-muted">{b.description}</small>
                                    </td>
                                    <td>
                                        <Badge bg={b.button_color}>{b.button_text}</Badge>
                                    </td>
                                    <td><code>{b.link_path}</code></td>
                                    <td>{b.thutu}</td>
                                    <td>
                                        <Badge bg={b.trangthai ? "success" : "secondary"}>
                                            {b.trangthai ? "Đang hiện" : "Đang ẩn"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="link" className="text-primary p-1" onClick={() => handleOpen(b)}>Sửa</Button>
                                        <Button variant="link" className="text-danger p-1" onClick={() => handleDelete(b.ma_banner)}>Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ảnh Banner</Form.Label>
                                    <Form.Control type="file" onChange={e => setFormData({ ...formData, hinhanh: e.target.files[0] })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tiêu đề</Form.Label>
                                    <Form.Control value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Ví dụ: Rau Củ Hữu Cơ" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả ngắn</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Dòng chữ nhỏ dưới tiêu đề" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chữ trên nút</Form.Label>
                                    <Form.Control value={formData.button_text} onChange={e => setFormData({ ...formData, button_text: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Màu nút</Form.Label>
                                    <Form.Select value={formData.button_color} onChange={e => setFormData({ ...formData, button_color: e.target.value })}>
                                        <option value="success">Xanh lá (Dùng cho Rau/Thương hiệu)</option>
                                        <option value="danger">Đỏ (Dùng cho Thịt/Khuyến mãi)</option>
                                        <option value="warning">Vàng (Dùng cho Trái cây/Lưu ý)</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Đường dẫn khi nhấn (Link)</Form.Label>
                                    <Form.Select value={formData.link_path} onChange={e => setFormData({ ...formData, link_path: e.target.value })}>
                                        <option value="/products">Tất cả sản phẩm</option>
                                        <option value="/products?category=Rau củ">Danh mục Rau củ</option>
                                        <option value="/products?category=Thịt tươi">Danh mục Thịt tươi</option>
                                        <option value="/products?category=Hải sản">Danh mục Hải sản</option>
                                        <option value="/products?category=Hoa quả">Danh mục Hoa quả</option>
                                        <option value="/tin-tuc">Trang Tin tức / Blog</option>
                                    </Form.Select>
                                    <Form.Control className="mt-2" value={formData.link_path} onChange={e => setFormData({ ...formData, link_path: e.target.value })} placeholder="Hoặc tự nhập link tại đây" />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Thứ tự</Form.Label>
                                            <Form.Control type="number" value={formData.thutu} onChange={e => setFormData({ ...formData, thutu: e.target.value })} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Trạng thái</Form.Label>
                                            <Form.Select value={formData.trangthai} onChange={e => setFormData({ ...formData, trangthai: parseInt(e.target.value) })}>
                                                <option value={1}>Đang hiện</option>
                                                <option value={0}>Đang ẩn</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="text-end mt-3">
                            <Button variant="secondary" onClick={() => setShow(false)} className="me-2">Hủy</Button>
                            <Button variant="success" type="submit">Lưu Banner</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AdminBanners;
