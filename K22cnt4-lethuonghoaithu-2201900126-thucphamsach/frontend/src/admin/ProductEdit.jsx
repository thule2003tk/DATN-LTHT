import { useEffect, useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { getProductById, updateProduct } from "../api/adminProducts";
import { getDanhMuc } from "../api/adminDanhMuc";
import { getDonViTinh } from "../api/adminDonViTinh";
import { getDonViSanPhamByMaSP } from "../api/donvisanpham";
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
  const [selectedUnits, setSelectedUnits] = useState([]); // { ma_dvt, gia, ten_dvt }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prod, cats, unts, sups] = await Promise.all([
          getProductById(id),
          getDanhMuc(),
          getDonViTinh(),
          adminSupplierApi.getAll()
        ]);
        setForm({
          ...prod,
          ma_danhmuc_list: prod.danhmuc_ids || []
        });
        setCategories(cats);
        setUnits(unts);
        setSuppliers(sups.data || []);

        // Load existing units
        const existingUnits = await getDonViSanPhamByMaSP(id);
        if (existingUnits && Array.isArray(existingUnits)) {
          setSelectedUnits(existingUnits.map(u => ({
            ma_dvt: u.ma_dvt,
            gia: u.gia,
            ten_dvt: u.ten_dvt || unts.find(ut => ut.ma_dvt === u.ma_dvt)?.ten_dvt || ""
          })));
        }
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
    } else if (name === "giay_chung_nhan") {
      setForm({ ...form, giay_chung_nhan: files[0] });
    } else if (name === "ma_danhmuc") {
      const cat = categories.find(c => c.ma_danhmuc === value);
      setForm({ ...form, ma_danhmuc: value, ten_danhmuc: cat?.ten_danhmuc || "" });
    } else if (name === "is_featured") {
      setForm({ ...form, is_featured: e.target.checked ? 1 : 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryToggle = (ma_danhmuc) => {
    setForm(prev => {
      const isSelected = (prev.ma_danhmuc_list || []).includes(ma_danhmuc);
      const newList = isSelected
        ? prev.ma_danhmuc_list.filter(id => id !== ma_danhmuc)
        : [...(prev.ma_danhmuc_list || []), ma_danhmuc];

      return {
        ...prev,
        ma_danhmuc_list: newList,
        ma_danhmuc: newList.length > 0 ? (newList.includes(prev.ma_danhmuc) ? prev.ma_danhmuc : newList[0]) : ""
      };
    });
  };

  const handleUnitToggle = (unit) => {
    setSelectedUnits(prev => {
      const isSelected = prev.find(u => u.ma_dvt === unit.ma_dvt);
      if (isSelected) {
        return prev.filter(u => u.ma_dvt !== unit.ma_dvt);
      } else {
        return [...prev, { ma_dvt: unit.ma_dvt, gia: form.gia || 0, ten_dvt: unit.ten_dvt }];
      }
    });
  };

  const handleUnitPriceChange = (ma_dvt, price) => {
    setSelectedUnits(prev => prev.map(u =>
      u.ma_dvt === ma_dvt ? { ...u, gia: price } : u
    ));
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
      // Bỏ qua các trường xử lý riêng để tránh gửi lặp
      if (["ma_danhmuc", "ten_danhmuc", "ma_danhmuc_list", "hinhanh", "giay_chung_nhan"].includes(key)) return;

      if (form[key] !== undefined && form[key] !== null) {
        fd.append(key, form[key]);
      }
    });

    // 🚀 Đóng gói danh mục
    fd.append("ma_danhmuc_list", JSON.stringify(form.ma_danhmuc_list || []));
    fd.append("ma_danhmuc", form.ma_danhmuc || "");

    // Gửi thêm ten_danhmuc chính
    const mainCat = categories.find(c => c.ma_danhmuc === form.ma_danhmuc);
    fd.append("ten_danhmuc", mainCat?.ten_danhmuc || "");

    // Xử lý riêng phần hình ảnh
    if (form.hinhanh instanceof File) {
      fd.append("hinhanh", form.hinhanh);
    }
    // Xử lý riêng phần chứng nhận
    if (form.giay_chung_nhan instanceof File) {
      fd.append("giay_chung_nhan", form.giay_chung_nhan);
    }

    // 🚀 Đóng gói danh sách đơn vị tính đa quy cách
    fd.append("selectedUnits", JSON.stringify(selectedUnits));

    try {
      await updateProduct(id, fd);
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      const data = err.response?.data;
      const msg = data?.details || data?.error || err.message || "Kết nối thất bại";
      const stack = data?.stack ? `\nStack: ${data.stack.split('\n')[0]}` : "";
      setError(`❌ Cập nhật thất bại: ${msg}${stack}`);
      if (data?.sql) console.error("SQL Error:", data.sql);
      if (data?.stack) console.error("Full Error Stack:", data.stack);
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

          <Form.Label className="fw-bold">Danh mục (Có thể chọn nhiều)</Form.Label>
          <div className="p-3 border rounded bg-light mb-3" style={{ maxHeight: "150px", overflowY: "auto" }}>
            {categories.map((c) => (
              <Form.Check
                key={c.ma_danhmuc}
                type="checkbox"
                id={`cat-${c.ma_danhmuc}`}
                label={c.ten_danhmuc}
                checked={(form.ma_danhmuc_list || []).includes(c.ma_danhmuc)}
                onChange={() => handleCategoryToggle(c.ma_danhmuc)}
                className="mb-1"
              />
            ))}
          </div>
          <Form.Text className="text-muted small mb-3 d-block">
            💡 Danh mục đầu tiên bạn chọn sẽ là danh mục chính.
          </Form.Text>

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
          <Form.Select className="mb-4" name="ma_ncc" value={form.ma_ncc || ""} onChange={handleChange}>
            {suppliers.map(s => (
              <option key={s.ma_ncc} value={s.ma_ncc}>{s.ten_ncc}</option>
            ))}
          </Form.Select>

          {/* 🚀 THIẾT LẬP ĐA ĐƠN VỊ TÍNH (UI TÍCH CHỌN) */}
          <div className="mb-4 p-3 border rounded bg-light shadow-sm">
            <Form.Label className="fw-bold text-success mb-2">📍 Thiết lập các đơn vị tính & Giá</Form.Label>
            <p className="small text-muted mb-3">Tích chọn các đơn vị sản phẩm có và nhập giá tương ứng.</p>

            <div className="row g-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {units.map((u) => {
                const selected = selectedUnits.find(su => su.ma_dvt === u.ma_dvt);
                return (
                  <div key={u.ma_dvt} className="col-md-6">
                    <div className={`d-flex align-items-center gap-2 p-2 border rounded ${selected ? 'bg-white border-success' : 'bg-transparent text-muted'}`}>
                      <Form.Check
                        type="checkbox"
                        id={`unit-edit-${u.ma_dvt}`}
                        label={u.ten_dvt}
                        checked={!!selected}
                        onChange={() => handleUnitToggle(u)}
                        className="fw-bold flex-grow-1"
                      />
                      {selected && (
                        <Form.Control
                          size="sm"
                          type="number"
                          placeholder="Giá..."
                          value={selected.gia}
                          onChange={(e) => handleUnitPriceChange(u.ma_dvt, e.target.value)}
                          style={{ width: "100px" }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Form.Label className="fw-bold">Đơn vị tính hiển thị chính</Form.Label>
          <Form.Select className="mb-4" name="ma_dvt" value={form.ma_dvt || ""} onChange={handleChange}>
            {selectedUnits.length > 0 ? (
              selectedUnits.map(u => (
                <option key={u.ma_dvt} value={u.ma_dvt}>{u.ten_dvt}</option>
              ))
            ) : (
              units.map(u => (
                <option key={u.ma_dvt} value={u.ma_dvt}>{u.ten_dvt}</option>
              ))
            )}
          </Form.Select>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Đổi hình ảnh sản phẩm</Form.Label>
            <Form.Control type="file" name="hinhanh" onChange={handleChange} />
            {form.hinhanh && !(form.hinhanh instanceof File) && (
              <Form.Text className="text-muted">Ảnh hiện tại: {form.hinhanh}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-success">🌿 Đổi giấy chứng nhận Thực phẩm sạch</Form.Label>
            <Form.Control type="file" name="giay_chung_nhan" onChange={handleChange} />
            {form.giay_chung_nhan && !(form.giay_chung_nhan instanceof File) && (
              <Form.Text className="text-success">Đã có chứng nhận: {form.giay_chung_nhan}</Form.Text>
            )}
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
