import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import addressApi from "../../services/api-address";

const { Title, Text } = Typography;

interface Address {
  id: number;
  street_number: string;
  street_name: string;
  city: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string;
  theaters: unknown[];
}

const SIZE = 5;

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form] = Form.useForm();

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const res = await addressApi.getAllAddresses(currentPage, SIZE);
      setAddresses(res.data.data);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch {
      message.error("Lỗi tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await addressApi.deleteAddress(id);
      message.success("Xóa địa chỉ thành công");
      fetchAddress();
    } catch {
      message.error("Xóa địa chỉ thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      form.setFieldsValue(address);
    } else {
      setEditingAddress(null);
      form.resetFields();
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingAddress) {
        await addressApi.updateAddress(editingAddress.id, values);
        message.success("Cập nhật địa chỉ thành công");
      } else {
        await addressApi.createAddress(values);
        message.success("Tạo địa chỉ thành công");
      }

      setOpen(false);
      form.resetFields();
      setEditingAddress(null);
      fetchAddress();
    } catch {
      message.error("Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Địa chỉ",
      key: "address",
      render: (_: unknown, record: Address) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#1677ff" }} />
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.street_number} {record.street_name}
            </div>
            <Text type="secondary">ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_: unknown, record: Address) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleOpenModal(record)}
          />

          <Popconfirm
            title="Xóa địa chỉ"
            description="Bạn có chắc muốn xóa địa chỉ này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
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
            Địa chỉ
          </Title>
          <Text type="secondary">Quản lý danh sách địa chỉ</Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm địa chỉ
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={addresses}
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

      {/* MODAL CREATE / UPDATE ADDRESS */}
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingAddress(null);
          form.resetFields();
        }}
        title={editingAddress ? "Cập nhật địa chỉ" : "Tạo địa chỉ mới"}
        okText={editingAddress ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        onOk={handleSubmit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Số nhà"
            name="street_number"
            rules={[{ required: true, message: "Vui lòng nhập số nhà" }]}
          >
            <Input placeholder="VD: 123" />
          </Form.Item>

          <Form.Item
            label="Tên đường"
            name="street_name"
            rules={[{ required: true, message: "Vui lòng nhập tên đường" }]}
          >
            <Input placeholder="VD: Nguyễn Huệ" />
          </Form.Item>

          <Form.Item
            label="Thành phố"
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
          >
            <Input placeholder="VD: Hồ Chí Minh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressManagement;
