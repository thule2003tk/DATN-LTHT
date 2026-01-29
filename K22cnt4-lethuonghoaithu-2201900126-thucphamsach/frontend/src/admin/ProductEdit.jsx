import { useEffect, useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { getProductById, updateProduct } from "../api/adminProducts";
import { useParams, useNavigate } from "react-router-dom";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductById(id).then(setForm).catch(() => setError("Không tải được sản phẩm"));
  }, [id]);

  if (!form) return <p>Đang tải...</p>;

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

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    try {
      await updateProduct(id, fd);
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("❌ Cập nhật thất bại");
    }
  };

  return (
    <Container>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-success">✏️ Sửa sản phẩm</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Control className="mb-3" name="ten_sp" value={form.ten_sp || ""} onChange={handleChange} />
          <Form.Control className="mb-3" name="loai_sp" value={form.loai_sp || ""} onChange={handleChange} />
          <Form.Control className="mb-3" type="number" name="gia" value={form.gia || ""} onChange={handleChange} />
          <Form.Control className="mb-3" type="number" name="soluong_ton" value={form.soluong_ton || ""} onChange={handleChange} />
          <Form.Control className="mb-3" as="textarea" name="mota" value={form.mota || ""} onChange={handleChange} />

          <Form.Group className="mb-4">
            <Form.Label>Đổi hình ảnh</Form.Label>
            <Form.Control type="file" name="hinhanh" onChange={handleChange} />
          </Form.Group>

          <Button type="submit" variant="success">💾 Lưu</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ProductEdit;
