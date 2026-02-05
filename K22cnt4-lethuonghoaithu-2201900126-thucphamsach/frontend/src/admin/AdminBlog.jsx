import { useEffect, useState } from "react";
import { getAllBlog, addBlog, updateBlog, deleteBlog } from "../api/blog.js";
import { Container, Table, Button, Modal, Form, Alert, OverlayTrigger, Tooltip, InputGroup } from "react-bootstrap";

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    img: "",
    desc1: "",
    desc2: "",
    category: "monan",
    content: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getAllBlog();
      console.log("Dữ liệu blog từ API (admin):", data);
      const blogList = Array.isArray(data) ? data : data?.blogs || data?.data || [];
      console.log("Danh sách blog sau xử lý:", blogList);
      setBlogs(blogList);
    } catch (err) {
      console.error("Lỗi fetchBlogs:", err);
      setFetchError("Không thể tải danh sách blog. Lỗi: " + (err.message || "Server error"));
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(b =>
    (b.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, formData);
        setMessage("Cập nhật thành công!");
      } else {
        await addBlog(formData);
        setMessage("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      setMessage("Lỗi: " + (err.message || "Không thể lưu"));
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      img: blog.img || "",
      desc1: blog.desc1 || "",
      desc2: blog.desc2 || "",
      category: blog.category || "monan",
      content: blog.content || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa bài viết này?")) {
      try {
        await deleteBlog(id);
        setMessage("Xóa thành công!");
        fetchBlogs();
      } catch (err) {
        setMessage("Lỗi xóa: " + (err.message || ""));
      }
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Quản Lý Blog</h1>

        <div className="d-flex gap-3 align-items-center">
          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-success">
              🔍
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm tên bài viết hoặc danh mục..."
              className="border-start-0 shadow-none border-success-subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Button variant="success" onClick={() => {
            setEditingBlog(null);
            setFormData({
              title: "",
              img: "",
              desc1: "",
              desc2: "",
              category: "monan",
              content: "",
            });
            setShowModal(true);
          }}>
            Thêm Blog Mới
          </Button>
        </div>
      </div>

      {loading && <p className="mt-3 text-center">Đang tải danh sách blog...</p>}
      {fetchError && <Alert variant="danger" className="mt-3">{fetchError}</Alert>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Hình ảnh</th>
            <th>Content (xem trước)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.length === 0 && !loading ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <div className="text-muted fs-5">🔍 Không tìm thấy bài viết nào phù hợp</div>
              </td>
            </tr>
          ) : (
            filteredBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title || "Chưa có tiêu đề"}</td>
                <td>{blog.category}</td>
                <td>
                  <img
                    src={blog.img?.startsWith("http") ? blog.img : `http://localhost:3001/uploads/${blog.img}`}
                    alt={blog.title}
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
                  />
                </td>
                <td>
                  {/* CỘT CONTENT ĐẸP HƠN: tooltip hover xem đầy đủ + scroll */}
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${blog.id}`}>
                        {blog.content?.replace(/<[^>]*>/g, ' ') || "Chưa có nội dung"} {/* Text sạch khi hover */}
                      </Tooltip>
                    }
                  >
                    <div
                      style={{
                        maxHeight: "120px",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: "0.9rem",
                        lineHeight: "1.4",
                        padding: "8px",
                        background: "#f8f9fa",
                        borderRadius: "4px",
                        cursor: "help",
                      }}
                      dangerouslySetInnerHTML={{ __html: blog.content?.substring(0, 300) + (blog.content?.length > 300 ? "..." : "") || "<p>Chưa có nội dung chi tiết</p>" }}
                    />
                  </OverlayTrigger>
                </td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEdit(blog)} className="me-2">
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(blog.id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal Thêm / Sửa Blog */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingBlog ? "Sửa Blog" : "Thêm Blog Mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant={message.includes("Lỗi") ? "danger" : "success"}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh URL</Form.Label>
              <Form.Control name="img" value={formData.img} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả 1</Form.Label>
              <Form.Control name="desc1" value={formData.desc1} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả 2</Form.Label>
              <Form.Control name="desc2" value={formData.desc2} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange}>
                <option value="monan">MÓN ĂN</option>
                <option value="rausach">RAU SẠCH</option>
                <option value="suckhoe">SỨC KHỎE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content (HTML - có thể để trống)</Form.Label>
              <Form.Control
                name="content"
                as="textarea"
                rows={10}
                value={formData.content}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminBlog;