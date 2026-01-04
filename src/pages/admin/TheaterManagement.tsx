import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Typography,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  BankOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import theaterApi from "../../services/api-theater";
import addressApi from "../../services/api-address";

const { Title, Text } = Typography;

interface Address {
  id: number;
  street_number: string;
  street_name: string;
  city: string;
}

interface Theater {
  id: number;
  name: string;
  address?: Address;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string;
  auditoriums?: unknown[];
}

const PAGE_SIZE = 5;

const TheaterManagement: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [form] = Form.useForm();

  const fetchTheaters = async () => {
    try {
      setLoading(true);

      const res = await theaterApi.getAllTheaters(currentPage, PAGE_SIZE);

      const apiData = res.data;

      setTheaters(apiData.data);
      setTotalPages(apiData.meta?.totalPages || 1);
    } catch (err) {
      console.error("Fetch theaters failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, [currentPage]);

  useEffect(() => {
    const fetchAllLocation = async () => {
      const response = await addressApi.getAllAddresses(1, 100);
      setAddresses(response.data.data);
    };
    fetchAllLocation();
  }, []);

  const handleCreateTheater = async () => {
    try {
      const values = await form.validateFields();
      const res = await theaterApi.createTheater(values.name, values.addressId);
      if (res.statusCode === 201) {
        message.success("Tạo rạp chiếu thành công!");
        fetchTheaters();
      } else {
        message.error("Tạo rạp chiếu thất bại");
      }
      setOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Validate failed:", err);
    }
  };

  const handleDeleteTheater = async (id: number) => {
    try {
      await theaterApi.removeTheater(id);
      message.success("Xóa rạp chiếu thành công!");
      fetchTheaters();
    } catch {
      message.error("Xóa rạp chiếu thất bại");
    }
  };

  const columns = [
    {
      title: "Rạp chiếu",
      key: "theater",
      render: (_: unknown, record: Theater) => (
        <Space>
          <BankOutlined style={{ color: "#1677ff" }} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <Text type="secondary">ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_: unknown, record: Theater) =>
        record.address ? (
          <div>
            <div>
              {record.address.street_number} {record.address.street_name}
            </div>
            <Text type="secondary">{record.address.city}</Text>
          </div>
        ) : (
          <Text type="secondary">N/A</Text>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      key: "action",
      align: "right" as const,
      render: (_: unknown, record: Theater) => (
        <Space>
          <Button icon={<EditOutlined />} type="text" />
          <Popconfirm
            title="Xóa rạp chiếu"
            description="Bạn có chắc muốn xóa rạp chiếu này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={() => handleDeleteTheater(record.id)}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
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
            Rạp chiếu
          </Title>
          <Text type="secondary">Quản lý rạp chiếu phim</Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Thêm rạp mới
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={theaters}
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

      {/* MODAL CREATE THEATER */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Tạo rạp chiếu mới"
        okText="Tạo"
        cancelText="Hủy"
        destroyOnClose
        onOk={handleCreateTheater}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên rạp"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên rạp" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="addressId"
            rules={[{ required: true, message: "Vui lòng chọn địa chỉ" }]}
          >
            <Select>
              {addresses.map((v: Address) => (
                <Select.Option key={v.id} value={String(v.id)}>
                  {v.city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TheaterManagement;
