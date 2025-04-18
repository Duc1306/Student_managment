// src/components/ExportAttendance.jsx
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "../../api";

function ExportAttendance({ classId, date }) {
   const [messageApi, contextHolder] = message.useMessage();
  const handleExport = async () => {
    if (!classId || !date) {
      return messageApi.error("Vui lòng chọn lớp và ngày điểm danh");
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
      messageApi.error("Lỗi export attendance");
    }
  };

  return (
    <>
    {contextHolder}
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleExport}
      className="bg-green-600 border-green-600 hover:bg-green-700"
    >
      Xuất điểm danh
    </Button>
    </> 
  );
}

export default ExportAttendance;
