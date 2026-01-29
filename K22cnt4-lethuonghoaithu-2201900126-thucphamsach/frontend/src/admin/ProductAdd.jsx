import { useState } from "react";
import { addProduct } from "../api/adminProducts";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";

function ProductAdd() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    ten_sp: "",
    loai_sp: "",
    mota: "",
    gia: "",
    soluong_ton: "",
    ma_ncc: "NCC01",
    ma_dvt: "DVT03",
    hinhanh: null, // ⚠️ FILE
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "hinhanh") {
      setForm({ ...form, hinhanh: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.ten_sp || !form.gia) {
      setError("⚠️ Vui lòng nhập tên sản phẩm và giá");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        fd.append(key, form[key]);
      }
    });

    try {
      await addProduct(fd);
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("❌ Thêm sản phẩm thất bại");
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h3 className="mb-4 text-success">➕ Thêm sản phẩm</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control name="ten_sp" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Loại</Form.Label>
          <Form.Control name="loai_sp" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control as="textarea" name="mota" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá</Form.Label>
          <Form.Control type="number" name="gia" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số lượng tồn</Form.Label>
          <Form.Control type="number" name="soluong_ton" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nhà cung cấp</Form.Label>
          <Form.Select name="ma_ncc" onChange={handleChange}>
            <option value="NCC01">HTX Rau sạch Hà Nội</option>
            <option value="NCC02">Organic Đà Lạt</option>
            <option value="NCC03">Thực phẩm Xanh</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đơn vị tính</Form.Label>
          <Form.Select name="ma_dvt" onChange={handleChange}>
            <option value="DVT01">Cái</option>
            <option value="DVT03">Bó</option>
            <option value="DVT04">Kg</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="file" name="hinhanh" onChange={handleChange} />
        </Form.Group>

        <Button type="submit" variant="success">💾 Lưu</Button>
      </Form>
    </Card>
  );
}

export default ProductAdd;
