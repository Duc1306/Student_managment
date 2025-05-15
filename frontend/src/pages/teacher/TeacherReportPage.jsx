// src/pages/teacher/TeacherReportPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Layout,
  Card,
  DatePicker,
  Table,
  Tag,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { CalendarOutlined, SaveOutlined } from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";

const { Content } = Layout;

export default function TeacherReportPage() {
  const { id: classId } = useParams();
  const [date, setDate] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch attendance when date changes
  useEffect(() => {
    if (!date) return;
    fetchAttendance();
  }, [date]);

  // Load attendance records from backend
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance", {
        params: {
          classId,
          date: date.format("YYYY-MM-DD"),
        },
      });
      setAttendanceRecords(res.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi tải danh sách điểm danh");
    }
  };

  // Toggle status present <-> absent
  const handleToggleStatus = (id) => {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "present" ? "absent" : "present",
              // Clear reason when switching to present
              reason: r.status === "present" ? "" : r.reason,
            }
          : r
      )
    );
  };

  // Update reason locally
  const handleReasonChange = (id, value) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reason: value } : r))
    );
  };

  // Save a single record on blur
  const handleSingleSave = async (id) => {
    const rec = attendanceRecords.find((r) => r.id === id);
    if (!rec) return;
    try {
      await api.put(`/attendance/${id}`, {
        status: rec.status,
        reason: rec.status === "absent" ? rec.reason : "",
      });
      messageApi.success("Lý do đã được lưu");
    } catch (err) {
      console.error(err);
      messageApi.error("Không lưu được lý do");
    }
  };

  // Bulk save all changes
  const handleSaveChanges = async () => {
    try {
      await Promise.all(
        attendanceRecords.map((r) =>
          api.put(`/attendance/${r.id}`, {
            status: r.status,
            reason: r.status === "absent" ? r.reason : "",
          })
        )
      );
      messageApi.success("Cập nhật điểm danh thành công!");
      fetchAttendance();
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi lưu thay đổi");
    }
  };

  const columns = [
    {
      title: "Sinh viên",
      key: "student",
      render: (_, record) =>
        record.Student ? (
          <span>
            {record.Student.ho_ten} ({record.Student.ma_sinh_vien})
          </span>
        ) : (
          "–"
        ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const isPresent = record.status === "present";
        return (
          <Tag
            color={isPresent ? "green" : "red"}
            style={{ cursor: "pointer" }}
            onClick={() => handleToggleStatus(record.id)}
          >
            {isPresent ? "Có mặt" : "Vắng"}
          </Tag>
        );
      },
    },
    {
      title: "Lý do (nếu vắng)",
      dataIndex: "reason",
      key: "reason",
      render: (reason, record) =>
        record.status === "absent" ? (
          <Input
            value={reason}
            placeholder="Nhập lý do"
            onChange={(e) => handleReasonChange(record.id, e.target.value)}
            onBlur={() => handleSingleSave(record.id)}
          />
        ) : (
          <span>–</span>
        ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Content className="container mx-auto py-6">
        <HustHeader
          title="Báo cáo điểm danh"
          subtitle={`Lớp ${classId}${
            date ? ` - ${date.format("DD-MM-YYYY")}` : ""
          }`}
          icon={<CalendarOutlined />}
        />

        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col>
              <DatePicker
                allowClear={false}
                value={date}
                onChange={(d) => setDate(d || dayjs())}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                disabled={!date}
                onClick={handleSaveChanges}
              >
                Lưu thay đổi
              </Button>
            </Col>
          </Row>
        </Card>

        {date && (
          <Card title="Chi tiết điểm danh">
            <Table
              dataSource={attendanceRecords}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        )}
      </Content>
      <HustFooter />
    </Layout>
  );
}
