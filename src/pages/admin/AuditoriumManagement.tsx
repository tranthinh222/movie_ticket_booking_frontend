import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Card,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  BankOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import addressApi from "../../services/api-address";
import auditoriumApi from "../../services/api-auditorium";

const { Title, Text } = Typography;

interface Address {
  id: number;
  city: string;
  street_name: string;
  street_number: string;
}

interface Theater {
  id: number;
  name: string;
}

interface Auditorium {
  id: number;
  number: number;
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

const AuditoriumManagement: React.FC = () => {
  // Address & Theater cascade
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [theaterId, setTheaterId] = useState<number | null>(null);

  // Auditoriums
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();

  // Fetch addresses on mount
  const fetchAddresses = async () => {
    try {
      const res = await addressApi.getAllAddresses();
      setAddresses(res.data.data);
    } catch {
      message.error("Lỗi tải danh sách địa chỉ");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch theaters when address changes
  const handleAddressChange = async (id: number) => {
    setAddressId(id);
    setTheaterId(null);
    setTheaters([]);
    setAuditoriums([]);

    try {
      const res = await addressApi.getTheaterByAddress(id);
      setTheaters(res.data || []);
    } catch {
      message.error("Lỗi tải danh sách rạp");
    }
  };

  // Fetch auditoriums when theater changes
  const handleTheaterChange = async (id: number) => {
    setTheaterId(id);
    await fetchAuditoriums(id);
  };

  const fetchAuditoriums = async (id: number) => {
    try {
      setLoading(true);
      const res = await auditoriumApi.getAuditoriumsByTheater(id);
      setAuditoriums(res.data || []);
    } catch {
      message.error("Lỗi tải danh sách phòng chiếu");
    } finally {
      setLoading(false);
    }
  };

  // Delete auditorium
  const handleDelete = async (id: number) => {
    try {
      await auditoriumApi.deleteAuditorium(id);
      message.success("Xóa phòng chiếu thành công");
      if (theaterId) {
        fetchAuditoriums(theaterId);
      }
    } catch {
      message.error("Xóa phòng chiếu thất bại");
    }
  };

  // Create auditorium
  const handleCreate = async () => {
    if (!theaterId) {
      message.error("Vui lòng chọn rạp trước");
      return;
    }
    try {
      const values = await form.validateFields();
      await auditoriumApi.createAuditorium({
        number: values.number,
        theaterId: theaterId,
      });
      message.success("Tạo phòng chiếu thành công");
      setOpenCreate(false);
      form.resetFields();
      if (theaterId) {
        fetchAuditoriums(theaterId);
      }
    } catch {
      message.error("Tạo phòng chiếu thất bại");
    }
  };

  const columns = [
    {
      title: "Room",
      dataIndex: "number",
      key: "number",
      render: (num: number) => <Text strong>Phòng {num}</Text>,
    },
    {
      title: "Total Seats",
      dataIndex: "totalSeats",
      key: "totalSeats",
      render: (seats: number) => <Tag color="blue">{seats} seats</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, r: Auditorium) => (
        <Popconfirm
          title="Xóa phòng chiếu"
          description="Bạn có chắc muốn xóa phòng chiếu này?"
          icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          okText="Xóa"
          okButtonProps={{ danger: true }}
          cancelText="Hủy"
          onConfirm={() => handleDelete(r.id)}
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Auditoriums
          </Title>
          <Text type="secondary">
            Select address and theater to manage rooms
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!theaterId}
          onClick={() => setOpenCreate(true)}
        >
          New Auditorium
        </Button>
      </div>

      {/* CASCADE SELECTS */}
      <Card style={{ marginTop: 16 }}>
        <Space size="large">
          <Space>
            <EnvironmentOutlined style={{ color: "#1677ff" }} />
            <Select
              placeholder="Chọn khu vực"
              style={{ width: 240 }}
              value={addressId}
              onChange={handleAddressChange}
              options={addresses.map((a) => ({
                value: a.id,
                label: `${a.street_number} ${a.street_name}, ${a.city}`,
              }))}
            />
          </Space>

          <Space>
            <BankOutlined style={{ color: "#1677ff" }} />
            <Select
              placeholder="Chọn rạp"
              style={{ width: 240 }}
              value={theaterId}
              disabled={!addressId}
              onChange={handleTheaterChange}
              options={theaters.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
            />
          </Space>
        </Space>
      </Card>

      {/* AUDITORIUMS TABLE */}
      {theaterId && (
        <Card title="Danh sách phòng chiếu" style={{ marginTop: 24 }}>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={auditoriums}
            columns={columns}
            pagination={false}
            bordered
            locale={{
              emptyText: "Không có phòng chiếu nào",
            }}
          />
        </Card>
      )}

      {/* CREATE AUDITORIUM MODAL */}
      <Modal
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
          form.resetFields();
        }}
        title="Tạo phòng chiếu mới"
        okText="Tạo"
        cancelText="Hủy"
        onOk={handleCreate}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Số phòng"
            name="number"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
          >
            <Input placeholder="VD: Phòng 1,..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuditoriumManagement;
