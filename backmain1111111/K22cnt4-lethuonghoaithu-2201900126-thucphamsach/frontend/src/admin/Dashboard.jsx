import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { FaMoneyBillWave, FaShoppingBag, FaUsers, FaBoxOpen } from "react-icons/fa";
import adminDashboardApi from "../api/adminDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [revenueData, setRevenueData] = useState({
    labels: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    datasets: [],
  });

  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: [],
  });

  const [topProductsData, setTopProductsData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [revRes, sumRes, statusRes, topRes] = await Promise.all([
        adminDashboardApi.getRevenueWeek(),
        adminDashboardApi.getSummary(),
        adminDashboardApi.getOrderStatus(),
        adminDashboardApi.getTopProducts(),
      ]);

      setSummary(sumRes.data);

      setRevenueData({
        labels: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        datasets: [
          {
            label: "Doanh thu tuần (₫)",
            data: revRes.data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      });

      setStatusData({
        labels: statusRes.data.map((item) => item.label),
        datasets: [
          {
            data: statusRes.data.map((item) => item.value),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      });

      setTopProductsData({
        labels: topRes.data.map((item) => item.label),
        datasets: [
          {
            label: "Số lượng bán",
            data: topRes.data.map((item) => item.value),
            backgroundColor: "#28a745",
          },
        ],
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-dark fw-bold">📊 Dashboard Tổng Quan</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 bg-primary text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 small opacity-75">TỔNG DOANH THU</p>
                <h3 className="fw-bold mb-0">{Number(summary.totalRevenue || 0).toLocaleString()}₫</h3>
              </div>
              <FaMoneyBillWave size={40} className="opacity-50" />
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 bg-success text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 small opacity-75">TỔNG ĐƠN HÀNG</p>
                <h3 className="fw-bold mb-0">{summary.totalOrders}</h3>
              </div>
              <FaShoppingBag size={40} className="opacity-50" />
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 bg-warning text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 small opacity-75">KHÁCH HÀNG</p>
                <h3 className="fw-bold mb-0">{summary.totalCustomers}</h3>
              </div>
              <FaUsers size={40} className="opacity-50" />
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 bg-info text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 small opacity-75">SẢN PHẨM</p>
                <h3 className="fw-bold mb-0">{summary.totalProducts}</h3>
              </div>
              <FaBoxOpen size={40} className="opacity-50" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Biểu đồ Doanh thu Tuần</h5>
            <div style={{ height: "300px", position: "relative" }}>
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => value.toLocaleString() + '₫'
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Trạng thái Đơn hàng</h5>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">Top 5 Sản phẩm Bán chạy</h5>
            <div style={{ height: "350px" }}>
              <Bar
                data={topProductsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y', // Biểu đồ cột ngang
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;
