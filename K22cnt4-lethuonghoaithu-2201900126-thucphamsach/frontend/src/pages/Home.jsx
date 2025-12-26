import { useEffect, useState } from "react";
import { getAllSanPham } from "../api/sanpham.js";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    const data = await getAllSanPham();
    console.log(data); // kiểm tra hình ảnh
    setProducts(data);
  };
  fetchProducts();
}, []);


  return (
    <div className="container mt-4">
      <h1>Danh sách sản phẩm</h1>
      <div className="row">
        {products.map((p) => (
          <div key={p.ma_sp} className="col-md-3 mb-3">
            <div className="card h-100">
              <img
                src={p.hinhanh.startsWith("http") ? p.hinhanh : `http://localhost:3001/uploads/${p.hinhanh}`}
                className="card-img-top"
                alt={p.ten_sp}
              />
              <div className="card-body">
                <h5 className="card-title">{p.ten_sp}</h5>
                <p className="card-text">{p.loai_sp}</p>
                <p className="card-text">{p.gia.toLocaleString()}₫</p>
                <Link to={`/product/${p.ma_sp}`} className="btn btn-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
