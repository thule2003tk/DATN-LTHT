import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Spinner, Row, Col, InputGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaIndustry } from "react-icons/fa";
import adminSupplierApi from "../api/adminSuppliers";

function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ma_ncc: "",
    ten_ncc: "",
    diachi: "",
    sodienthoai: "",
    email: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await adminSupplierApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.ten_ncc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ma_ncc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.diachi || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({ ...supplier });
    } else {
      setEditingSupplier(null);
      setFormData({
        ma_ncc: "",
        ten_ncc: "",
        diachi: "",
        sodienthoai: "",
        email: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await adminSupplierApi.update(editingSupplier.ma_ncc, formData);
      } else {
        await adminSupplierApi.create(formData);
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra khi lưu nhà cung cấp.";
      alert(msg);
    }
  };

  const handleDelete = async (ma_ncc) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await adminSupplierApi.delete(ma_ncc);
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    alert(`Đã sao chép mã NCC: ${id}`);
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
        <h2 className="text-success fw-bold mb-0"><FaIndustry /> Quản lý Nhà cung cấp</h2>

        <div className="d-flex gap-3 align-items-center">
          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-success">
              🔍
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm tên, mã, địa chỉ..."
              className="border-start-0 shadow-none border-success-subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Button variant="success" onClick={() => handleOpenModal()}>
            <FaPlus /> Thêm NCC mới
          </Button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0 overflow-hidden">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-success text-white">
              <tr>
                <th className="py-3 px-4">Mã NCC</th>
                <th>Tên nhà cung cấp</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.ma_ncc}>
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="info" className="p-2">{s.ma_ncc}</Badge>
                      <Button variant="link" size="sm" className="p-0 text-muted" title="Copy ID" onClick={() => handleCopyId(s.ma_ncc)}>
                        <small>Copy</small>
                      </Button>
                    </div>
                  </td>
                  <td className="fw-bold">{s.ten_ncc}</td>
                  <td>{s.diachi}</td>
                  <td>{s.sodienthoai}</td>
                  <td>{s.email || "---"}</td>
                  <td className="text-center">
                    <Button variant="outline-primary" size="sm" className="me-2 rounded-2" onClick={() => handleOpenModal(s)}>
                      <FaEdit /> Sửa
                    </Button>
                    <Button variant="outline-danger" size="sm" className="rounded-2" onClick={() => handleDelete(s.ma_ncc)}>
                      <FaTrash /> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="text-muted fs-5">🔍 Không tìm thấy nhà cung cấp nào phù hợp</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-success fw-bold">
            {editingSupplier ? "Sửa thông tin NCC" : "Thêm nhà cung cấp mới"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="bg-light p-4 rounded-4">
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label className="small fw-bold">Mã nhà cung cấp</Form.Label>
                <Form.Control
                  required
                  disabled={!!editingSupplier}
                  placeholder="VD: NCC01"
                  value={formData.ma_ncc}
                  onChange={(e) => setFormData({ ...formData, ma_ncc: e.target.value.toUpperCase() })}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label className="small fw-bold">Tên nhà cung cấp</Form.Label>
                <Form.Control
                  required
                  placeholder="Nhập tên công ty/HTX"
                  value={formData.ten_ncc}
                  onChange={(e) => setFormData({ ...formData, ten_ncc: e.target.value })}
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Địa chỉ</Form.Label>
              <Form.Control
                placeholder="Số nhà, tên đường, tỉnh thành..."
                value={formData.diachi}
                onChange={(e) => setFormData({ ...formData, diachi: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label className="small fw-bold">Số điện thoại</Form.Label>
                <Form.Control
                  placeholder="Người liên hệ"
                  value={formData.sodienthoai}
                  onChange={(e) => setFormData({ ...formData, sodienthoai: e.target.value })}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label className="small fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" className="px-4" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" className="px-4 fw-bold" type="submit">Lưu lại</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminSuppliers;