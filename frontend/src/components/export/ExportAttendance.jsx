// src/components/ExportAttendance.jsx
import React from "react";
import api from "../../api";

function ExportAttendance({ classId, date }) {
  const handleExport = async () => {
    if (!classId || !date) {
      return alert("Vui lòng chọn lớp và ngày điểm danh");
    }
    try {
      const res = await api.get("/attendance/export", {
        params: { classId, date },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Lỗi export attendance");
    }
  };

  return (
    <button className="btn btn-success" onClick={handleExport}>
      Export Attendance
    </button>
  );
}

export default ExportAttendance;
