import { useEffect, useState } from "react";
import { getAllBlog, addBlog, updateBlog, deleteBlog } from "../api/blog.js"; 
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const data = await getAllBlog();
    setBlogs(data);
  };

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
      setMessage("Lỗi!");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      img: blog.img,
      desc1: blog.desc1,
      desc2: blog.desc2,
      category: blog.category,
      content: blog.content || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa?")) {
      await deleteBlog(id);
      fetchBlogs();
    }
  };

  return (
    <Container>
      <h1 className="my-4">Quản Lý Blog</h1>
      <Button variant="success" onClick={() => setShowModal(true)}>
        Thêm Blog Mới
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Hình ảnh</th>
            <th>Content</th> {/* ✅ Thêm cột content */}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.category}</td>
              <td>
                <img
                  src={blog.img}
                  alt={blog.title}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>
                <div style={{ maxHeight: "80px", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: blog.content }} />
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
          ))}
        </tbody>
      </Table>

      {/* Modal Thêm / Sửa Blog */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingBlog ? "Sửa Blog" : "Thêm Blog Mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant="success">{message}</Alert>}
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
              <Form.Label>Content (HTML)</Form.Label>
              <Form.Control
                name="content"
                as="textarea"
                rows={5}
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
