import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../store/useAuth";
import { useEffect } from "react";
import { Layout, Menu, Avatar, Spin, Button, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  PushpinOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Text } = Typography;

// Sidebar menu items
const menuItems: MenuProps["items"] = [
  { key: "/admin", icon: <HomeOutlined />, label: "Tổng quan" },
  { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
  { key: "/admin/theaters", icon: <EnvironmentOutlined />, label: "Rạp chiếu" },
  {
    key: "/admin/auditoriums",
    icon: <AppstoreOutlined />,
    label: "Phòng chiếu",
  },
  { key: "/admin/films", icon: <VideoCameraOutlined />, label: "Phim" },
  { key: "/admin/showtimes", icon: <ScheduleOutlined />, label: "Suất chiếu" },
  { key: "/admin/addresses", icon: <PushpinOutlined />, label: "Địa chỉ" },
  { key: "/admin/bookings", icon: <FileTextOutlined />, label: "Đặt vé" },
];

const AdminLayout: React.FC = () => {
  const { user, authenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isLoading && (!authenticated || !user)) {
      navigate("/login");
    }
    if (!isLoading && authenticated && user && user.role !== "ADMIN") {
      navigate("/");
    }
  }, [isLoading, authenticated, user, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  // Handle menu click navigation
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  // Determine selected key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    // Exact match for /admin
    if (path === "/admin") return ["/admin"];
    // Find matching menu item
    const matchedItem = menuItems?.find(
      (item) => item?.key !== "/admin" && path.startsWith(item?.key as string)
    );
    return matchedItem ? [matchedItem.key as string] : ["/admin"];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={256}
        theme="light"
        style={{
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header with back button */}
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
              style={{ color: "#595959" }}
            >
              Về trang chủ
            </Button>
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            onClick={handleMenuClick}
            items={menuItems}
            style={{
              flex: 1,
              borderRight: "none",
              marginTop: 8,
            }}
          />

          {/* User Profile */}
          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Avatar
              size={32}
              src={user.avatar}
              style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
            >
              {!user.avatar && (user.username?.charAt(0).toUpperCase() || "A")}
            </Avatar>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <Text
                strong
                style={{
                  display: "block",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.username}
              </Text>
              <Text
                type="secondary"
                style={{
                  display: "block",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </Text>
            </div>
          </div>
        </div>
      </Sider>

      {/* Main Content Area */}
      <Content
        style={{
          background: "#f5f5f5",
          padding: 24,
          overflow: "auto",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default AdminLayout;
