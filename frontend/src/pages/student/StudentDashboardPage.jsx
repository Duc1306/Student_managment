
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
              <div key={cls.id} className="card mb-3">
                <div className="card-body">
                  <h6>{cls.ten_lop}</h6>
                  <p>Môn: {cls.Subject ? cls.Subject.ten_mon : ""}</p>
                  <Link
                    to={`/student/class/${cls.id}`}
                    className="btn btn-primary"
                  >
                    Xem chi tiết lớp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default StudentDashboardPage;
