import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, theme } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
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
import api from "../../api";
import HustHeader from "../../components/layout/HustHeader";
import HustFooter from "../../components/layout/HustFooter";

function AdminReportPage() {
  const [overviewData, setOverviewData] = useState(null);
  const { token } = theme.useToken();

  useEffect(() => {
    api
      .get("/reports/overview")
      .then((res) => setOverviewData(res.data))
      .catch(console.error);
  }, []);

  // Chuẩn bị data cho Recharts
  const chartData = overviewData
    ? [
        { name: "Có mặt", value: overviewData.attendanceSummary.present },
        
        { name: "Vắng", value: overviewData.attendanceSummary.absent },
      ]
    : [];

  // Dùng token màu từ Ant Design để làm màu thanh
  const colors = [token.colorSuccess, token.colorWarning, token.colorError];

  return (
    <div className="container mx-auto py-6">
      <HustHeader
        title="Báo cáo tổng quan"
        subtitle="Thống kê tổng hợp hệ thống"
        icon={<BarChartOutlined />}
      />

      {overviewData ? (
        <>
          <Row gutter={[16, 16]} className="my-6">
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Số lớp"
                  value={overviewData.totalClasses}
                  prefix={<ApartmentOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Số giáo viên"
                  value={overviewData.totalTeachers}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Số sinh viên"
                  value={overviewData.totalStudents}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Tổng điểm danh"
                  value={
                    overviewData.attendanceSummary.present +
                    
                    overviewData.attendanceSummary.absent
                  }
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card className="shadow">
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
        </>
      ) : (
        <p className="mt-6">Đang tải dữ liệu...</p>
      )}

      <HustFooter />
    </div>
  );
}

export default AdminReportPage;
