import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Spin,
  Progress,
  Select,
  Divider,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  BankOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import userApi from "../../services/api-user";
import bookingApi from "../../services/api-booking";
import filmApi from "../../services/api-film";
import showtimeApi from "../../services/api-showtime";
import theaterApi from "../../services/api-theater";
import addressApi from "../../services/api-address";

const { Title, Text } = Typography;

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const months = [
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
];

const years = Array.from({ length: 5 }, (_, i) => ({
  value: currentYear - 2 + i,
  label: `${currentYear - 2 + i}`,
}));

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalFilms: 0,
    totalShowtimes: 0,
    totalTheaters: 0,
    totalAddresses: 0,
  });

  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
  });

  // Fetch basic stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          usersRes,
          bookingsRes,
          filmsRes,
          showtimesRes,
          theatersRes,
          addressRes,
        ] = await Promise.all([
          userApi.getAllUsers(),
          bookingApi.getAllBooking(),
          filmApi.getAllFilms(),
          showtimeApi.getAllShowTimes(),
          theaterApi.getAllTheaters(),
          addressApi.getAllAddresses(),
        ]);

        setStats({
          totalUsers:
            usersRes.data.meta?.totalItems || usersRes.data.data?.length || 0,
          totalBookings:
            bookingsRes.data.meta?.totalItems ||
            bookingsRes.data.data?.length ||
            0,
          totalFilms:
            filmsRes.data.meta?.totalItems || filmsRes.data.data?.length || 0,
          totalShowtimes:
            showtimesRes.data.meta?.totalItems ||
            showtimesRes.data.data?.length ||
            0,
          totalTheaters:
            theatersRes.data.meta?.totalItems ||
            theatersRes.data.data?.length ||
            0,
          totalAddresses:
            addressRes.data.meta?.totalItems ||
            addressRes.data.data?.length ||
            0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setRevenueLoading(true);
        const res = await bookingApi.getTotalRevenue(
          selectedMonth,
          selectedYear
        );
        setRevenueData({
          totalRevenue: res.data.totalRevenue || 0,
          totalBookings: res.data.totalBookings || 0,
        });
      } catch (err) {
        console.error("Error fetching revenue:", err);
        setRevenueData({ totalRevenue: 0, totalBookings: 0 });
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenue();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: 48,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const total =
    stats.totalUsers +
    stats.totalBookings +
    stats.totalFilms +
    stats.totalShowtimes +
    stats.totalTheaters +
    stats.totalAddresses;

  const chartData = [
    { label: "Người dùng", value: stats.totalUsers, color: "#1890ff" },
    { label: "Đơn đặt vé", value: stats.totalBookings, color: "#52c41a" },
    { label: "Phim", value: stats.totalFilms, color: "#faad14" },
    { label: "Suất chiếu", value: stats.totalShowtimes, color: "#eb2f96" },
    { label: "Rạp chiếu", value: stats.totalTheaters, color: "#722ed1" },
    { label: "Địa chỉ", value: stats.totalAddresses, color: "#13c2c2" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div style={{ padding: 24, width: "100%" }}>
      {/* HEADER */}
      <Space direction="vertical" size={4} style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">Thống kê tổng quan hệ thống</Text>
      </Space>

      {/* REVENUE SECTION */}
      <Card
        title={
          <Space>
            <DollarOutlined style={{ color: "#52c41a" }} />
            <span>Doanh thu</span>
          </Space>
        }
        extra={
          <Space>
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={months}
              style={{ width: 120 }}
            />
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              options={years}
              style={{ width: 100 }}
            />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Spin spinning={revenueLoading}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <Statistic
                title="Tổng doanh thu"
                value={revenueData.totalRevenue}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: "#52c41a", fontSize: 28 }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Số đơn đặt vé trong tháng"
                value={revenueData.totalBookings}
                valueStyle={{ color: "#1890ff", fontSize: 28 }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>

      <Divider />

      {/* KPI CARDS */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Thống kê tổng hợp
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Tổng đơn đặt vé"
              value={stats.totalBookings}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Tổng số phim"
              value={stats.totalFilms}
              prefix={<VideoCameraOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Tổng suất chiếu"
              value={stats.totalShowtimes}
              prefix={<CalendarOutlined style={{ color: "#eb2f96" }} />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Tổng rạp chiếu"
              value={stats.totalTheaters}
              prefix={<BankOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Tổng địa chỉ"
              value={stats.totalAddresses}
              prefix={<EnvironmentOutlined style={{ color: "#13c2c2" }} />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
      </Row>

      {/* CHART SECTION */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Biểu đồ phân bố dữ liệu">
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              {chartData.map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text>{item.label}</Text>
                    <Text strong>{item.value}</Text>
                  </div>
                  <Progress
                    percent={
                      total > 0 ? Math.round((item.value / total) * 100) : 0
                    }
                    strokeColor={item.color}
                    showInfo={true}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
