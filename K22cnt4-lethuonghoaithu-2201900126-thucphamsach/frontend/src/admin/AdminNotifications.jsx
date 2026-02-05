import { useEffect, useState } from "react";
import { ListGroup, Badge, Spinner, Card, Container } from "react-bootstrap";
import { FaBell, FaShoppingCart, FaUserPlus, FaExclamationTriangle } from "react-icons/fa";
import adminNotificationApi from "../api/adminNotifications";
import { useNavigate } from "react-router-dom";

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await adminNotificationApi.getNotifications({ all: true });
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Lỗi lấy thông báo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <div className="bg-primary bg-opacity-10 p-2 rounded-circle"><FaShoppingCart className="text-primary" /></div>;
            case 'stock': return <div className="bg-warning bg-opacity-10 p-2 rounded-circle"><FaExclamationTriangle className="text-warning" /></div>;
            case 'user': return <div className="bg-info bg-opacity-10 p-2 rounded-circle"><FaUserPlus className="text-info" /></div>;
            default: return <div className="bg-secondary bg-opacity-10 p-2 rounded-circle"><FaBell className="text-secondary" /></div>;
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success fw-bold mb-0">🔔 Tất cả thông báo</h2>
                <button className="btn btn-outline-success btn-sm" onClick={fetchNotifications}>Làm mới</button>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <ListGroup variant="flush">
                    {notifications.length === 0 ? (
                        <ListGroup.Item className="p-5 text-center text-muted">
                            Không có thông báo nào
                        </ListGroup.Item>
                    ) : (
                        notifications.map((n, idx) => (
                            <ListGroup.Item
                                key={idx}
                                className="p-4 border-bottom-0 hover-bg-light transition-all cursor-pointer"
                                onClick={() => navigate(n.link)}
                            >
                                <div className="d-flex align-items-start gap-3">
                                    {getIcon(n.type)}
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <h6 className="fw-bold mb-0 text-dark">{n.title}</h6>
                                            <small className="text-muted">{new Date(n.time).toLocaleString('vi-VN')}</small>
                                        </div>
                                        <p className="text-secondary mb-0">{n.content}</p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>

            <style>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          z-index: 1;
        }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
        </Container>
    );
}

export default AdminNotifications;
