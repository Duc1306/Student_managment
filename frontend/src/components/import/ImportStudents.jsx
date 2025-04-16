import React, { useState } from "react";
import api from "../../api";

function ImportStudents(onImportSuccess) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return alert("Vui lòng chọn file Excel");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/students/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
      if (typeof onImportSuccess === "function") {
        onImportSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi import file");
    }
  };

  return (
    <div>
      <h5>Import danh sách sinh viên từ Excel</h5>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleImport}>
        Import
      </button>
    </div>
  );
}

export default ImportStudents;
