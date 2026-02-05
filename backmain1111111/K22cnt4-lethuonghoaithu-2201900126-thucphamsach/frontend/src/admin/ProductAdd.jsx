import { useState, useEffect } from "react";
import { addProduct } from "../api/adminProducts";
import { getDanhMuc } from "../api/adminDanhMuc";
import { getDonViTinh } from "../api/adminDonViTinh";
import adminSupplierApi from "../api/adminSuppliers";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";

function ProductAdd() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    ten_sp: "",
    ten_danhmuc: "",
    ma_danhmuc: "",
    ma_ncc: "",
    ma_dvt: "",
    hinhanh: null,
    thongtin_sanpham: "",
    gia: "", // Thêm trường giá mặc định
    phan_tram_giam_gia: 0,
    soluong_ton: "",
    mota: "",
    is_featured: 0,
  });

  const [selectedUnits, setSelectedUnits] = useState([]); // Array of { ma_dvt, gia, ten_dvt }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, unitData, supplierData] = await Promise.all([
          getDanhMuc(),
          getDonViTinh(),
          adminSupplierApi.getAll()
        ]);
        setCategories(catData);
        setUnits(unitData);
        setSuppliers(supplierData.data || []);

        if (unitData.length > 0) {
          setForm(prev => ({ ...prev, ma_dvt: unitData[0].ma_dvt }));
          // Tự động bỏ đơn vị cơ bản vào danh sách chọn (với giá mặc định sẽ được cập nhật sau)
        }
        if (catData.length > 0) {
          setForm(prev => ({
            ...prev,
            ten_danhmuc: catData[0].ten_danhmuc,
            ma_danhmuc: catData[0].ma_danhmuc
          }));
        }
        if (supplierData.data?.length > 0) setForm(prev => ({ ...prev, ma_ncc: supplierData.data[0].ma_ncc }));
      } catch (err) {
        setError("Không thể tải danh mục, đơn vị tính hoặc nhà cung cấp");
      }
    };
    fetchData();
  }, []);

  const handleUnitToggle = (unit) => {
    const isSelected = selectedUnits.find(u => u.ma_dvt === unit.ma_dvt);
    if (isSelected) {
      setSelectedUnits(selectedUnits.filter(u => u.ma_dvt !== unit.ma_dvt));
    } else {
      setSelectedUnits([...selectedUnits, { ma_dvt: unit.ma_dvt, gia: "", ten_dvt: unit.ten_dvt }]);
    }
  };

  const handleUnitPriceChange = (ma_dvt, price) => {
    setSelectedUnits(selectedUnits.map(u =>
      u.ma_dvt === ma_dvt ? { ...u, gia: price } : u
    ));
  };

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

    if (!form.ten_sp || !form.gia) {
      setError("⚠️ Vui lòng nhập tên sản phẩm và giá mặc định");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        fd.append(key, form[key]);
      }
    });

    // 🚀 Đóng gói danh sách đơn vị tính bổ sung
    const extraUnits = selectedUnits.filter(u => u.gia > 0);
    fd.append("selectedUnits", JSON.stringify(extraUnits));

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
      <h3 className="mb-4 text-success">➕ Thêm sản phẩm mới</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tên sản phẩm</Form.Label>
              <Form.Control name="ten_sp" onChange={handleChange} required placeholder="Ví dụ: Tôm Hùm Canada" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Danh mục</Form.Label>
              <Form.Select name="ma_danhmuc" value={form.ma_danhmuc} onChange={handleChange}>
                {categories.map((c) => (
                  <option key={c.ma_danhmuc} value={c.ma_danhmuc}>{c.ten_danhmuc}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nhà cung cấp</Form.Label>
              <Form.Select name="ma_ncc" value={form.ma_ncc} onChange={handleChange}>
                {suppliers.map((s) => (
                  <option key={s.ma_ncc} value={s.ma_ncc}>{s.ten_ncc}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Đơn vị tính cơ bản (Chính)</Form.Label>
              <Form.Select name="ma_dvt" value={form.ma_dvt} onChange={handleChange}>
                {units.map((u) => (
                  <option key={u.ma_dvt} value={u.ma_dvt}>{u.ten_dvt}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row g-2">
              <div className="col-md-7">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Giá mặc định (cho đơn vị chính)</Form.Label>
                  <Form.Control type="number" name="gia" onChange={handleChange} required placeholder="Nhập giá" />
                  <Form.Text className="text-muted italic small">
                    💡 Làm giá hiển thị chính.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-5">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-danger">Giảm (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="phan_tram_giam_gia"
                    value={form.phan_tram_giam_gia}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Hình ảnh</Form.Label>
              <Form.Control type="file" name="hinhanh" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Số lượng tồn</Form.Label>
              <Form.Control type="number" name="soluong_ton" onChange={handleChange} placeholder="0" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Mô tả ngắn</Form.Label>
              <Form.Control as="textarea" rows={3} name="mota" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="is_featured"
                label="Sản phẩm nổi bật (Hiện ngoài trang chủ)"
                checked={form.is_featured === 1}
                onChange={handleChange}
                className="fw-bold text-primary"
              />
            </Form.Group>
          </div>
        </div>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Thông tin chi tiết sản phẩm</Form.Label>
          <Form.Control as="textarea" rows={4} name="thongtin_sanpham" onChange={handleChange} />
        </Form.Group>

        {/* 🚀 CHỌN ĐA ĐƠN VỊ TÍNH */}
        <div className="mb-4 p-3 border rounded bg-light">
          <h5 className="text-secondary fw-bold mb-3">📍 Thiết lập tất cả các đơn vị tính</h5>
          <p className="small text-muted mb-3">Tích chọn các đơn vị khác và nhập giá tương ứng nếu sản phẩm có nhiều cách bán (ví dụ: vừa bán theo Kg, vừa bán theo Thùng).</p>

          <div className="row">
            {units.map((u) => {
              const selected = selectedUnits.find(su => su.ma_dvt === u.ma_dvt);
              return (
                <div key={u.ma_dvt} className="col-md-6 mb-3">
                  <div className="d-flex align-items-center gap-3 p-2 border rounded bg-white">
                    <Form.Check
                      type="checkbox"
                      id={`unit-${u.ma_dvt}`}
                      label={u.ten_dvt}
                      checked={!!selected}
                      onChange={() => handleUnitToggle(u)}
                      className="fw-bold"
                    />
                    {selected && (
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="Nhập giá..."
                        value={selected.gia}
                        onChange={(e) => handleUnitPriceChange(u.ma_dvt, e.target.value)}
                        style={{ width: "120px" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-flex gap-2">
          <Button type="submit" variant="success" size="lg" className="px-5">💾 Lưu sản phẩm</Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("/admin/products")}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
}

export default ProductAdd;
