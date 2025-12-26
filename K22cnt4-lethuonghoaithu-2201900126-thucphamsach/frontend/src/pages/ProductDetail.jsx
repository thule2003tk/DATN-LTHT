import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSanPhamById } from "../api/sanpham.js";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getSanPhamById(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  return (
    <div className="container mt-4">
      <h1>{product.ten_sp}</h1>
      <img
        src={product.hinhanh.startsWith("http") ? product.hinhanh : `http://localhost:3001/uploads/${product.hinhanh}`}
        alt={product.ten_sp}
        className="img-fluid"
        style={{ maxWidth: "400px" }}
      />
      <p>Loại: {product.loai_sp}</p>
      <p>Giá: {product.gia.toLocaleString()}₫</p>
      <p>Mô tả: {product.mota}</p>
      <button className="btn btn-success" onClick={() => navigate("/cart")}>Thêm vào giỏ</button>
    </div>
  );
}

export default ProductDetail;
