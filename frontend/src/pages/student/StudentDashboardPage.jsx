// src/pages/student/StudentDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { ApartmentOutlined } from "@ant-design/icons";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";
import api from "../../api";

const { Title } = Typography;

export function StudentDashboardPage() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <HustHeader title="Dashboard Sinh viên" icon={<ApartmentOutlined />} />

      <Row gutter={[16, 16]}>
        {classes.map((cls) => (
          <Col key={cls.id} xs={24} sm={12} md={8} lg={6}>
            <Card title={cls.ten_lop} bordered={false} className="h-full">
              <p>Môn: {cls.Subject?.ten_mon}</p>
              <Link to={`/student/class/${cls.id}`}>
                <Button type="primary">Xem chi tiết lớp</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      <HustFooter />
    </div>
  );
}
export default StudentDashboardPage