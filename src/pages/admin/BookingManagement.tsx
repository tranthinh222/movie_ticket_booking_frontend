import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Typography,
  message,
  Divider,
  Select,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import bookingApi from "../../services/api-booking";

const { Title, Text } = Typography;

interface User {
  id: number;
  name: string;
}

interface Seat {
  id: number;
  seatRow: string;
  number: number;
  price: number;
}

interface Showtime {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  auditoriumNumber: string;
}

interface Film {
  id: number;
  name: string;
  director: string;
  actors: string;
  duration: number;
  description: string;
  genre: string;
  language: string;
  releaseDate: string;
  status: string;
  thumbnail: string;
}

interface Theater {
  id: number;
  name: string;
  address: string;
}

interface Booking {
  id: number;
  user: User;
  status: string;
  total_price: number | null;
  qrCode: string | null;
  seats: Seat[];
  showtime: Showtime;
  film: Film;
  theater: Theater;
  paymentId: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

const SIZE = 10;

const statusTag = (status: string) => {
  if (status === "CONFIRMED" || status === "COMPLETED")
    return <Tag color="green">{status}</Tag>;
  if (status === "FAILED" || status === "CANCELLED")
    return <Tag color="red">{status}</Tag>;
  return <Tag color="gold">{status || "PENDING"}</Tag>;
};

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getAllBooking(currentPage, SIZE);
      setBookings(res.data.data);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch {
      message.error("Lỗi tải danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setLoading(true);
      await bookingApi.updateBooking(id, status);
      message.success(`Cập nhật trạng thái thành ${status} thành công!`);
      fetchBookings();
      // Update selected booking if modal is open
      if (selected && selected.id === id) {
        setSelected({ ...selected, status });
      }
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const columns = [
    {
      title: "Đơn đặt vé",
      key: "booking",
      render: (_: unknown, record: Booking) => (
        <Space>
          <ShoppingCartOutlined style={{ color: "#1677ff" }} />
          <div>
            <div style={{ fontWeight: 600 }}>#{record.id}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.createdAt}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Phim & Suất chiếu",
      key: "film",
      render: (_: unknown, record: Booking) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.film?.name}</div>
          <Space
            split={<Divider type="vertical" />}
            style={{ fontSize: "12px" }}
          >
            <Text type="secondary">
              <CalendarOutlined /> {record.showtime?.date}
            </Text>
            <Text type="secondary">{record.showtime?.startTime}</Text>
            <Text type="secondary">
              Phòng {record.showtime?.auditoriumNumber}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "Người dùng",
      key: "user",
      render: (_: unknown, record: Booking) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.user?.name || "N/A"}</div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.createdBy}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_: unknown, record: Booking) => (
        <Select
          value={record.status || "PENDING"}
          onChange={(value) => handleUpdateStatus(record.id, value)}
          style={{ width: 130 }}
          disabled={record.status !== "PENDING"}
          options={[
            { value: "PENDING", label: <Tag color="gold">PENDING</Tag> },
            { value: "CONFIRMED", label: <Tag color="green">CONFIRMED</Tag> },
          ]}
        />
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      width: 130,
      render: (value: number | null) =>
        value !== null
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value)
          : "—",
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_: unknown, record: Booking) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => setSelected(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Đặt vé
          </Title>
          <Text type="secondary">Quản lý đơn đặt vé và thanh toán</Text>
        </div>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={bookings}
        columns={columns}
        pagination={false}
        bordered
      />

      {/* PAGINATION */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Space>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Trước
          </Button>

          <Text>
            Trang {currentPage} / {totalPages}
          </Text>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Sau
          </Button>
        </Space>
      </div>

      {/* MODAL BOOKING DETAILS */}
      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={[
          <Popconfirm
            key="confirm"
            title="Xác nhận booking"
            description="Bạn có chắc muốn xác nhận booking này?"
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() =>
              selected && handleUpdateStatus(selected.id, "CONFIRMED")
            }
            disabled={selected?.status === "CONFIRMED"}
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              disabled={selected?.status === "CONFIRMED"}
            >
              {selected?.status === "CONFIRMED"
                ? "Đã xác nhận"
                : "Xác nhận Booking"}
            </Button>
          </Popconfirm>,
          <Button key="close" onClick={() => setSelected(null)}>
            Close
          </Button>,
        ]}
        title={`Booking Details #${selected?.id}`}
        width={700}
        destroyOnClose
      >
        {selected && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
              <div style={{ flex: "0 0 140px" }}>
                <img
                  src={selected.film?.thumbnail}
                  alt={selected.film?.name}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                  {selected.film?.name}
                </Title>
                <div style={{ marginBottom: 16 }}>
                  {statusTag(selected.status)}
                </div>
                <Space direction="vertical" size={4}>
                  <Text>
                    <CalendarOutlined /> {selected.showtime?.date} |{" "}
                    {selected.showtime?.startTime} -{" "}
                    {selected.showtime?.endTime}
                  </Text>
                  <Text>
                    <EnvironmentOutlined /> {selected.theater?.name} -{" "}
                    {selected.theater?.address}
                  </Text>
                  <Text type="secondary">
                    Auditorium: {selected.showtime?.auditoriumNumber}
                  </Text>
                </Space>
              </div>
              {selected.qrCode && (
                <div style={{ flex: "0 0 120px", textAlign: "right" }}>
                  <img
                    src={`data:image/png;base64,${selected.qrCode}`}
                    alt="Booking QR"
                    style={{ width: "100%", border: "1px solid #f0f0f0" }}
                  />
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    Scan at entrance
                  </Text>
                </div>
              )}
            </div>

            <Divider>Booking Information</Divider>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <Text type="secondary">User</Text>
                <div style={{ fontWeight: 500 }}>
                  {selected.user?.name || "N/A"}
                </div>
                <Text style={{ fontSize: 12 }} type="secondary">
                  ID: {selected.user?.id}
                </Text>
              </div>
              <div>
                <Text type="secondary">Payment ID</Text>
                <div style={{ fontWeight: 500 }}>#{selected.paymentId}</div>
              </div>
              <div>
                <Text type="secondary">Created At</Text>
                <div>{selected.createdAt}</div>
              </div>
              <div>
                <Text type="secondary">Created By</Text>
                <div>{selected.createdBy}</div>
              </div>
            </div>

            <Divider>Seats & Payment</Divider>
            <div
              style={{
                background: "#fafafa",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Seats: </Text>
                <Space wrap>
                  {selected.seats?.map((seat) => (
                    <Tag key={seat.id} color="blue">
                      {seat.seatRow}
                      {seat.number}
                    </Tag>
                  ))}
                </Space>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Text type="secondary">Total Amount:</Text>
                <Text
                  style={{ fontSize: 20, fontWeight: 700, color: "#f5222d" }}
                >
                  {selected.total_price !== null
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(selected.total_price)
                    : "—"}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
