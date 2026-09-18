import {useEffect,useState} from "react";
import {Link} from "react-router";
import {Modal,message} from "antd";
import discountApi,{type Discount} from "../services/api-discount";
import {getApiErrorMessage} from "../utils/api-error";
const format=(amount:number)=>amount.toLocaleString("vi-VN")+"đ";
const formatDate=(date:string)=>date.split("-").reverse().join("/");
const minimumLabel=(amount:number)=>amount>0?"Áp dụng cho đơn từ "+format(amount):"Không yêu cầu giá trị đơn tối thiểu";
const Promotion=()=>{
 const [items,setItems]=useState<Discount[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState<string|null>(null);
 const [reload,setReload]=useState(0);
 const [filter,setFilter]=useState("Tất cả");
 const [selected,setSelected]=useState<Discount|null>(null);
 useEffect(()=>{let active=true;setLoading(true);setError(null);
  discountApi.list().then(r=>{if(active)setItems(r.data);}).catch(e=>{if(active)setError(getApiErrorMessage(e,"Không tải được ưu đãi."));}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[reload]);
 const copy=async(item:Discount)=>{try{await navigator.clipboard.writeText(item.code);message.success("Đã sao chép mã "+item.code);}catch{message.info("Bạn có thể nhập mã "+item.code+" tại trang thanh toán.");}};
 const visible=items.filter(item=>filter==="Tất cả"||(filter==="Giảm phần trăm"?item.type==="PERCENT":item.type==="FIXED"));
 return <main className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">
  <h1 className="text-white text-3xl font-bold">Ưu đãi & Khuyến mãi</h1>
  <p className="text-gray-400">Chọn mã ưu đãi vé phim và áp dụng tại bước thanh toán. Mỗi đơn dùng một mã.</p>
  <div className="flex gap-3 flex-wrap">{["Tất cả","Giảm phần trăm","Giảm số tiền"].map(item=><button type="button" key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)} className={`rounded-full px-5 py-2 text-white ${filter===item?"bg-primary":"bg-[#482329]"}`}>{item}</button>)}</div>
  {loading?<p role="status" className="text-gray-400">Đang tải ưu đãi...</p>:error?<div role="alert" className="text-white">{error} <button type="button" onClick={()=>setReload(x=>x+1)} className="text-primary underline">Thử lại</button></div>:<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
   {visible.map(item=><article key={item.id} className="rounded-xl bg-[#2f161a] border border-[#482329] overflow-hidden">
    {item.image?<img src={item.image} alt={item.title} className="w-full aspect-video object-cover"/>:<div className="bg-primary/20 p-8 text-center text-primary text-3xl font-bold">{item.type==="PERCENT"?item.value+"%":format(item.value)}</div>}
    <div className="p-5 space-y-3"><h2 className="text-xl text-white font-bold">{item.title}</h2><p className="text-gray-400 line-clamp-2">{item.description}</p>
     <p className="text-gray-300">{minimumLabel(item.minOrder)}{item.maxDiscount?" · Giảm tối đa "+format(item.maxDiscount):""}</p>
     <p className="text-gray-400 text-sm">{formatDate(item.startsOn)} – {formatDate(item.endsOn)}</p>
     <p className="text-primary font-bold">{item.code}</p>
     <div className="flex gap-4"><button type="button" onClick={()=>setSelected(item)} className="text-primary hover:underline">Xem chi tiết</button><button type="button" onClick={()=>void copy(item)} className="text-white hover:underline">Sao chép mã</button></div>
    </div>
   </article>)}
   {visible.length===0&&<p role="status" className="col-span-full text-gray-400">Hiện chưa có ưu đãi phù hợp.</p>}
  </div>}
  <Modal open={selected!==null} title={selected?.title} onCancel={()=>setSelected(null)} footer={selected&&<div className="flex justify-end gap-4"><button type="button" onClick={()=>void copy(selected)}>Sao chép mã</button><Link to="/movie" onClick={()=>setSelected(null)}>Chọn phim</Link></div>}>
   {selected&&<div className="space-y-3"><p className="whitespace-pre-wrap">{selected.description}</p><p>Mã: <strong>{selected.code}</strong></p><p>Giảm {selected.type==="PERCENT"?selected.value+"%":format(selected.value)}</p><p>{minimumLabel(selected.minOrder)}</p>{selected.maxDiscount&&<p>Giảm tối đa {format(selected.maxDiscount)}</p>}<p>Hiệu lực: {formatDate(selected.startsOn)} – {formatDate(selected.endsOn)}</p><p>Chọn phim và ghế, sau đó nhập mã tại bước thanh toán và bấm “Áp dụng”. Mỗi đơn vé được sử dụng một mã ưu đãi.</p></div>}
  </Modal>
 </main>;
};
export default Promotion;
