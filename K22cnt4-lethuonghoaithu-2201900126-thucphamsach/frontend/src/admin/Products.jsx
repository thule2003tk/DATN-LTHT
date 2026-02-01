import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Image } from "react-bootstrap";
import { getProducts, deleteProduct } from "../api/adminProducts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductUnitsModal from "./ProductUnitsModal";

function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ ma_sp: "", ten_sp: "" });

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

  useEffect(() => {
    fetchProducts();
  }, []);

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

        {/* ADMIN mới được thêm */}
        {user.vai_tro === "admin" && (
          <Button onClick={() => navigate("/admin/products/add")}>
            + Thêm sản phẩm
          </Button>
        )}
      </div>

      <Table bordered hover>
        <thead className="table-success">
          <tr>
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá mặc định</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                Chưa có sản phẩm
              </td>
            </tr>
          )}

          {products.map((p, index) => (
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
              <td>{p.soluong_ton}</td>
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

      {/* Member bị chặn quyền */}
      {user.vai_tro === "member" && (
        <Alert variant="info" className="mt-3">
          Bạn đang đăng nhập với quyền <b>Member</b> – không thể xoá sản phẩm
        </Alert>
      )}
    </div>
  );
}

export default AdminProducts;
