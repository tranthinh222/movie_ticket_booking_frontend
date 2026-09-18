import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import "./MovieAssistant.css";
import assistantApi, {type Topic,type MovieSuggestion,type SeatSuggestion} from "../../services/api-assistant";
import {getApiErrorMessage} from "../../utils/api-error";
import {useAssistantContext} from "./assistant-context";

type Message = { id: number; role: "assistant" | "user"; text: string; movies?:MovieSuggestion[]; seatGroups?:SeatSuggestion[] };
const welcome = (): Message => ({ id: 0, role: "assistant", text: "Chào bạn! Hãy chọn mục hỗ trợ và bộ lọc bên dưới. Tôi có thể tìm phim có suất chiếu, cung cấp thông tin phim đang xem và gợi ý ghế cho suất bạn đã chọn." });
const prompts = [
  { label: "Gợi ý phim", text: "Gợi ý phim theo bộ lọc tôi chọn." },
  { label: "Hỏi về phim", text: "Giúp tôi tìm hiểu nội dung và thể loại phim, không tiết lộ kết thúc." },
  { label: "Gợi ý ghế", text: "Tôi muốn chọn hai ghế liền nhau, gần giữa phòng chiếu." },
];

export default function MovieAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome()]);
  const [draft, setDraft] = useState("");
  const [topic,setTopic]=useState<Topic>("MOVIES");
  const [genre,setGenre]=useState("");const [date,setDate]=useState("");
  const [duration,setDuration]=useState("");const [people,setPeople]=useState(2);const [budget,setBudget]=useState("");
  const [pending,setPending]=useState(false);const [error,setError]=useState<string|null>(null);
  const busy=useRef(false);
  const showTimeId=useAssistantContext(state=>state.showTimeId);
  const input = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const filmId = location.pathname.match(/^\/(?:movie|booking)\/(\d+)(?:\/booking)?$/)?.[1];

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { if (open) bottom.current?.scrollIntoView({ block: "nearest" }); }, [messages, open]);
  const close = () => { setOpen(false); launcher.current?.focus(); };
  const send = async (text = draft, selectedTopic:Topic = topic) => {
    const content = text.trim();
    if (!content || busy.current) return;
    busy.current=true;setPending(true);setError(null);
    setMessages(current => [...current,{id:Date.now(),role:"user",text:content}]);setDraft("");
    try {
      const response=await assistantApi.chat({message:content,topic:selectedTopic,filmId:filmId?Number(filmId):undefined,
        preferences:{genre:genre||undefined,date:date||undefined,maxDuration:duration?Number(duration):undefined},
        seats:selectedTopic==="SEATS"&&showTimeId?{showTimeId,people,budget:budget?Number(budget):undefined}:undefined});
      setMessages(current=>[...current,{id:Date.now(),role:"assistant",text:response.data.reply,movies:response.data.movies,seatGroups:response.data.seatGroups}]);
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
          {item.movies?.map(movie=><Link key={movie.filmId} className="cine-chat-result" to={`/movie/${movie.filmId}/booking`}><strong>{movie.name}</strong><small>{movie.reason}</small><span>Xem suất chiếu ↗</span></Link>)}
          {item.seatGroups?.map(group=><div key={group.seatIds.join(",")} className="cine-chat-result"><strong>{group.labels.join(", ")}</strong><small>{group.totalPrice.toLocaleString("vi-VN")}đ · Suất #{group.showTimeId}</small><small>{group.reason}</small></div>)}
        </div>)}
        {pending&&<p role="status">Đang tìm thông tin...</p>}
        {error&&<p role="alert">{error} Bạn có thể bấm gửi để thử lại.</p>}
        <div ref={bottom} />
      </div>
      <div className="cine-chat-tools">
        <div className="cine-chat-filters">
          <label>Hỗ trợ<select value={topic} disabled={pending} onChange={e=>setTopic(e.target.value as Topic)}><option value="MOVIES">Gợi ý phim</option><option value="MOVIE_DETAILS">Thông tin phim đang xem</option><option value="SEATS">Gợi ý ghế cho suất đã chọn</option></select></label>
          {topic==="MOVIES"&&<><label>Thể loại<input value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Ví dụ: Hài" /></label><label>Ngày xem<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label><label>Tối đa (phút)<input type="number" min={1} max={600} value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Không giới hạn" /></label></>}
          {topic==="SEATS"&&<><label>Số người<input type="number" min={1} max={10} value={people} onChange={e=>setPeople(Number(e.target.value))} /></label><label>Ngân sách cả nhóm<input type="number" min={0} value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Không giới hạn" /></label><p>{showTimeId?"Đã nhận suất chiếu bạn chọn trên trang đặt vé.":"Hãy chọn suất chiếu trên trang đặt vé trước."}</p></>}
        </div>
        {messages.length === 1 && <div className="cine-chat-prompts">{prompts.map(prompt => <button type="button" key={prompt.label} disabled={pending} onClick={() => {const next:Topic=prompt.label==="Gợi ý ghế"?"SEATS":prompt.label==="Hỏi về phim"?"MOVIE_DETAILS":"MOVIES";setTopic(next);void send(prompt.text,next);}}>{prompt.label}</button>)}</div>}
        {<div className="cine-chat-links"><button type="button" disabled={pending} onClick={() => void send(topic === "MOVIES" ? "Tìm phim theo bộ lọc tôi chọn." : topic === "SEATS" ? "Gợi ý ghế theo điều kiện tôi chọn." : "Thông tin phim đang xem.")}>{topic === "MOVIES" ? "Tìm phim theo bộ lọc" : topic === "SEATS" ? "Tìm ghế phù hợp" : "Xem thông tin phim"}</button><button type="button" disabled={pending} onClick={() => { setError(null); setMessages([welcome()]); setDraft(""); input.current?.focus(); }}>Trò chuyện mới</button></div>}
        <form className="cine-chat-compose" onSubmit={e => { e.preventDefault(); send(); }}>
          <label className="cine-chat-sr" htmlFor="cine-chat-input">Tin nhắn cho trợ lý</label>
          <textarea id="cine-chat-input" ref={input} value={draft} maxLength={1000} rows={2} placeholder="Bạn muốn xem phim gì hôm nay?" onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
          <button type="submit" disabled={pending||!draft.trim()} aria-label="Gửi tin nhắn">↑</button>
        </form>
        <p className="cine-chat-note">Gợi ý dựa trên bộ lọc và dữ liệu rạp. Chưa hỗ trợ hỏi đáp tự do bằng AI.</p>
      </div>
    </section>}
    <button ref={launcher} type="button" className="cine-chat-launcher" aria-expanded={open} aria-controls="cine-assistant-panel" aria-label={open ? "Thu gọn trợ lý CineMovie" : "Mở trợ lý CineMovie"} onClick={() => open ? close() : setOpen(true)}><span aria-hidden="true">{open ? "×" : "✦"}</span><span>Trợ lý CineMovie</span></button>
  </div>;
}
