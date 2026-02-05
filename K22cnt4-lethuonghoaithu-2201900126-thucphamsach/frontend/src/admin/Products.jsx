import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Image, Badge } from "react-bootstrap";
import { getProducts, deleteProduct } from "../api/adminProducts";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ProductUnitsModal from "./ProductUnitsModal";
import { FaExclamationTriangle, FaStar } from "react-icons/fa";

function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ ma_sp: "", ten_sp: "" });
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.ten_sp.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "" || p.ma_danhmuc === filterCategory;
    return matchSearch && matchCat;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search");
    if (s !== null) setSearchTerm(s);
  }, [location.search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.ma_sp !== id));
    } catch {
      alert("Xoá thất bại");
    }
  };

  const handleOpenUnits = (p) => {
    setSelectedProduct({ ma_sp: p.ma_sp, ten_sp: p.ten_sp });
    setShowUnitModal(true);
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">Quản lý sản phẩm</h2>

        <div className="d-flex gap-2">
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Tìm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: "250px" }}
            />
            <span className="position-absolute top-50 start-0 translate-middle-y ps-3">🔍</span>
          </div>

          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: "180px" }}
          >
            <option value="">Lọc theo danh mục</option>
            {[...new Set(products.map(p => ({ id: p.ma_danhmuc, name: p.ten_danhmuc })))].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).map(cat => (
              cat.id && <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {user.vai_tro !== "customer" && (
            <Button onClick={() => navigate("/admin/products/add")} variant="success">
              + Thêm sản phẩm
            </Button>
          )}
        </div>
      </div>

      <Table bordered hover>
        <thead className="table-success">
          <tr>
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá mặc định</th>
            <th>Giảm giá</th>
            <th>Tồn kho</th>
            <th>Nổi bật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center py-5">
                <div className="text-muted fs-5">🔍 Không tìm thấy sản phẩm nào phù hợp</div>
              </td>
            </tr>
          )}

          {filteredProducts.map((p, index) => (
            <tr key={p.ma_sp}>
              <td>{index + 1}</td>
              <td>
                {p.hinhanh ? (
                  <Image
                    src={`http://localhost:3001/uploads/${p.hinhanh}`}
                    alt={p.ten_sp}
                    width={80}
                    height={80}
                    rounded
                  />
                ) : (
                  <span>Chưa có ảnh</span>
                )}
              </td>
              <td>{p.ten_sp}</td>
              <td>{p.ten_danhmuc || "Chưa phân loại"}</td>
              <td>{Number(p.gia).toLocaleString()} đ</td>
              <td>
                <div className="d-flex flex-column gap-1">
                  {p.phan_tram_giam_gia > 0 ? (
                    <Badge bg="danger">-{p.phan_tram_giam_gia}%</Badge>
                  ) : (
                    <span className="text-muted">0%</span>
                  )}

                  {/* Cảnh báo nếu nhập > 7 ngày mà chưa giảm */}
                  {p.created_at && (Date.now() - new Date(p.created_at)) > 7 * 24 * 60 * 60 * 1000 && Number(p.phan_tram_giam_gia) === 0 && (
                    <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1">
                      <FaExclamationTriangle size={10} /> Cần giảm giá
                    </Badge>
                  )}
                </div>
              </td>
              <td>{p.soluong_ton}</td>
              <td className="text-center">
                {p.is_featured === 1 ? (
                  <FaStar className="text-warning" title="Sản phẩm nổi bật" />
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>
                {/* Admin + Member đều xem/sửa */}
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() =>
                    navigate(`/admin/products/edit/${p.ma_sp}`)
                  }
                >
                  Sửa
                </Button>

                {/* CHỈ ADMIN MỚI XOÁ */}
                {user.vai_tro === "admin" && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.ma_sp)}
                  >
                    Xoá
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ProductUnitsModal
        show={showUnitModal}
        onHide={() => setShowUnitModal(false)}
        ma_sp={selectedProduct.ma_sp}
        ten_sp={selectedProduct.ten_sp}
      />

      {/* Nhân viên bị giới hạn quyền xóa */}
      {user.vai_tro !== "admin" && (
        <Alert variant="info" className="mt-3">
          Bạn đang đăng nhập với quyền <b>{user.vai_tro}</b> – chỉ Admin mới có quyền xóa dữ liệu.
        </Alert>
      )}
    </div>
  );
}

export default AdminProducts;
