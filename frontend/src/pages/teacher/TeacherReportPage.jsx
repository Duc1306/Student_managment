import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import HustHeader from "../../components/HustHeader";
import HustFooter from "../../components/HustFooter";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function TeacherReportPage() {
  const { id } = useParams(); // ID của lớp
  const [reportData, setReportData] = useState(null);
  const [date, setDate] = useState(""); // chọn ngày (tuỳ chọn)

  useEffect(() => {
    // Nếu có chọn ngày, truyền vào query param; ngược lại, lấy dữ liệu tổng hợp của lớp
    const params = { classId: id };
    if (date) params.date = date;

    api
      .get("/attendance/report", { params })
      .then((res) => setReportData(res.data))
      .catch((err) => console.error(err));
  }, [id, date]);

  const chartData = {
    labels: ["Có mặt", "Muộn", "Vắng"],
    datasets: [
      {
        label: "Số lượt điểm danh",
        data: reportData
          ? [reportData.present, reportData.late, reportData.absent]
          : [],
        backgroundColor: ["green", "orange", "red"],
      },
    ],
  };

  return (
    <div className="container my-4">
      <HustHeader
        title="Báo cáo điểm danh"
        subtitle={`Lớp ${id} - ${date ? `Ngày ${date}` : "Tổng hợp"}`}
        icon="clipboard-data"
      />
      <div className="mb-3">
        <label className="form-label">Chọn ngày (tuỳ chọn):</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {reportData ? (
        <div className="card mb-4">
          <div className="card-body">
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
        </div>
      ) : (
        <p>Đang tải dữ liệu báo cáo...</p>
      )}
      <HustFooter />
    </div>
  );
}

export default TeacherReportPage;
