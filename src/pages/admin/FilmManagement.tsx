import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  message,
  Image,
  Typography,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import filmApi from "../../services/api-film";
import uploadApi from "../../services/api-upload";

const { Title, Text } = Typography;

interface Film {
  id: number;
  name: string;
  description: string;
  duration: number;
  releaseDate: string;
  status: "COMING_SOON" | "NOW_SHOWING" | "STOPPED";
  thumbnail: string;
  genre: string;
  language: string;
  price: number;
}

const SIZE = 15;

const FilmManagement = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingFilm, setEditingFilm] = useState<Film | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form] = Form.useForm();

  const handlePreviewPoster = (file: File) => {
    setPosterFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPosterPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const fetchFilms = async () => {
    try {
      setLoading(true);

      const res = await filmApi.getAllFilms(currentPage, SIZE);
      const apiData = res.data;

      setFilms(apiData.data);
      setTotalPages(apiData.meta.totalPages);
    } catch {
      message.error("Lỗi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, [currentPage]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      let posterUrl = editingFilm?.thumbnail || "";

      // Upload poster if new file selected
      if (posterFile) {
        const uploadRes = await uploadApi.uploadFile(posterFile);
        posterUrl = uploadRes.data.url;
      }

      const payload = {
        ...values,
        posterUrl,
        thumbnail: posterUrl,
      };

      if (editingFilm) {
        // Update film
        const res = await filmApi.updateFilm({
          ...payload,
          id: editingFilm.id,
        });
        if (res.statusCode === 200) {
          message.success(res.message || "Cập nhật thành công");
        } else {
          message.error(res.message || "Cập nhật thất bại");
          return;
        }
      } else {
        // Create film
        const res = await filmApi.createFilm(payload);

        if (res.statusCode === 201) {
          message.success(res.message || "Thêm phim thành công");
        } else {
          message.error(res.message || "Thêm phim thất bại");
          return;
        }
      }

      setOpen(false);
      setEditingFilm(null);
      setPosterFile(null);
      setPosterPreview(null);
      form.resetFields();
      fetchFilms();
    } catch (e: unknown) {
      const error = e as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        error?.response?.data?.message || error?.message || "Có lỗi xảy ra";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await filmApi.deleteFilm(id);

      message.success("Xóa thành công");
      fetchFilms();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const handleOpenModal = (film?: Film) => {
    if (film) {
      setEditingFilm(film);
      form.setFieldsValue(film);
      setPosterPreview(film.thumbnail || null);
    } else {
      setEditingFilm(null);
      form.resetFields();
      setPosterPreview(null);
    }
    setPosterFile(null);
    setOpen(true);
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "thumbnail",
      width: 80,
      render: (url: string) => (
        <Image
          width={60}
          src={url}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8DtXNJsAAAAASUVORK5CYII="
        />
      ),
    },
    { title: "Tên phim", dataIndex: "name" },
    { title: "Thể loại", dataIndex: "genre" },
    { title: "Thời lượng", dataIndex: "duration", width: 100 },
    { title: "Ngày chiếu", dataIndex: "releaseDate", width: 120 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          NOW_SHOWING: { text: "Đang chiếu", color: "green" },
          COMING_SOON: { text: "Sắp chiếu", color: "blue" },
          STOPPED: { text: "Đã kết thúc", color: "gray" },
        };
        const current = statusMap[status] || { text: status, color: "default" };
        return <span style={{ color: current.color }}>{current.text}</span>;
      },
    },
    {
      title: "Hành động",
      width: 100,
      render: (_: unknown, record: Film) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleOpenModal(record)}
          />

          <Popconfirm
            title="Xóa phim"
            description="Bạn có chắc muốn xóa phim này?"
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
            Films
          </Title>
          <Text type="secondary">Manage movies</Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          New Film
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={films}
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
            Prev
          </Button>

          <Text>
            Page {currentPage} / {totalPages}
          </Text>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </Space>
      </div>

      {/* MODAL CREATE / UPDATE */}
      <Modal
        title={editingFilm ? "Cập nhật phim" : "Thêm phim"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setPosterFile(null);
          setPosterPreview(null);
        }}
        onOk={handleSubmit}
        confirmLoading={submitting}
        destroyOnClose
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Tên phim" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Poster">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                handlePreviewPoster(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload image</Button>
            </Upload>

            {posterPreview && (
              <div style={{ marginTop: 12 }}>
                <Image width={120} src={posterPreview} />
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng (phút)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="releaseDate"
            label="Ngày chiếu"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="language"
            label="Ngôn ngữ"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "ENGLISH", label: "English" },
                { value: "VIETNAMESE", label: "Vietnamese" },
              ]}
            />
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "COMING_SOON", label: "Sắp chiếu" },
                { value: "NOW_SHOWING", label: "Đang chiếu" },
                { value: "STOPPED", label: "Đã kết thúc" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FilmManagement;
