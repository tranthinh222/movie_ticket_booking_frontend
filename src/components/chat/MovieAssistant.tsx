import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import "./MovieAssistant.css";
import assistantApi, {type Topic,type ChatMemory,type MovieSuggestion,type SeatSuggestion} from "../../services/api-assistant";
import {getApiErrorMessage} from "../../utils/api-error";
import {useAssistantContext} from "./assistant-context";

import type {Discount} from "../../services/api-discount";

type Message = { id: number; role: "assistant" | "user"; text: string; discounts?:Discount[]; movies?:MovieSuggestion[]; seatGroups?:SeatSuggestion[] };
const welcome = (): Message => ({ id: 0, role: "assistant", text: "Chào bạn! Bạn muốn tìm phim hay chọn ghế? Hãy nói điều bạn cần, ví dụ: “Tìm phim hài dưới hai tiếng”." });
const prompts = [
  { label: "Ưu đãi", text: "Có ưu đãi nào đang áp dụng?" },
  { label: "Gợi ý phim", text: "Gợi ý phim theo bộ lọc tôi chọn." },
  { label: "Hỏi về phim", text: "Giúp tôi tìm hiểu nội dung và thể loại phim, không tiết lộ kết thúc." },
  { label: "Gợi ý ghế", text: "Tôi muốn chọn hai ghế liền nhau, gần giữa phòng chiếu." },
];

