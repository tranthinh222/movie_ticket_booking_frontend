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
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  CrownOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import userApi from "../../services/api-user";
import authApi from "../../services/api-auth";

const { Title, Text } = Typography;

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string;
  refreshToken: string;
}

const SIZE = 5;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAllUsers(currentPage, SIZE);
      const apiData = res.data;
      setUsers(apiData.data);
      setTotalPages(apiData.meta.totalPages);
    } catch (err) {
      console.error("Fetch users failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Create user
  const handleCreateUser = async () => {
    try {
      const values = await createForm.validateFields();
      const res = await authApi.register(
        values.username,
        values.email,
        values.password,
        values.phone,
        values.role
      );
      if (res.statusCode === 201) {
        message.success("Tạo user thành công!");
        fetchUsers();
      } else {
        message.error("Tạo user thất bại!");
      }
      setOpenCreate(false);
      createForm.resetFields();
    } catch (err) {
      console.log("Validate failed:", err);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      username: user.username,
      phone: user.phone,
      role: user.role,
    });
    setOpenEdit(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const values = await editForm.validateFields();
      const res = await userApi.updateUser(editingUser.id, {
        username: values.username,
        phone: values.phone,
        role: values.role,
      });

      if (res.statusCode === 200) {
        message.success("Cập nhật user thành công!");
        fetchUsers();
      } else {
        message.error("Cập nhật user thất bại!");
      }

      setOpenEdit(false);
      setEditingUser(null);
      editForm.resetFields();
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Cập nhật user thất bại!");
    }
  };

  // Delete user
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await userApi.deleteUser(id);
      if (res.statusCode === 200) {
        message.success("Xóa user thành công!");
        fetchUsers();
      } else {
        message.error("Xóa user thất bại!");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Xóa user thất bại!");
    }
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
      render: (_: unknown, record: User) => (
        <Space>
          {record.role === "ADMIN" ? (
            <CrownOutlined style={{ color: "#cf1322" }} />
          ) : (
            <UserOutlined style={{ color: "#1677ff" }} />
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{record.username}</div>
            <Text type="secondary">ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_: unknown, record: User) => (
        <div>
          <div>{record.email}</div>
          <Text type="secondary">{record.phone}</Text>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) =>
        role === "ADMIN" ? (
          <Tag color="red">ADMIN</Tag>
        ) : (
          <Tag color="blue">USER</Tag>
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
      align: "left" as const,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleOpenEdit(record)}
          />

          <Popconfirm
            title="Xóa user"
            description="Bạn có chắc muốn xóa user này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={() => handleDeleteUser(record.id)}
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
            Người dùng
          </Title>
          <Text type="secondary">Quản lý tài khoản và vai trò</Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenCreate(true)}
        >
          Thêm người dùng
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={users}
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

      {/* MODAL CREATE USER */}
      <Modal
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
          createForm.resetFields();
        }}
        title="Tạo User Mới"
        okText="Tạo"
        cancelText="Hủy"
        destroyOnClose
        onOk={handleCreateUser}
      >
        <Form layout="vertical" form={createForm}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Nhập username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Nhập password" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select placeholder="Chọn role">
              <Select.Option value="CUSTOMER">CUSTOMER</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL EDIT USER */}
      <Modal
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false);
          setEditingUser(null);
          editForm.resetFields();
        }}
        title="Cập Nhật User"
        okText="Cập nhật"
        cancelText="Hủy"
        destroyOnClose
        onOk={handleUpdateUser}
      >
        <Form layout="vertical" form={editForm}>
          {/* Show email as read-only info */}
          {editingUser && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <Text type="secondary">Email: </Text>
              <Text strong>{editingUser.email}</Text>
            </div>
          )}

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Nhập username" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select placeholder="Chọn role">
              <Select.Option value="USER">USER</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
