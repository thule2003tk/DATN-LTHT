import { useEffect, useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { getProductById, updateProduct } from "../api/adminProducts";
import { getDanhMuc } from "../api/adminDanhMuc";
import { getDonViTinh } from "../api/adminDonViTinh";
import adminSupplierApi from "../api/adminSuppliers";
import { useParams, useNavigate } from "react-router-dom";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prod, cats, unts, sups] = await Promise.all([
          getProductById(id),
          getDanhMuc(),
          getDonViTinh(),
          adminSupplierApi.getAll()
        ]);
        setForm(prod);
        setCategories(cats);
        setUnits(unts);
        setSuppliers(sups.data || []);
      } catch (err) {
        setError("Không tải được dữ liệu");
      }
    };
    fetchData();
  }, [id]);

  if (!form) return <p>Đang tải...</p>;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "hinhanh") {
      setForm({ ...form, hinhanh: files[0] });
    } else if (name === "ma_danhmuc") {
      const cat = categories.find(c => c.ma_danhmuc === value);
      setForm({ ...form, ma_danhmuc: value, ten_danhmuc: cat?.ten_danhmuc || "" });
    } else if (name === "is_featured") {
      setForm({ ...form, is_featured: e.target.checked ? 1 : 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fd = new FormData();
    // Danh sách các trường cần gửi
    const fields = [
      "ten_sp", "ten_danhmuc", "ma_danhmuc", "mota", "gia", "phan_tram_giam_gia",
      "soluong_ton", "ma_ncc", "ma_dvt", "thongtin_sanpham", "is_featured"
    ];

    fields.forEach((key) => {
      if (form[key] !== undefined && form[key] !== null) {
        fd.append(key, form[key]);
      }
    });

    // Xử lý riêng phần hình ảnh
    if (form.hinhanh instanceof File) {
      fd.append("hinhanh", form.hinhanh);
    }

    try {
      await updateProduct(id, fd);
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      const msg = err.response?.data?.error || err.message || "Kết nối thất bại";
      setError(`❌ Cập nhật thất bại: ${msg}`);
    }
  };

  return (
    <Container>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-success">✏️ Sửa sản phẩm</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control className="mb-3" name="ten_sp" value={form.ten_sp || ""} onChange={handleChange} />

          <Form.Label>Danh mục</Form.Label>
          <Form.Select className="mb-3" name="ma_danhmuc" value={form.ma_danhmuc || ""} onChange={handleChange}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => (
              <option key={c.ma_danhmuc} value={c.ma_danhmuc}>{c.ten_danhmuc}</option>
            ))}
          </Form.Select>

          <div className="row g-2">
            <div className="col-md-7">
              <Form.Label className="fw-bold">Giá mặc định</Form.Label>
              <Form.Control className="mb-3" type="number" name="gia" value={form.gia || ""} onChange={handleChange} />
            </div>
            <div className="col-md-5">
              <Form.Label className="fw-bold text-danger">Giảm giá (%)</Form.Label>
              <Form.Control
                className="mb-3"
                type="number"
                name="phan_tram_giam_gia"
                value={form.phan_tram_giam_gia || 0}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          </div>

          <Form.Label>Số lượng tồn</Form.Label>
          <Form.Control className="mb-3" type="number" name="soluong_ton" value={form.soluong_ton || ""} onChange={handleChange} />

          <Form.Label>Mô tả ngắn</Form.Label>
          <Form.Control className="mb-3" as="textarea" name="mota" value={form.mota || ""} onChange={handleChange} />

          <Form.Label>Thông tin chi tiết sản phẩm</Form.Label>
          <Form.Control className="mb-3" as="textarea" rows={5} name="thongtin_sanpham" value={form.thongtin_sanpham || ""} onChange={handleChange} />

          <Form.Label>Nhà cung cấp</Form.Label>
          <Form.Select className="mb-3" name="ma_ncc" value={form.ma_ncc || ""} onChange={handleChange}>
            {suppliers.map(s => (
              <option key={s.ma_ncc} value={s.ma_ncc}>{s.ten_ncc}</option>
            ))}
          </Form.Select>

          <Form.Label>Đơn vị tính cơ bản</Form.Label>
          <Form.Select className="mb-3" name="ma_dvt" value={form.ma_dvt || ""} onChange={handleChange}>
            {units.map(u => (
              <option key={u.ma_dvt} value={u.ma_dvt}>{u.ten_dvt}</option>
            ))}
          </Form.Select>

          <Form.Group className="mb-4">
            <Form.Label>Đổi hình ảnh</Form.Label>
            <Form.Control type="file" name="hinhanh" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="is_featured"
              label="Sản phẩm nổi bật (Hiện ngoài trang chủ)"
              checked={form.is_featured === 1}
              onChange={handleChange}
              className="fw-bold text-primary"
            />
          </Form.Group>

          <Button type="submit" variant="success">💾 Lưu</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ProductEdit;
