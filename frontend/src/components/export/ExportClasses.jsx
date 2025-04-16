import React from "react";
 import api from "../../api";

    function ExportClasses() {
      const handleExport = async () => {
        try {
          const res = await api.get("/classes/export", {
            responseType: "blob",
          });
          // Tạo link và mở file
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "class_list.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error(error);
          alert("Lỗi export dữ liệu");
        }
      };

      return (
        <button className="btn btn-success" onClick={handleExport}>
          Export danh sách lớp
        </button>
      );
    }

    export default ExportClasses;
