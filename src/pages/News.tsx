import { useEffect, useState } from "react";
import { Modal, message } from "antd";

import newsApi, { type NewsArticle } from "../services/api-news";

const storageKey = "cinemovie_saved_news";
const categories = ["Tất cả", "Tin mới", "Review phim", "Sắp chiếu", "Diễn viên", "Đã lưu"];

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    const load = async () => {
      try {
        const first = await newsApi.list();
        const data = [...first.data.data];
        for (let page = 2; page <= first.data.meta.totalPages; page++) {
          if (!active) return;
          const next = await newsApi.list(page);
          data.push(...next.data.data);
        }
        if (active) setArticles(data);
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [reload]);
  const spotlight = articles.find((article) => article.featured) || articles[0];
  const openArticle = async (article: NewsArticle) => {
    if (detailLoading) return;
    setDetailLoading(true);
    try {
      const response = await newsApi.get(article.id);
      setSelectedArticle(response.data);
    } catch {
      message.error("Không tải được bài viết. Bài có thể đã bị gỡ.");
    } finally {
      setDetailLoading(false);
    }
  };
  const [visibleCount, setVisibleCount] = useState(3);
  const [category, setCategory] = useState("Tất cả");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(stored) ? stored.filter((id): id is number => typeof id === "number") : [];
    } catch {
      return [];
    }
  });
  const toggleSaved = (article: NewsArticle) => {
    const next = savedIds.includes(article.id)
      ? savedIds.filter((id) => id !== article.id)
      : [...savedIds, article.id];
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setSavedIds(next);
    } catch {
      message.error("Không thể lưu bài trên trình duyệt này.");
    }
  };
  const filteredArticles = category === "Đã lưu"
    ? articles.filter((article) => savedIds.includes(article.id))
    : articles.filter((article) => category === "Tất cả" || article.category === category);
  const displayArticles = filteredArticles.filter((article) => article.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return (
    <main className="flex-1 flex flex-col items-center w-full">
      <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8 py-6">
        {loading && <p role="status" className="py-10 text-center text-gray-400">Đang tải tin tức...</p>}
        {loadError && <div role="alert" className="py-6 text-center text-white">Không tải được tin tức. <button type="button" className="text-primary underline" onClick={() => setReload((value) => value + 1)}>Thử lại</button></div>}
        {!loading && !loadError && spotlight && (
        <>
        {/* Hero Section */}
        <div className="mb-10">
          <div className="group relative overflow-hidden rounded-xl shadow-2xl">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end p-6 md:p-10 transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(34, 16, 19, 1), transparent), url("${spotlight.image}")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
              <div className="relative z-10 flex flex-col gap-3 text-left max-w-2xl">
                <span className="inline-flex items-center gap-1 w-fit px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">
                    star
                  </span>{" "}
                  Spotlight
                </span>
                <h1 className="text-white text-3xl md:text-5xl font-black">{spotlight.title}</h1>
                <p className="text-gray-200 text-sm md:text-lg">{spotlight.summary}</p>
                <div className="flex gap-4 mt-2">
                  <button type="button" onClick={() => void openArticle(spotlight)} className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-red-600 text-white text-base font-bold transition-all transform hover:translate-y-[-2px]">
                    <span>Đọc ngay</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </button>
                  <button type="button" aria-pressed={savedIds.includes(spotlight.id)} onClick={() => toggleSaved(spotlight)} className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 text-white text-base font-bold backdrop-blur-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">
                      bookmark
                    </span>
                    <span>{savedIds.includes(spotlight.id) ? "Bỏ lưu" : "Lưu lại"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        </>
        )}
        {!loading && !loadError && (
        <>
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <h1 className="text-white text-3xl font-bold leading-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              newspaper
            </span>
            Tin tức mới nhất
          </h1>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar" aria-label="Danh mục tin tức">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => { setCategory(item); setVisibleCount(3); }}
                className={`h-9 shrink-0 rounded-lg px-4 text-sm font-medium transition-colors ${category === item ? "bg-primary text-white" : "bg-[#2f161a] border border-[#482329] text-gray-300 hover:border-primary"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <input type="search" aria-label="Tìm tin tức" placeholder="Tìm bài viết..." value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(3); }} className="w-full mb-6 p-3 rounded-lg bg-[#2f161a] text-white border border-[#482329]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayArticles.slice(0, visibleCount).map((article) => (
            <article key={article.id} className="flex flex-col gap-3 bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all">
              <button type="button" onClick={() => void openArticle(article)} className="group text-left flex flex-col gap-3 flex-1">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                  <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${article.image}")` }} />
                  <span className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white">{article.category}</span>
                </div>
                <h3 className="text-white text-lg font-bold group-hover:text-primary">{article.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{article.summary}</p>
              </button>
              <button type="button" aria-pressed={savedIds.includes(article.id)} onClick={() => toggleSaved(article)} className="self-start text-primary text-sm hover:underline">
                {savedIds.includes(article.id) ? "Bỏ lưu" : "Lưu lại"}
              </button>
            </article>
          ))}
          {displayArticles.length === 0 && (
            <p role="status" className="col-span-full py-10 text-center text-gray-400">
              {category === "Đã lưu" ? "Bạn chưa lưu bài viết nào." : "Chưa có tin tức trong danh mục này."}
            </p>
          )}
        </div>

        {/* Pagination / Load More */}
        <div className="flex justify-center pb-12">
          {visibleCount < displayArticles.length ? (
          <button type="button" onClick={() => setVisibleCount((count) => Math.min(count + 3, displayArticles.length))} className="group flex items-center justify-center gap-2 bg-[#2f161a] border border-[#482329] hover:border-primary text-white font-medium py-3 px-8 rounded-lg transition-all hover:bg-white/5">
            <span className="group-hover:text-primary transition-colors">
              Xem thêm tin tức
            </span>
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform text-primary">
              expand_more
            </span>
          </button>
          ) : displayArticles.length > 0 ? (
            <p role="status" className="text-gray-400">Bạn đã xem hết tin tức.</p>
          ) : null}
        </div>
        </>
        )}
      </div>
      <Modal
        open={selectedArticle !== null}
        title={selectedArticle?.title}
        onCancel={() => setSelectedArticle(null)}
        footer={selectedArticle && (
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => toggleSaved(selectedArticle)} className="text-primary">
              {savedIds.includes(selectedArticle.id) ? "Bỏ lưu" : "Lưu lại"}
            </button>
            <button type="button" onClick={() => setSelectedArticle(null)}>Đóng</button>
          </div>
        )}
      >
        {selectedArticle && (
          <div className="space-y-4">
            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full rounded-lg aspect-video object-cover" />
            <p className="font-medium">{selectedArticle.summary}</p>
            <p className="whitespace-pre-wrap">{selectedArticle.content}</p>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default News;
