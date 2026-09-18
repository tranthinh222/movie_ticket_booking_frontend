import {useEffect,useState} from "react";
import {Button,Form,Input,InputNumber,Modal,Popconfirm,Select,Space,Switch,Table,Tag,Typography,message} from "antd";
import discountApi,{type Discount,type DiscountInput} from "../../services/api-discount";
import {getApiErrorMessage} from "../../utils/api-error";
const DiscountManagement=()=>{
 const [items,setItems]=useState<Discount[]>([]);
 const [loading,setLoading]=useState(false);
 const [saving,setSaving]=useState(false);
 const [reload,setReload]=useState(0);
 const [open,setOpen]=useState(false);
 const [editing,setEditing]=useState<Discount|null>(null);
 const [form]=Form.useForm<DiscountInput>();
 const type=Form.useWatch("type",form);
 useEffect(()=>{let active=true;setLoading(true);discountApi.list(true).then(r=>{if(active)setItems(r.data);}).catch(e=>{if(active)message.error(getApiErrorMessage(e,"Không tải được ưu đãi."));}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[reload]);
 const edit=(item:Discount|null)=>{setEditing(item);form.resetFields();form.setFieldsValue(item||{type:"PERCENT",value:10,minOrder:0,maxDiscount:null,active:true,image:""});setOpen(true);};
 const save=async(input:DiscountInput)=>{setSaving(true);try{if(editing)await discountApi.update(editing.id,input);else await discountApi.create(input);message.success("Đã lưu ưu đãi.");setOpen(false);setReload(x=>x+1);}catch(e){message.error(getApiErrorMessage(e,"Không lưu được ưu đãi."));}finally{setSaving(false);}};
 const remove=async(id:number)=>{try{await discountApi.remove(id);message.success("Đã xóa ưu đãi.");setReload(x=>x+1);}catch(e){message.error(getApiErrorMessage(e,"Không xóa được ưu đãi."));}};
 return <div><Typography.Title level={2}>Quản lý khuyến mãi</Typography.Title><Button type="primary" onClick={()=>edit(null)} className="mb-4">Thêm ưu đãi</Button>
  <Table<Discount> rowKey="id" loading={loading} dataSource={items} scroll={{x:1000}} columns={[
   {title:"Mã",dataIndex:"code"},{title:"Tiêu đề",dataIndex:"title"},
   {title:"Mức giảm",render:(_,d)=>d.type==="PERCENT"?d.value+"%":d.value.toLocaleString("vi-VN")+"đ"},
   {title:"Hiệu lực",render:(_,d)=>d.startsOn+" – "+d.endsOn},
   {title:"Trạng thái",dataIndex:"active",render:(v:boolean)=><Tag color={v?"green":"default"}>{v?"Đang bật":"Đã tắt"}</Tag>},
   {title:"Thao tác",render:(_,d)=><Space><Button onClick={()=>edit(d)}>Sửa</Button><Popconfirm title="Xóa ưu đãi này?" description="Đơn đã đặt vẫn giữ số tiền giảm đã lưu." onConfirm={()=>remove(d.id)} okText="Xóa" cancelText="Hủy"><Button danger>Xóa</Button></Popconfirm></Space>}
  ]}/>
  <Modal open={open} title={editing?"Sửa ưu đãi":"Thêm ưu đãi"} onCancel={()=>{if(!saving)setOpen(false);}} onOk={()=>form.submit()} confirmLoading={saving} okText="Lưu" cancelText="Hủy" width={750}>
   <Form form={form} layout="vertical" onFinish={save}>
    <Form.Item name="code" label="Mã ưu đãi" rules={[{required:true},{pattern:/^[A-Za-z0-9_-]{3,40}$/,message:"Mã cần 3–40 ký tự chữ, số, gạch ngang hoặc gạch dưới."}]}><Input maxLength={40}/></Form.Item>
    <Form.Item name="title" label="Tiêu đề" rules={[{required:true,whitespace:true,max:255}]}><Input maxLength={255}/></Form.Item>
    <Form.Item name="description" label="Nội dung và điều kiện" rules={[{max:4000}]}><Input.TextArea rows={4} maxLength={4000}/></Form.Item>
    <Form.Item name="image" label="URL ảnh" rules={[{pattern:/^(https?:\/\/[^\s]+)?$/,message:"Nhập URL HTTP/HTTPS hợp lệ."},{max:2000}]}><Input/></Form.Item>
    <Form.Item name="type" label="Loại giảm" rules={[{required:true}]}><Select options={[{value:"PERCENT",label:"Phần trăm"},{value:"FIXED",label:"Số tiền"}]}/></Form.Item>
    <Form.Item name="value" label={type==="PERCENT"?"Phần trăm giảm":"Số tiền giảm (đ)"} rules={[{required:true}]}><InputNumber min={0.01} max={type==="PERCENT"?100:9999999999999} precision={2} style={{width:"100%"}}/></Form.Item>
    <Form.Item name="minOrder" label="Giá trị đơn tối thiểu (đ)" rules={[{required:true}]}><InputNumber min={0} max={9999999999999} precision={2} style={{width:"100%"}}/></Form.Item>
    <Form.Item name="maxDiscount" label="Giảm tối đa (đ, có thể bỏ trống)"><InputNumber min={0.01} max={9999999999999} precision={2} style={{width:"100%"}}/></Form.Item>
    <Form.Item name="startsOn" label="Ngày bắt đầu" rules={[{required:true}]}><Input type="date"/></Form.Item>
    <Form.Item name="endsOn" label="Ngày kết thúc" dependencies={["startsOn"]} rules={[{required:true},({getFieldValue})=>({validator(_,value){return !value||!getFieldValue("startsOn")||value>=getFieldValue("startsOn")?Promise.resolve():Promise.reject(new Error("Ngày kết thúc phải từ ngày bắt đầu trở đi."));}})]}><Input type="date"/></Form.Item>
    <Form.Item name="active" label="Cho phép áp dụng" valuePropName="checked"><Switch/></Form.Item>
   </Form>
  </Modal>
 </div>;
};
export default DiscountManagement;
