import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Spinner, Row, Col, InputGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaTicketAlt } from "react-icons/fa";
import adminPromotionApi from "../api/adminPromotions";

function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ma_km: "",
    ten_km: "",
    mota: "",
    mucgiam: "",
    giatri_don: "",
    ngay_batdau: "",
    ngay_ketthuc: "",
    trangthai: "Đang áp dụng",
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const response = await adminPromotionApi.getAll();
      setPromos(response.data);
    } catch (error) {
      console.error("Error fetching promos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromos = promos.filter(p =>
    p.ten_km.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ma_km.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        ...promo,
        ngay_batdau: promo.ngay_batdau ? promo.ngay_batdau.split("T")[0] : "",
        ngay_ketthuc: promo.ngay_ketthuc ? promo.ngay_ketthuc.split("T")[0] : "",
      });
    } else {
      setEditingPromo(null);
      setFormData({
        ma_km: "",
        ten_km: "",
        mota: "",
        mucgiam: "",
        giatri_don: "",
        ngay_batdau: "",
        ngay_ketthuc: "",
        trangthai: "Đang áp dụng",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await adminPromotionApi.update(editingPromo.ma_km, formData);
      } else {
        await adminPromotionApi.create(formData);
      }
      setShowModal(false);
      fetchPromos();
    } catch (error) {
      console.error("Error saving promo:", error);
      alert("Có lỗi xảy ra khi lưu mã khuyến mãi.");
    }
  };

  const handleDelete = async (ma_km) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã này?")) {
      try {
        await adminPromotionApi.delete(ma_km);
        fetchPromos();
      } catch (error) {
        console.error("Error deleting promo:", error);
      }
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold mb-0"><FaTicketAlt /> Quản lý khuyến mãi</h2>

        <div className="d-flex gap-3 align-items-center">
          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-success">
              🔍
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm tên hoặc mã KM..."
              className="border-start-0 shadow-none border-success-subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Button variant="success" onClick={() => handleOpenModal()}>
            <FaPlus /> Thêm mã mới
          </Button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <Table responsive hover>
            <thead className="table-success">
              <tr>
                <th>Mã</th>
                <th>Tên chương trình</th>
                <th>Giảm (%)</th>
                <th>Đơn tối thiểu</th>
                <th>Thời hạn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromos.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-muted fs-5">🔍 Không tìm thấy mã khuyến mãi nào phù hợp</div>
                  </td>
                </tr>
              )}
              {filteredPromos.map((p) => (
                <tr key={p.ma_km}>
                  <td><Badge bg="info">{p.ma_km}</Badge></td>
                  <td>{p.ten_km}</td>
                  <td className="fw-bold text-danger">{p.mucgiam}%</td>
                  <td>{Number(p.giatri_don).toLocaleString()}₫</td>
                  <td>
                    <small>
                      {new Date(p.ngay_batdau).toLocaleDateString()} - {new Date(p.ngay_ketthuc).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <Badge bg={p.trangthai === "Đang áp dụng" ? "success" : "secondary"}>
                      {p.trangthai}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(p)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.ma_km)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-success">{editingPromo ? "Sửa mã khuyến mãi" : "Thêm mã khuyến mãi"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {!editingPromo && (
                <Col md={6} className="mb-3">
                  <Form.Label>Mã khuyến mãi (VD: GIAM10)</Form.Label>
                  <Form.Control
                    required
                    value={formData.ma_km}
                    onChange={(e) => setFormData({ ...formData, ma_km: e.target.value.toUpperCase() })}
                  />
                </Col>
              )}
              <Col md={editingPromo ? 12 : 6} className="mb-3">
                <Form.Label>Tên chương trình</Form.Label>
                <Form.Control
                  required
                  value={formData.ten_km}
                  onChange={(e) => setFormData({ ...formData, ten_km: e.target.value })}
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.mota}
                onChange={(e) => setFormData({ ...formData, mota: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Mức giảm (%)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={formData.mucgiam}
                  onChange={(e) => setFormData({ ...formData, mucgiam: e.target.value })}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Giá trị đơn tối thiểu (₫)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={formData.giatri_don}
                  onChange={(e) => setFormData({ ...formData, giatri_don: e.target.value })}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="date"
                  required
                  value={formData.ngay_batdau}
                  onChange={(e) => setFormData({ ...formData, ngay_batdau: e.target.value })}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control
                  type="date"
                  required
                  value={formData.ngay_ketthuc}
                  onChange={(e) => setFormData({ ...formData, ngay_ketthuc: e.target.value })}
                />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={formData.trangthai}
                onChange={(e) => setFormData({ ...formData, trangthai: e.target.value })}
              >
                <option value="Đang áp dụng">Đang áp dụng</option>
                <option value="Hết hạn">Hết hạn</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" type="submit">Lưu lại</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminPromotions;