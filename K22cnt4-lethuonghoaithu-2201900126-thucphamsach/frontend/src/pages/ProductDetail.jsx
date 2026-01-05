import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSanPhamById } from "../api/sanpham.js";
import { useCart } from "../context/CartContext.jsx"; // <- CartContext cần tạo

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Lấy hàm thêm vào giỏ

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSanPhamById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="container mt-4">
      <h1>{product.ten_sp}</h1>
      <img
        src={product.hinhanh.startsWith("http") ? product.hinhanh : `http://localhost:3001/uploads/${product.hinhanh}`}
        alt={product.ten_sp}
        className="img-fluid mb-3"
        style={{ maxWidth: "400px" }}
      />
      <p>Loại: {product.loai_sp}</p>
      <p>Giá: {Number(product.gia).toLocaleString()}₫</p>
      <p>Mô tả: {product.mota}</p>

      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            handleAddToCart();
            navigate("/cart");
          }}
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
