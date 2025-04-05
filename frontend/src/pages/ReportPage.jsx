
import React, { useState } from "react";
import api from "../api";

function ReportPage() {
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState("");
  const [report, setReport] = useState(null);

  const handleGetReport = async () => {
    try {
      const res = await api.get("/attendance/report", {
        params: { classId, date },
      });
      setReport(res.data); // { present, absent, late }
    } catch (error) {
      alert("Lỗi report");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Báo Cáo Điểm Danh</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Lớp (ID)</label>
          <input
            className="form-control"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>Ngày</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary" onClick={handleGetReport}>
            Xem Báo Cáo
          </button>
        </div>
      </div>
      {report && (
        <div>
          <h4>Kết quả</h4>
          <p>Có mặt: {report.present}</p>
          <p>Vắng: {report.absent}</p>
          <p>Muộn: {report.late}</p>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
