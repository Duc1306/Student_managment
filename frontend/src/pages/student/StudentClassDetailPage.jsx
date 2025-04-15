import React, { useEffect, useState } from "react";
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

// Đăng ký các thành phần cần thiết của ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function StudentClassDetailPage() {
  const { id } = useParams(); // ID của lớp
  const [classDetail, setClassDetail] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });

  // Lấy thông tin chi tiết lớp (bao gồm: tên lớp, môn, GV, danh sách học sinh)
  const fetchClassDetail = async () => {
    try {
      const res = await api.get(`/classes/${id}/students`);
      setClassDetail(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Lỗi tải thông tin lớp");
    }
  };

  // Lấy điểm danh của học sinh cho lớp đó
  const fetchAttendanceRecords = async () => {
    try {
      // Với role student, endpoint GET /attendance sẽ tự động lọc theo student_id, chỉ lấy điểm danh của học sinh đó
      const res = await api.get("/attendance", { params: { classId: id } });
      setAttendanceRecords(res.data);

      // Tổng hợp số lượng theo trạng thái
      const summary = { present: 0, late: 0, absent: 0 };
      res.data.forEach((record) => {
        summary[record.status] = (summary[record.status] || 0) + 1;
      });
      setAttendanceSummary(summary);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải thông tin điểm danh");
    }
  };

  useEffect(() => {
    fetchClassDetail();
    fetchAttendanceRecords();
  }, [id]);

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: ["Có mặt", "Muộn", "Vắng"],
    datasets: [
      {
        label: "Số lượt điểm danh",
        data: [
          attendanceSummary.present,
          attendanceSummary.late,
          attendanceSummary.absent,
        ],
        backgroundColor: ["green", "orange", "red"],
      },
    ],
  };

  return (
    <div className="container my-4">
      <HustHeader
        title={`Lớp: ${classDetail ? classDetail.className : "Đang tải..."}`}
        subtitle={
          classDetail
            ? `Môn: ${classDetail.subject} | GV: ${classDetail.teacher}`
            : ""
        }
        icon="clipboard-data"
      />

      {/* Hiển thị danh sách học sinh của lớp */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Danh sách học sinh</h5>
          {classDetail &&
          classDetail.students &&
          classDetail.students.length > 0 ? (
            <ul className="list-group">
              {classDetail.students.map((student) => (
                <li key={student.id} className="list-group-item">
                  {student.ho_ten} ({student.ma_sinh_vien})
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có dữ liệu học sinh.</p>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Danh sách điểm danh cá nhân (chi tiết)</h5>
          {attendanceRecords && attendanceRecords.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Lớp</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((att, idx) => (
                  <tr key={idx}>
                    <td>{att.date}</td>
                    <td>{att.Class ? att.Class.ten_lop : ""}</td>
                    <td>
                      <span
                        className={`badge ${
                          att.status === "present"
                            ? "bg-success"
                            : att.status === "late"
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                      >
                        {att.status === "present"
                          ? "Có mặt"
                          : att.status === "late"
                          ? "Muộn"
                          : "Vắng"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không có dữ liệu điểm danh chi tiết.</p>
          )}
        </div>
      </div>

      {/* Hiển thị biểu đồ số lượng điểm danh của học sinh tại lớp đó */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Thông tin điểm danh của bạn</h5>
          <p>
            Có mặt: {attendanceSummary.present} lượt, Muộn:{" "}
            {attendanceSummary.late} lượt, Vắng: {attendanceSummary.absent} lượt
          </p>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </div>

      <HustFooter />
    </div>
  );
}

export default StudentClassDetailPage;
