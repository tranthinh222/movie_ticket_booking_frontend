import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Space,
  Popconfirm,
  message,
  Typography,
  Divider,
  Row,
  Col,
  Modal,
  Input,
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import showtimeApi from "../../services/api-showtime";
import filmApi from "../../services/api-film";
import addressApi from "../../services/api-address";
import theaterApi from "../../services/api-theater";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const SIZE = 5;

interface Film {
  id: number;
  title: string;
  name: string;
  duration: number;
}

interface Auditorium {
  id: number;
  name: string;
  number: number;
}

interface Showtime {
  id: number;
  film: Film;
  auditorium: Auditorium;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Address {
  id: number;
  street_name: string;
  street_number: string;
  city: string;
}

interface Theater {
  id: number;
  name: string;
}

const ShowtimeManagement: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);

  const [films, setFilms] = useState<Film[]>([]);
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [filmPage, setFilmPage] = useState(1);
  const [filmTotalPages, setFilmTotalPages] = useState(1);
  const [filmKeyword, setFilmKeyword] = useState("");
  const [filmSelected, setFilmSelected] = useState<Film | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form] = Form.useForm();

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const res = await showtimeApi.getAllShowTimes(currentPage, SIZE);
      setShowtimes(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch {
      message.error("Lỗi tải suất chiếu");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await addressApi.getAllAddresses(1, 100);
      setAddresses(res.data.data);
    } catch {
      message.error("Lỗi tải danh sách địa chỉ");
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, [currentPage]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressChange = async (addressId: number) => {
    form.setFieldsValue({ theaterId: undefined, auditoriumId: undefined });
    setTheaters([]);
    setAuditoriums([]);

    try {
      const res = await addressApi.getTheaterByAddress(addressId);
      setTheaters(res.data || []);
    } catch {
      message.error("Lỗi tải danh sách rạp");
    }
  };

  const handleTheaterChange = async (theaterId: number) => {
    form.setFieldsValue({ auditoriumId: undefined });
    setAuditoriums([]);

    try {
      const res = await theaterApi.getAuditoriumByTheaterId(theaterId);
      setAuditoriums(res.data || []);
    } catch {
      message.error("Lỗi tải danh sách phòng chiếu");
    }
  };

  const fetchFilmsForModal = async () => {
    try {
      const res = await filmApi.getAllFilms(filmPage, 5, filmKeyword);
      setFilms(res.data.data);
      setFilmTotalPages(res.data.meta.totalPages);
    } catch {
      message.error("Lỗi tải danh sách phim");
    }
  };

  useEffect(() => {
    if (filmModalOpen) {
      fetchFilmsForModal();
    }
  }, [filmModalOpen, filmPage, filmKeyword]);

  const handleFilmSelect = (film: Film) => {
    setFilmSelected(film);
    form.setFieldsValue({ filmId: film.id });
    setFilmModalOpen(false);

    const startTime = form.getFieldValue("startTime");
    if (startTime && film.duration) {
      const endTime = dayjs(startTime).add(film.duration, "minute");
      form.setFieldsValue({ endTime });
    }
  };

  const handleStartTimeChange = (time: dayjs.Dayjs | null) => {
    if (time && filmSelected?.duration) {
      const endTime = time.add(filmSelected.duration, "minute");
      form.setFieldsValue({ endTime });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        filmId: values.filmId,
        auditoriumId: values.auditoriumId,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm:ss"),
        endTime: values.endTime.format("HH:mm:ss"),
      };

      await showtimeApi.create(payload);
      message.success("Tạo suất chiếu thành công");
      form.resetFields();
      setFilmSelected(null);
      setTheaters([]);
      setAuditoriums([]);
      fetchShowtimes();
    } catch {
      message.error("Tạo suất chiếu thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await showtimeApi.delete(id);
      message.success("Xóa thành công");
      fetchShowtimes();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    { title: "Phim", dataIndex: ["film", "name"], key: "film" },
    {
      title: "Phòng",
      key: "auditorium",
      render: (_: unknown, record: Showtime) =>
        record.auditorium?.name || `Phòng ${record.auditorium?.number}`,
    },
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Bắt đầu", dataIndex: "startTime", key: "startTime" },
    { title: "Kết thúc", dataIndex: "endTime", key: "endTime" },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Showtime) => (
        <Popconfirm
          title="Xóa suất chiếu?"
          icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Suất chiếu</Title>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={showtimes}
        columns={columns}
        pagination={false}
        bordered
      />

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

      <Divider />
      <Title level={4}>Tạo suất chiếu</Title>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="addressId"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng chọn địa chỉ" }]}
            >
              <Select
                placeholder="Chọn địa chỉ"
                onChange={handleAddressChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={addresses.map((a) => ({
                  value: a.id,
                  label: `${a.street_number} ${a.street_name}, ${a.city}`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="theaterId"
              label="Rạp"
              rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
            >
              <Select
                placeholder="Chọn rạp"
                onChange={handleTheaterChange}
                disabled={theaters.length === 0}
                options={theaters.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="auditoriumId"
              label="Phòng chiếu"
              rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
            >
              <Select
                placeholder="Chọn phòng"
                disabled={auditoriums.length === 0}
                options={auditoriums.map((a) => ({
                  value: a.id,
                  label: a.name || `Phòng ${a.number}`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Phim"
              required
              help={
                filmSelected
                  ? `Thời lượng: ${filmSelected.duration} phút`
                  : undefined
              }
            >
              <Space>
                <Input
                  value={filmSelected?.name || filmSelected?.title || ""}
                  placeholder="Chưa chọn phim"
                  disabled
                  style={{ width: 200 }}
                />
                <Button type="primary" onClick={() => setFilmModalOpen(true)}>
                  Chọn phim
                </Button>
              </Space>
            </Form.Item>
            <Form.Item
              name="filmId"
              hidden
              rules={[{ required: true, message: "Vui lòng chọn phim" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name="date"
              label="Ngày chiếu"
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                onChange={handleStartTimeChange}
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn giờ kết thúc" },
              ]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" onClick={handleSubmit}>
          Tạo suất chiếu
        </Button>
      </Form>

      <Modal
        open={filmModalOpen}
        onCancel={() => setFilmModalOpen(false)}
        title="Chọn phim"
        footer={null}
        width={900}
        destroyOnClose
      >
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm theo tên phim..."
            value={filmKeyword}
            onChange={(e) => {
              setFilmPage(1);
              setFilmKeyword(e.target.value);
            }}
            style={{ width: 300 }}
            allowClear
          />
        </Space>

        <Table
          rowKey="id"
          dataSource={films}
          pagination={false}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            {
              title: "Tên phim",
              key: "name",
              render: (_: unknown, record: Film) => record.name || record.title,
            },
            {
              title: "Thời lượng (phút)",
              dataIndex: "duration",
              width: 140,
            },
            {
              title: "Hành động",
              width: 120,
              render: (_: unknown, record: Film) => (
                <Button type="primary" onClick={() => handleFilmSelect(record)}>
                  Chọn
                </Button>
              ),
            },
          ]}
        />

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Space>
            <Button
              disabled={filmPage === 1}
              onClick={() => setFilmPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Text>
              Page {filmPage} / {filmTotalPages}
            </Text>
            <Button
              disabled={filmPage === filmTotalPages}
              onClick={() => setFilmPage((p) => p + 1)}
            >
              Next
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ShowtimeManagement;
