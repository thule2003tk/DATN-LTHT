import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [chartData, setChartData] = useState({
    labels: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem("token"); // nếu có JWT
      const res = await axios.get("http://localhost:3001/api/admin/revenue-week", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChartData({
        labels: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        datasets: [
          {
            label: "Doanh thu (₫)",
            data: res.data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (err) {
      console.error("Lỗi lấy dữ liệu biểu đồ:", err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-success">Tổng quan hệ thống</h2>

      {/* Biểu đồ doanh thu tuần */}
      <div className="mt-5">
        <h4>Doanh thu tuần</h4>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
    </div>
  );
}

export default AdminDashboard;
