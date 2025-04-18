// src/components/import/ImportStudents.jsx
import React from "react";
import { Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api";

const { Text } = Typography;

/**

 * @param {string|number} classId - ID lớp để import data
 * @param {Function} onImportSuccess - Callback sau khi import thành công
 */
export default function ImportStudents({ classId, onImportSuccess }) {
  const [messageApi, contextHolder] = message.useMessage();
  const uploadProps = {
    accept: ".xlsx,.xls",
    showUploadList: false,
    beforeUpload: (file) => {
      if (!classId) {
        messageApi.error("Chưa xác định được lớp để import.");
        return Upload.LIST_IGNORE;
      }
      const formData = new FormData();
      formData.append("file", file);
      api
        .post(`/classes/${classId}/import`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          messageApi.success("Import sinh viên thành công!");
          onImportSuccess();
        })
        .catch((err) => {
          console.error(err);
          messageApi.error(err.response?.data?.error || "Import thất bại");
        });
      // Trả về false để ngăn Upload tự gửi request
      return false;
    },
  };

  return (
    <>
    {contextHolder}
    <div className="mb-4">
      <Text strong className="block mb-2">
        Import sinh viên vào lớp
      </Text>
      <Upload {...uploadProps}>
        <Button type="primary" icon={<UploadOutlined />}>
          Chọn file & Import
        </Button>
      </Upload>
    </div>
    </>
  );
}
