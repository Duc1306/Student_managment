import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, List, Table, Tag, Typography, Row, Col } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";
import { CalendarOutlined } from "@ant-design/icons";

const { Title } = Typography;

export function StudentClassDetailPage() {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/classes/${id}/students`);
        setClassDetail(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/attendance", { params: { classId: id } });
        setAttendanceRecords(res.data);
        const summary = { present: 0, late: 0, absent: 0 };
        res.data.forEach((rec) => {
          summary[rec.status] += 1;
        });
        setAttendanceSummary(summary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
    fetchAttendance();
  }, [id]);

  const columns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    {
      title: "Lớp",
      dataIndex: ["Class", "ten_lop"],
      key: "class",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "present" ? "green" : status === "late" ? "orange" : "red";
        const text =
          status === "present" ? "Có mặt" : status === "late" ? "Muộn" : "Vắng";
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // Dữ liệu cho Recharts
  const chartData = [
    { name: "Có mặt", value: attendanceSummary.present },
    { name: "Muộn", value: attendanceSummary.late },
    { name: "Vắng", value: attendanceSummary.absent },
  ];
  const colors = ["#52c41a", "#faad14", "#f5222d"];

  return (
    <div className="container mx-auto py-6">
      <HustHeader
        title={`Lớp: ${classDetail?.className || "Đang tải..."}`}
        subtitle={
          classDetail
            ? `Môn: ${classDetail.subject} | GV: ${classDetail.teacher}`
            : ""
        }
        icon={<CalendarOutlined />}
      />

      <Card title="Danh sách học sinh" className="mb-6">
        {classDetail?.students?.length ? (
          <List
            dataSource={classDetail.students}
            renderItem={(stu) => (
              <List.Item>
                {stu.ho_ten} ({stu.ma_sinh_vien})
              </List.Item>
            )}
          />
        ) : (
          <p>Không có dữ liệu học sinh.</p>
        )}
      </Card>

      <Card title="Chi tiết điểm danh" className="mb-6">
        <Table
          dataSource={attendanceRecords}
          columns={columns}
          rowKey={(rec, idx) => idx}
          pagination={false}
        />
      </Card>

      <Card title="Biểu đồ điểm danh của bạn" className="mb-6">
        <Row gutter={16} className="mb-4">
          <Col>
            <Title level={5}>Có mặt: {attendanceSummary.present}</Title>
          </Col>
          <Col>
            <Title level={5}>Muộn: {attendanceSummary.late}</Title>
          </Col>
          <Col>
            <Title level={5}>Vắng: {attendanceSummary.absent}</Title>
          </Col>
        </Row>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <HustFooter />
    </div>
  );
}

export default StudentClassDetailPage;