export default function MovieAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome()]);
  const [draft, setDraft] = useState("");
  const [optionsOpen,setOptionsOpen]=useState(false);
  const [topic,setTopic]=useState<Topic>("MOVIES");
  const [genre,setGenre]=useState("");const [date,setDate]=useState("");
  const [duration,setDuration]=useState("");const [people,setPeople]=useState(2);const [budget,setBudget]=useState("");
  const [pending,setPending]=useState(false);const [error,setError]=useState<string|null>(null);
  const busy=useRef(false);
  const conversation=useRef<{memory?:ChatMemory;filmId?:number;showTimeId?:number;seenFilmIds:number[];history:{role:"user"|"assistant";text:string}[]}>({seenFilmIds:[],history:[]});
  const showTimeId=useAssistantContext(state=>state.showTimeId);
  const input = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const filmId = location.pathname.match(/^\/(?:movie|booking)\/(\d+)(?:\/booking)?$/)?.[1];

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { if (open) bottom.current?.scrollIntoView({ block: "nearest" }); }, [messages, open]);
  const close = () => { setOpen(false); launcher.current?.focus(); };
  const send = async (text = draft, selectedTopic:Topic = topic, useAi = true) => {
    const content = text.trim();
    if (!content || busy.current) return;
    const remembered=conversation.current;
    if((remembered.memory?.intent==="SEATS"&&remembered.showTimeId!==(showTimeId??undefined)) ||
       (remembered.memory?.intent==="MOVIE_DETAILS"&&remembered.filmId!==(filmId?Number(filmId):undefined))){
      conversation.current={seenFilmIds:remembered.seenFilmIds,history:[]};
    }
    busy.current=true;setPending(true);setError(null);
    setMessages(current => [...current,{id:Date.now(),role:"user",text:content}]);setDraft("");
    try {
      const response=await assistantApi.chat({message:content,useAi,history:conversation.current.history,memory:conversation.current.memory,
        memoryFilmId:conversation.current.filmId,memoryShowTimeId:conversation.current.showTimeId,seenFilmIds:conversation.current.seenFilmIds,topic:selectedTopic,filmId:filmId?Number(filmId):undefined,
        preferences:{genre:genre||undefined,date:date||undefined,maxDuration:duration?Number(duration):undefined},
        seats:showTimeId?{showTimeId,people,budget:budget?Number(budget):undefined}:undefined});
      const old=conversation.current;
      conversation.current={memory:response.data.memory??undefined,filmId:filmId?Number(filmId):undefined,showTimeId:showTimeId??undefined,
        seenFilmIds:[...new Set([...old.seenFilmIds,...response.data.movies.map(movie=>movie.filmId)])].slice(-50),
        history:[...old.history,{role:"user" as const,text:content},{role:"assistant" as const,text:response.data.reply.slice(0,1000)}].slice(-10)};
      setMessages(current=>[...current,{id:Date.now(),role:"assistant",text:response.data.reply,movies:response.data.movies,seatGroups:response.data.seatGroups,discounts:response.data.discounts}]);
    } catch(e){setError(getApiErrorMessage(e,"Không thể kết nối trợ lý. Vui lòng thử lại."));setDraft(content);}
    finally{busy.current=false;setPending(false);input.current?.focus();}
  };

  return <div className="cine-assistant">
    {open && <section id="cine-assistant-panel" className="cine-chat-panel" role="dialog" aria-labelledby="cine-chat-title" onKeyDown={e => { if (e.key === "Escape") close(); }}>
      <header className="cine-chat-header">
        <span className="cine-chat-avatar" aria-hidden="true">✦</span>
        <div><h2 id="cine-chat-title">Trợ lý CineMovie</h2><p>Cùng bạn chọn trải nghiệm xem phim</p></div>
        <button type="button" className="cine-chat-icon" aria-label="Đóng trò chuyện" onClick={close}>×</button>
      </header>
      <div className="cine-chat-context">{filmId ? "Bạn đang xem phim hoặc chọn suất chiếu" : "Tìm phim · Hỏi đáp · Chọn ghế"}</div>
      <div className="cine-chat-messages" role="log" aria-label="Nội dung trò chuyện" aria-live="polite" aria-relevant="additions">
        {messages.map(item => <div key={item.id} className={`cine-chat-message cine-chat-message-${item.role}`}><span className="cine-chat-author">{item.role === "user" ? "Bạn" : "CineMovie"}</span><p>{item.text}</p>
          {item.movies?.map(movie=><Link key={movie.filmId} className="cine-chat-result" to={`/movie/${movie.filmId}/booking`}><strong>{movie.name}</strong><small>{movie.minTicketPrice!=null ? `Giá vé từ ${movie.minTicketPrice.toLocaleString("vi-VN")}đ` : "Giá vé chưa cập nhật"}</small>{movie.discountCode&&<><small>Mã {movie.discountCode}: giảm {movie.discountAmount.toLocaleString("vi-VN")}đ</small><strong>Còn {movie.finalTicketPrice?.toLocaleString("vi-VN")}đ / vé</strong><small>Nhập mã ở bước thanh toán để nhận mức giảm này.</small></>}<small>{movie.reason}</small><span>Xem suất chiếu ↗</span></Link>)}
          {item.discounts?.map(offer=><div key={offer.code} className="cine-chat-result">
            <strong>{offer.title} · {offer.code}</strong><small>{offer.description}</small>
            <small>{offer.type==="PERCENT" ? `Giảm ${offer.value}%` : `Giảm ${offer.value.toLocaleString("vi-VN")}đ`}{offer.maxDiscount!=null ? ` · Tối đa ${offer.maxDiscount.toLocaleString("vi-VN")}đ` : ""}</small>
            <small>{offer.minOrder>0 ? `Đơn tối thiểu ${offer.minOrder.toLocaleString("vi-VN")}đ` : "Không yêu cầu giá trị đơn tối thiểu"}</small>
            <small>Hiệu lực: {offer.startsOn.split("-").reverse().join("/")} – {offer.endsOn.split("-").reverse().join("/")}</small>
            <small>Nhập mã {offer.code} ở bước thanh toán.</small>
          </div>)}
          {item.seatGroups?.map(group=><div key={group.seatIds.join(",")} className="cine-chat-result"><strong>{group.labels.join(", ")}</strong><small>{group.totalPrice.toLocaleString("vi-VN")}đ · Suất #{group.showTimeId}</small><small>{group.reason}</small></div>)}
        </div>)}
        {pending&&<p role="status">CineMovie đang trả lời…</p>}
        {error&&<p role="alert">{error} Bạn có thể bấm gửi để thử lại.</p>}
        <div ref={bottom} />
      </div>
      <div className="cine-chat-tools">
        <div className="cine-chat-toolbar">
          <button type="button" aria-expanded={optionsOpen} aria-controls="cine-chat-options" onClick={()=>setOptionsOpen(value=>!value)}>Tùy chọn {optionsOpen?"⌃":"⌄"}</button>
          <button type="button" disabled={pending} onClick={() => { setOptionsOpen(false);setError(null); conversation.current={seenFilmIds:[],history:[]}; setGenre("");setDate("");setDuration("");setPeople(2);setBudget(""); setMessages([welcome()]); setDraft(""); input.current?.focus(); }}>Trò chuyện mới</button>
        </div>
        {optionsOpen&&<div id="cine-chat-options" className="cine-chat-options">
        <div className="cine-chat-filters">
          <label>Hỗ trợ<select value={topic} disabled={pending} onChange={e=>setTopic(e.target.value as Topic)}><option value="DISCOUNTS">Ưu đãi đang áp dụng</option><option value="MOVIES">Gợi ý phim</option><option value="MOVIE_DETAILS">Thông tin phim đang xem</option><option value="SEATS">Gợi ý ghế cho suất đã chọn</option></select></label>
          {topic==="MOVIES"&&<><label>Thể loại<input value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Ví dụ: Hài" /></label><label>Ngày xem<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label><label>Tối đa (phút)<input type="number" min={1} max={600} value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Không giới hạn" /></label></>}
          {topic==="SEATS"&&<><label>Số người<input type="number" min={1} max={10} value={people} onChange={e=>setPeople(Number(e.target.value))} /></label><label>Ngân sách cả nhóm<input type="number" min={0} value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Không giới hạn" /></label><p>{showTimeId?"Đã nhận suất chiếu bạn chọn trên trang đặt vé.":"Hãy chọn suất chiếu trên trang đặt vé trước."}</p></>}
        </div>
        <div className="cine-chat-links"><button type="button" disabled={pending} onClick={() => void send(topic === "DISCOUNTS" ? "Có ưu đãi nào đang áp dụng?" : topic === "MOVIES" ? "Tìm phim theo bộ lọc tôi chọn." : topic === "SEATS" ? "Gợi ý ghế theo điều kiện tôi chọn." : "Thông tin phim đang xem.",topic,false)}>{topic === "DISCOUNTS" ? "Có ưu đãi nào đang áp dụng?" : topic === "MOVIES" ? "Tìm phim theo bộ lọc" : topic === "SEATS" ? "Tìm ghế phù hợp" : "Xem thông tin phim"}</button></div>
        </div>}
        {messages.length === 1 && <div className="cine-chat-prompts">{prompts.map(prompt => <button type="button" key={prompt.label} disabled={pending} onClick={() => {const next:Topic=prompt.label==="Ưu đãi"?"DISCOUNTS":prompt.label==="Gợi ý ghế"?"SEATS":prompt.label==="Hỏi về phim"?"MOVIE_DETAILS":"MOVIES";setTopic(next);void send(prompt.text,next,false);}}>{prompt.label}</button>)}</div>}

        <form className="cine-chat-compose" onSubmit={e => { e.preventDefault(); send(); }}>
          <label className="cine-chat-sr" htmlFor="cine-chat-input">Tin nhắn cho trợ lý</label>
          <textarea id="cine-chat-input" ref={input} value={draft} maxLength={1000} rows={2} placeholder="Hỏi về phim, ghế hoặc ưu đãi…" onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
          <button type="submit" disabled={pending||!draft.trim()} aria-label="Gửi tin nhắn">↑</button>
        </form>
        <p className="cine-chat-note">Bạn có thể hỏi bằng câu tự nhiên. Kết quả dựa trên dữ liệu rạp; ghế chưa được giữ.</p>
      </div>
    </section>}
    <button ref={launcher} type="button" className="cine-chat-launcher" aria-expanded={open} aria-controls="cine-assistant-panel" aria-label={open ? "Thu gọn trợ lý CineMovie" : "Mở trợ lý CineMovie"} onClick={() => open ? close() : setOpen(true)}><span aria-hidden="true">{open ? "×" : "✦"}</span><span>Trợ lý CineMovie</span></button>
  </div>;
}
