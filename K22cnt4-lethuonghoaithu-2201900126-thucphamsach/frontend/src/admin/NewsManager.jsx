import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal, Badge, InputGroup } from "react-bootstrap";
import axiosClient from "../api/axiosClient";

function NewsManager() {
    const [newsList, setNewsList] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [formData, setFormData] = useState({
        tieu_de: "",
        mo_ta: "",
        noi_dung: "",
        loai_tin: "HTFood",
        hinh_anh: null,
        hinh_anh_url: ""
    });

    const fetchNews = async () => {
        try {
            const res = await axiosClient.get("/admin/tintuc");
            setNewsList(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const filteredNews = newsList.filter(n => {
        const matchSearch = n.tieu_de.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.mo_ta.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "" || n.loai_tin === filterType;
        return matchSearch && matchType;
    });

    const handleOpen = (n = null) => {
        if (n) {
            setEditId(n.ma_tt);
            setFormData({
                tieu_de: n.tieu_de,
                mo_ta: n.mo_ta,
                noi_dung: n.noi_dung,
                loai_tin: n.loai_tin,
                hinh_anh: null,
                hinh_anh_url: n.hinh_anh,
                hinh_anh_cu: n.hinh_anh
            });
        } else {
            setEditId(null);
            setFormData({
                tieu_de: "",
                mo_ta: "",
                noi_dung: "",
                loai_tin: "HTFood",
                hinh_anh: null,
                hinh_anh_url: ""
            });
        }
        setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === "hinh_anh") {
                if (formData[key]) data.append(key, formData[key]);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            if (editId) await axiosClient.put(`/admin/tintuc/${editId}`, data);
            else await axiosClient.post("/admin/tintuc", data);
            setShow(false);
            fetchNews();
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa tin này?")) {
            try {
                await axiosClient.delete(`/admin/tintuc/${id}`);
                fetchNews();
            } catch (err) {
                alert("Lỗi");
            }
        }
    };

    const img = (h) => h?.startsWith("http") ? h : `http://localhost:3001/uploads/${h}`;

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success fw-bold mb-0">📰 Quản lý Tin tức HTFood</h2>

                <div className="d-flex gap-3 align-items-center">
                    <InputGroup style={{ width: "250px" }}>
                        <InputGroup.Text className="bg-white border-end-0 text-success">🔍</InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm tiêu đề tin..."
                            className="border-start-0 shadow-none border-success-subtle"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select
                        style={{ width: "180px" }}
                        className="shadow-none border-success-subtle"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Tất cả phân loại</option>
                        <option value="HTFood">Tin HTFood</option>
                        <option value="Trong nước">Trong nước</option>
                        <option value="Thế giới">Thế giới</option>
                    </Form.Select>

                    <Button variant="success" onClick={() => handleOpen()}>+ Đăng tin mới</Button>
                </div>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Table responsive hover align="middle">
                        <thead className="table-light">
                            <tr>
                                <th>Ngày dang</th>
                                <th>Phân loại</th>
                                <th>Hình ảnh</th>
                                <th>Tiêu đề & Mô tả</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNews.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="text-muted fs-5">🔍 Không tìm thấy tin tức nào phù hợp</div>
                                    </td>
                                </tr>
                            )}
                            {filteredNews.map(n => (
                                <tr key={n.ma_tt}>
                                    <td>{new Date(n.ngay_dang).toLocaleDateString("vi-VN")}</td>
                                    <td>
                                        <Badge bg={n.loai_tin === "HTFood" ? "success" : n.loai_tin === "Trong nước" ? "info" : "dark"}>
                                            {n.loai_tin}
                                        </Badge>
                                    </td>
                                    <td><img src={img(n.hinh_anh)} width="100" className="rounded" alt="thumb" onError={(e) => { e.target.src = "https://placehold.co/600x400?text=HTFood+News"; }} /></td>
                                    <td style={{ maxWidth: '400px' }}>
                                        <div className="fw-bold">{n.tieu_de}</div>
                                        <small className="text-muted text-truncate d-block">{n.mo_ta}</small>
                                    </td>
                                    <td>
                                        <Button variant="link" className="text-primary" onClick={() => handleOpen(n)}>Sửa</Button>
                                        <Button variant="link" className="text-danger" onClick={() => handleDelete(n.ma_tt)}>Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={show} onHide={() => setShow(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? "Cập nhật Tin tức" : "Đăng Tin mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phân loại tin</Form.Label>
                                    <Form.Select value={formData.loai_tin} onChange={e => setFormData({ ...formData, loai_tin: e.target.value })}>
                                        <option value="HTFood">Tin tức HTFood</option>
                                        <option value="Trong nước">Tin thực phẩm Trong nước</option>
                                        <option value="Thế giới">Tin thực phẩm Thế giới</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hình ảnh (Upload hoặc URL)</Form.Label>
                                    <Form.Control type="file" onChange={e => setFormData({ ...formData, hinh_anh: e.target.files[0] })} className="mb-2" />
                                    <Form.Control type="text" placeholder="Hoặc dán link ảnh vào đây" value={formData.hinh_anh_url} onChange={e => setFormData({ ...formData, hinh_anh_url: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tiêu đề tin tức</Form.Label>
                                    <Form.Control value={formData.tieu_de} onChange={e => setFormData({ ...formData, tieu_de: e.target.value })} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả ngắn (Hiện ở danh sách)</Form.Label>
                                    <Form.Control as="textarea" rows={2} value={formData.mo_ta} onChange={e => setFormData({ ...formData, mo_ta: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nội dung chi tiết</Form.Label>
                                    <Form.Control as="textarea" rows={10} value={formData.noi_dung} onChange={e => setFormData({ ...formData, noi_dung: e.target.value })} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end">
                            <Button variant="secondary" onClick={() => setShow(false)} className="me-2">Hủy</Button>
                            <Button variant="success" type="submit">Đăng tin ngay</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default NewsManager;
