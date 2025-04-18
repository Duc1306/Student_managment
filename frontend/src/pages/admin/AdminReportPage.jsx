import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, theme } from "antd";
import { Bar } from "react-chartjs-2";
import {
  BookOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
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

  const chartData = {
    labels: ["Có mặt", "Muộn", "Vắng"],
    datasets: [
      {
        label: "Số lượt điểm danh",
        data: overviewData
          ? [
              overviewData.attendanceSummary.present,
              overviewData.attendanceSummary.late,
              overviewData.attendanceSummary.absent,
            ]
          : [],
        backgroundColor: [
          token.colorSuccess,
          token.colorWarning,
          token.colorError,
        ],
      },
    ],
  };

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
                    overviewData.attendanceSummary.late +
                    overviewData.attendanceSummary.absent
                  }
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card className="shadow">
            <Bar data={chartData} options={{ responsive: true }} />
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
