// src/pages/teacher/TeacherDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col, Button, Typography } from "antd";
import { ApartmentOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";

const { Content } = Layout;
const { Title } = Typography;

export default function TeacherDashboardPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch(console.error);
  }, []);

  return (
    <Layout className="min-h-screen">
      <Content className="container mx-auto py-6">
        <HustHeader
          title="Teacher Dashboard"
          subtitle="Danh sách lớp bạn phụ trách"
          icon={<ApartmentOutlined />}
        />

        <Row gutter={[16, 16]} className="mt-4">
          {classes.map((c) => (
            <Col key={c.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={c.ten_lop}
                bordered={false}
                className="h-full"
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/teacher/class/${c.id}`)}
                  >
                    Chi tiết
                  </Button>,
                  <Button
                    type="link"
                    icon={<BarChartOutlined />}
                    onClick={() => navigate(`/teacher/report/${c.id}`)}
                  >
                    Báo cáo
                  </Button>,
                ]}
              >
                <p>Môn học: {c.Subject?.ten_mon || "N/A"}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      <HustFooter />
    </Layout>
  );
}
