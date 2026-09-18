import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import "./MovieAssistant.css";

type Message = { id: number; role: "assistant" | "user"; text: string };
const welcome = (): Message => ({ id: 0, role: "assistant", text: "Chào bạn! Bạn muốn tìm phim cho buổi hẹn, hỏi về một bộ phim hay chọn ghế cho nhóm bạn?" });
const prompts = [
  { label: "Gợi ý phim", text: "Tôi muốn tìm một bộ phim phù hợp để xem cuối tuần." },
  { label: "Hỏi về phim", text: "Giúp tôi tìm hiểu nội dung và thể loại phim, không tiết lộ kết thúc." },
  { label: "Gợi ý ghế", text: "Tôi muốn chọn hai ghế liền nhau, gần giữa phòng chiếu." },
];

export default function MovieAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome()]);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const filmId = location.pathname.match(/^\/(?:movie|booking)\/(\d+)(?:\/booking)?$/)?.[1];

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { if (open) bottom.current?.scrollIntoView({ block: "nearest" }); }, [messages, open]);
  const close = () => { setOpen(false); launcher.current?.focus(); };
  const send = (text = draft) => {
    const content = text.trim();
    if (!content) return;
    // Replace this local reply with the backend chat request when AI is integrated.
    setMessages(current => [...current,
      { id: Date.now(), role: "user", text: content },
      { id: Date.now() + 1, role: "assistant", text: "Tôi chưa thể trả lời yêu cầu này vì trợ lý đang được hoàn thiện. Bạn có thể xem danh sách phim và suất chiếu bằng nút bên dưới. Để chọn ghế, hãy chọn một suất chiếu trước nhé." },
    ]);
    setDraft("");
    input.current?.focus();
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
        {messages.map(item => <div key={item.id} className={`cine-chat-message cine-chat-message-${item.role}`}><span className="cine-chat-author">{item.role === "user" ? "Bạn" : "CineMovie"}</span><p>{item.text}</p></div>)}
        <div ref={bottom} />
      </div>
      <div className="cine-chat-tools">
        {messages.length === 1 && <div className="cine-chat-prompts">{prompts.map(prompt => <button type="button" key={prompt.label} onClick={() => send(prompt.text)}>{prompt.label}</button>)}</div>}
        {messages.length > 1 && <div className="cine-chat-links"><Link to={filmId ? `/movie/${filmId}/booking` : "/movie"} onClick={close}>{filmId ? "Xem suất chiếu" : "Khám phá phim"} ↗</Link><button type="button" onClick={() => { setMessages([welcome()]); setDraft(""); input.current?.focus(); }}>Trò chuyện mới</button></div>}
        <form className="cine-chat-compose" onSubmit={e => { e.preventDefault(); send(); }}>
          <label className="cine-chat-sr" htmlFor="cine-chat-input">Tin nhắn cho trợ lý</label>
          <textarea id="cine-chat-input" ref={input} value={draft} maxLength={1000} rows={2} placeholder="Bạn muốn xem phim gì hôm nay?" onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
          <button type="submit" disabled={!draft.trim()} aria-label="Gửi tin nhắn">↑</button>
        </form>
        <p className="cine-chat-note">Trợ lý đang được hoàn thiện. Vui lòng xem thông tin đặt vé trên trang phim.</p>
      </div>
    </section>}
    <button ref={launcher} type="button" className="cine-chat-launcher" aria-expanded={open} aria-controls="cine-assistant-panel" aria-label={open ? "Thu gọn trợ lý CineMovie" : "Mở trợ lý CineMovie"} onClick={() => open ? close() : setOpen(true)}><span aria-hidden="true">{open ? "×" : "✦"}</span><span>Trợ lý CineMovie</span></button>
  </div>;
}
