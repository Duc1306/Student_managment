// frontend/src/components/import/ImportStudents.jsx
import React, { useState } from "react";
import api from "../../api";

function ImportStudents({ classId, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleImport = async () => {
    if (!file) return alert("Vui lòng chọn file Excel");
    const formData = new FormData();
    formData.append("file", file);
    // Gọi đúng endpoint import vào lớp
    const res = await api.post(
      `/classes/${classId}/import`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    alert("Import thành công!");
    onImportSuccess(); // gọi callback
  };
  return (
    <div>
      <h5>Import sinh viên vào lớp</h5>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleImport}>
        Import
      </button>
    </div>
  );
}

export default ImportStudents;
