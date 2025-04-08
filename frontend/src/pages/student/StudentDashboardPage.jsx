
import React, { useEffect, useState } from "react";
import api from "../../api";

function StudentDashboardPage() {
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Lấy danh sách lớp
    api
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
    // Lấy danh sách attendance (của student)
    api
      .get("/attendance")
      .then((res) => setAttendance(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container my-4">
      <h2>Sinh viên Dashboard</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5>Các lớp đang học</h5>
          <div className="row">
            {classes.map((cls) => (
              <div className="col-md-4 mb-3" key={cls.id}>
                <div className="card card-highlight">
                  <div className="card-body">
                    <h6 className="card-title">{cls.ten_lop}</h6>
                    <p className="card-text">
                      Môn: {cls.Subject ? cls.Subject.ten_mon : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>Thông tin điểm danh</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Lớp</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.date}</td>
                  <td>{a.Class ? a.Class.ten_lop : ""}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "present"
                          ? "bg-success"
                          : a.status === "late"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {a.status === "present"
                        ? "Có mặt"
                        : a.status === "late"
                        ? "Muộn"
                        : "Vắng"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
