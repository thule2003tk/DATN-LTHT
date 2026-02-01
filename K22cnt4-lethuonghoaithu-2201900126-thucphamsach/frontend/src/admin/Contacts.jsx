import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { FaReply, FaTrash } from "react-icons/fa";
import lienHeApi from "../api/lienhe";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await lienHeApi.getAllContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (contact) => {
    setCurrentContact(contact);
    setReplyText(contact.traloi || "");
    setShowReplyModal(true);
  };

  const handleReply = async () => {
    if (!replyText) return;
    setSubmitting(true);
    try {
      await lienHeApi.replyContact(currentContact.id, { traloi: replyText });
      setShowReplyModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Error replying contact:", error);
      alert("Có lỗi xảy ra khi gửi phản hồi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
      try {
        await lienHeApi.deleteContact(id);
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Có lỗi xảy ra khi xóa liên hệ.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-success">Đang tải danh sách liên hệ...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">Quản lý liên hệ</h2>
        <Button variant="outline-success" onClick={fetchContacts}>
          Tải lại danh sách
        </Button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <Table responsive hover className="align-middle">
            <thead className="table-success">
              <tr>
                <th>STT</th>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td>{index + 1}</td>
                    <td><span className="fw-bold">{contact.ten}</span></td>
                    <td>{contact.email}</td>
                    <td style={{ maxWidth: "300px" }} className="text-truncate">
                      {contact.noidung}
                    </td>
                    <td>
                      <Badge bg={contact.trangthai === "Đã trả lời" ? "success" : "warning"}>
                        {contact.trangthai}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenReply(contact)}
                      >
                        <FaReply /> Trả lời
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <FaTrash /> Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Chưa có liên hệ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal trả lời */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-success">Trả lời liên hệ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="fw-bold text-muted">Nội dung từ khách hàng:</label>
            <div className="p-3 bg-light rounded mt-1 shadow-sm border-start border-4 border-success">
              {currentContact?.noidung}
            </div>
          </div>
          <Form.Group>
            <Form.Label className="fw-bold">Câu trả lời:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập nội dung trả lời cho khách hàng..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={handleReply}
            disabled={submitting || !replyText}
          >
            {submitting ? "Đang gửi..." : "Gửi trả lời"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .table thead th {
          border-top: none;
          font-weight: 600;
        }
        .card {
          border-radius: 12px;
        }
        .text-truncate {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}

export default AdminContacts;