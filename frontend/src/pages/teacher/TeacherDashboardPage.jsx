import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";

function TeacherDashboardPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes"); // Giả sử teacher => trả về lớp dạy
      setClasses(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải danh sách lớp");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDetail = (classId) => {
    navigate(`/teacher/class/${classId}`);
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <HustHeader
        title="Teacher Dashboard"
        subtitle="Xem danh sách lớp đang phụ trách"
        icon="person-workspace" /* icon = "bi bi-person-workspace" */
      />

      <div className="card mb-4">
        <div className="card-body">
          <h5>
            <i className="bi bi-grid me-1"></i>Danh sách lớp dạy
          </h5>
          {classes.length === 0 ? (
            <p className="text-muted">Không có lớp nào.</p>
          ) : (
            <div className="row">
              {classes.map((c) => (
                <div className="col-md-4 mb-3" key={c.id}>
                  <div className="card card-highlight h-100">
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{c.ten_lop}</h6>
                      <p className="card-text flex-grow-1">
                        Môn: {c.Subject ? c.Subject.ten_mon : "N/A"}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => navigate(`/teacher/class/${c.id}`)}
                        >
                          <i className="bi bi-arrow-right-circle me-1"></i>
                          Xem chi tiết
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => navigate(`/teacher/report/${c.id}`)}
                        >
                          <i className="bi bi-bar-chart me-1"></i>
                          Báo cáo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <HustFooter />
    </div>
  );
}

export default TeacherDashboardPage;
