import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from "antd";
import newsApi, { type NewsArticle, type NewsInput } from "../../services/api-news";

const categories = ["Tin mới", "Review phim", "Sắp chiếu", "Diễn viên"];
const getError = (error: unknown) => {
  const value = error as { message?: string; error?: string };
  return value?.error || value?.message || "Không thực hiện được thao tác.";
};
const NewsManagement = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form] = Form.useForm<NewsInput>();
  useEffect(() => {
    let active = true;
    setLoading(true);
    newsApi.list(page, 10, true, search).then((response) => {
      if (active) { setArticles(response.data.data); setTotal(response.data.meta.totalItems); }
    }).catch((error: unknown) => {
      if (active) message.error(getError(error));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, reload]);
  const edit = (article: NewsArticle | null) => {
    setEditing(article);
    form.resetFields();
    form.setFieldsValue(article || { category: "Tin mới", featured: false, published: false, image: "" });
    setOpen(true);
  };
  const save = async (input: NewsInput) => {
    setSaving(true);
    try {
      if (editing) await newsApi.update(editing.id, input);
      else await newsApi.create(input);
      message.success("Đã lưu bài viết.");
      setOpen(false);
      setReload((value) => value + 1);
    } catch (error) { message.error(getError(error)); }
    finally { setSaving(false); }
  };
  const remove = async (id: number) => {
    setDeletingId(id);
    try {
      await newsApi.remove(id);
      message.success("Đã xóa bài viết.");
      if (articles.length === 1 && page > 1) setPage(page - 1);
      else setReload((value) => value + 1);
    } catch (error) { message.error(getError(error)); }
    finally { setDeletingId(null); }
  };
  return (
    <div>
      <Typography.Title level={2}>Quản lý tin tức</Typography.Title>
      <Space className="mb-4" wrap>
        <Button type="primary" onClick={() => edit(null)}>Thêm bài viết</Button>
        <Input.Search allowClear placeholder="Tìm theo tiêu đề" onSearch={(value) => { setPage(1); setSearch(value); }} />
      </Space>
      <Table<NewsArticle> rowKey="id" dataSource={articles} loading={loading} scroll={{ x: 800 }}
        pagination={{ current: page, pageSize: 10, total, showSizeChanger: false, onChange: setPage }}
        columns={[
          { title: "Tiêu đề", dataIndex: "title" },
          { title: "Danh mục", dataIndex: "category" },
          { title: "Trạng thái", dataIndex: "published", render: (value: boolean) => <Tag color={value ? "green" : "default"}>{value ? "Đã xuất bản" : "Bản nháp"}</Tag> },
          { title: "Nổi bật", dataIndex: "featured", render: (value: boolean) => value ? "Có" : "Không" },
          { title: "Thao tác", render: (_, article) => <Space>
            <Button onClick={() => edit(article)}>Sửa</Button>
            <Popconfirm title="Xóa bài viết này?" onConfirm={() => remove(article.id)} okText="Xóa" cancelText="Hủy">
              <Button danger loading={deletingId === article.id}>Xóa</Button>
            </Popconfirm>
          </Space> },
        ]} />
      <Modal open={open} title={editing ? "Sửa bài viết" : "Thêm bài viết"} onCancel={() => { if (!saving) setOpen(false); }}
        onOk={() => form.submit()} confirmLoading={saving} okText="Lưu" cancelText="Hủy" width={800}>
        <Form form={form} layout="vertical" onFinish={save}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, whitespace: true, max: 255 }]}><Input maxLength={255} /></Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}><Select options={categories.map((value) => ({ value, label: value }))} /></Form.Item>
          <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true, whitespace: true, max: 2000 }]}><Input.TextArea rows={3} maxLength={2000} /></Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, whitespace: true, max: 100000 }]}><Input.TextArea rows={10} maxLength={100000} /></Form.Item>
          <Form.Item name="image" label="URL ảnh" rules={[{ pattern: /^(https?:\/\/[^\s]+)?$/, message: "Nhập URL http hoặc https hợp lệ." }, { max: 2000 }]}><Input placeholder="https://..." /></Form.Item>
          <Form.Item name="featured" label="Bài nổi bật" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="published" label="Xuất bản" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default NewsManagement;
