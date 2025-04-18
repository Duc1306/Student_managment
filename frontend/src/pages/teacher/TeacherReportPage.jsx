// src/pages/teacher/TeacherReportPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Layout, Card, DatePicker, Row, Col, Typography, message ,Form} from "antd";
import { Bar } from "react-chartjs-2";
import { CalendarOutlined } from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const { Content } = Layout;
const { Title, Text } = Typography;

export default function TeacherReportPage() {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [date, setDate] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const params = { classId: id };
    if (date) {
      params.date = date.format("YYYY-MM-DD");
    }
    api
      .get("/attendance/report", { params })
      .then((res) => setReportData(res.data))
      .catch((err) => {
        console.error(err);
        messageApi.error("Lỗi tải báo cáo");
      });
  }, [id, date]);

  const chartData = {
    labels: ["Có mặt", "Muộn", "Vắng"],
    datasets: [
      {
        label: "Số lượt điểm danh",
        data: reportData
          ? [reportData.present, reportData.late, reportData.absent]
          : [],
        backgroundColor: ["#52c41a", "#faad14", "#f5222d"],
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Content className="container mx-auto py-6">
        <HustHeader
          title="Báo cáo điểm danh"
          subtitle={`Lớp ${id} - ${
            date ? date.format("DD-MM-YYYY") : "Tổng hợp"
          }`}
          icon={<CalendarOutlined />}
        />

        <Card className="mb-6">
          <Form layout="inline">
            <Form.Item label="Chọn ngày">
              <DatePicker allowClear onChange={(d) => setDate(d)} />
            </Form.Item>
          </Form>
        </Card>

        {reportData ? (
          <Card>
            <Row gutter={[16, 16]} className="mb-6">
              <Col>
                <Title level={5}>Có mặt: {reportData.present}</Title>
              </Col>
              <Col>
                <Title level={5}>Muộn: {reportData.late}</Title>
              </Col>
              <Col>
                <Title level={5}>Vắng: {reportData.absent}</Title>
              </Col>
            </Row>
            <Bar data={chartData} options={{ responsive: true }} />
          </Card>
        ) : (
          <Text>Đang tải dữ liệu báo cáo...</Text>
        )}

        <HustFooter />
      </Content>
    </Layout>
  );
}
