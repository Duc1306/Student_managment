// src/components/ExportClasses.jsx
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "../../api";

function ExportClasses() {
   const [messageApi, contextHolder] = message.useMessage();
  const handleExport = async () => {
    try {
      const res = await api.get("/classes/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "class_list.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      messageApi.error("Lỗi export dữ liệu");
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
      Xuất danh sách lớp
    </Button>
    </>
  );
}

export default ExportClasses ;
