import React, { useState, useEffect } from "react";
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

// Đăng ký các thành phần của Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminReportPage() {
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    api
      .get("/reports/overview")
      .then((res) => setOverviewData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const chartData = {
    labels: ["Có mặt", "Muộn", "Vắng"],
    datasets: [
      {
        label: "Số lượt điểm danh",
        data: overviewData
          ? [
              overviewData.attendanceSummary.present,
              overviewData.attendanceSummary.late,
              overviewData.attendanceSummary.absent,
            ]
          : [],
        backgroundColor: ["green", "orange", "red"],
      },
    ],
  };

  return (
    <div className="container my-4">
      <HustHeader
        title="Báo cáo tổng quan"
        subtitle="Thống kê tổng hợp hệ thống"
        icon="bar-chart"
      />
      {overviewData ? (
        <>
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Số lớp</h5>
                  <p className="card-text">{overviewData.totalClasses}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Số giáo viên</h5>
                  <p className="card-text">{overviewData.totalTeachers}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Số sinh viên</h5>
                  <p className="card-text">{overviewData.totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Tổng điểm danh</h5>
                  <p className="card-text">
                    {overviewData.attendanceSummary.present +
                      overviewData.attendanceSummary.late +
                      overviewData.attendanceSummary.absent}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        </>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
      <HustFooter />
    </div>
  );
}

export default AdminReportPage;
