import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form
} from "react-bootstrap";
import {
  getDonViSanPham,
  addDonViSanPham,
  updateDonViSanPham,
  deleteDonViSanPham
} from "../api/adminDonViSanPham";
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
  const [currentItem, setCurrentItem] = useState({
    ma_donvisp: "",
    ma_sp: "",
    ma_dvt: "",
    gia: ""
  });

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [dvsp, sp, dvt] = await Promise.all([
        getDonViSanPham(),
        getProducts(),
        getDonViTinh()
      ]);
      setItems(dvsp);
      setProducts(sp);
      setUnits(dvt);
      setError("");
    } catch {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= GROUP BY PRODUCT ================= */
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.ma_sp]) {
      acc[item.ma_sp] = {
        ma_sp: item.ma_sp,
        ten_sp: item.ten_sp,
        units: []
      };
    }
    acc[item.ma_sp].units.push(item);
    return acc;
  }, {});

  /* ================= MODAL ================= */
  const handleShowModal = (item = {}) => {
    setCurrentItem({
      ma_donvisp: item.ma_donvisp || "",
      ma_sp: item.ma_sp || "",
      ma_dvt: item.ma_dvt || "",
      gia: item.gia || ""
    });
    setEditMode(!!item.ma_donvisp);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem({
      ma_donvisp: "",
      ma_sp: "",
      ma_dvt: "",
      gia: ""
    });
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
    } catch {
      alert("Thao tác thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá đơn vị này?")) return;
    await deleteDonViSanPham(id);
    fetchData();
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-success">Quản lý Giá theo Đơn vị</h2>
        <Button variant="success" onClick={() => handleShowModal()}>
          + Thêm mới chung
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead className="table-success">
          <tr>
            <th width="25%">Sản phẩm</th>
            <th>Đơn vị – Giá – Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedItems).map((product) => (
            <tr key={product.ma_sp}>
              <td>
                <strong>{product.ten_sp}</strong>
                <br />
                <small className="text-muted">{product.ma_sp}</small>
              </td>

              <td className="p-0">
                <Table bordered size="sm" className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="35%">Đơn vị</th>
                      <th width="25%">Giá</th>
                      <th width="40%" className="text-center">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.units.map((u) => (
                      <tr key={u.ma_donvisp}>
                        <td>{u.ten_dvt}</td>
                        <td>{Number(u.gia).toLocaleString()} đ</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            className="me-2"
                            onClick={() => handleShowModal(u)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(u.ma_donvisp)}
                          >
                            Xoá
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3" className="text-center">
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() =>
                            handleShowModal({ ma_sp: product.ma_sp })
                          }
                        >
                          + Thêm đơn vị
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ================= MODAL ================= */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "📝 Sửa cấu hình" : "➕ Thêm cấu hình mới"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Select
              className="mb-3"
              value={currentItem.ma_sp}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, ma_sp: e.target.value })
              }
              disabled={editMode}
              required
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.ma_sp} value={p.ma_sp}>
                  {p.ten_sp}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              className="mb-3"
              value={currentItem.ma_dvt}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, ma_dvt: e.target.value })
              }
              required
            >
              <option value="">-- Chọn đơn vị --</option>
              {units.map((u) => (
                <option key={u.ma_dvt} value={u.ma_dvt}>
                  {u.ten_dvt}
                </option>
              ))}
            </Form.Select>

            <Form.Control
              type="number"
              placeholder="Giá"
              value={currentItem.gia}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, gia: e.target.value })
              }
              required
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Huỷ
            </Button>
            <Button variant="success" type="submit">
              {editMode ? "Lưu" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default DonViSanPhamAdmin;
