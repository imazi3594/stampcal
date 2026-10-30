import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare, Share } from "lucide-react";
import { loadSaved } from "@/lib/stamp-settings";
import { applyCrisis, applySolveMode } from "@/lib/theme";

const FEATURES = [
  { icon: "✨", title: "自訂面值", body: "支援紀念郵票、特別郵票或舊款郵票面額。" },
  { icon: "📦", title: "庫存管理", body: "可隨時將缺貨的通用郵票標示為缺貨，組合僅計算有貨面值。" },
  { icon: "🌐", title: "離線使用", body: "採用 PWA 技術，沒有網絡也能照常運算。" },
  { icon: "🌙", title: "深色模式", body: "支援淺色／深色主題，呵護雙眼。" },
] as const;

export function AboutPage() {
  const [copied, setCopied] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");

  useEffect(() => {
    const saved = loadSaved();
    applyCrisis(saved.enabled.length === 0 && saved.extras.length === 0);
    applySolveMode(saved.mode);
  }, []);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}`;
    const shareText = `郵票組合計數機\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* user cancelled */
    }
  }

  function sendFeedback() {
    const text = feedback.trim();
    if (!text) {
      setFeedbackNote("請先寫低意見。");
      return;
    }
    const href = `mailto:nova0818@gmail.com?subject=${encodeURIComponent("郵票計數機意見")}&body=${encodeURIComponent(text)}`;
    window.location.href = href;
    setFeedbackNote("已開啟電郵程式，請按發送。");
  }

  return (
    <div className="relative mx-auto flex w-full max-w-lg min-w-0 flex-col overflow-x-hidden">
      <header className="sticky top-0 z-10 flex items-center gap-1 bg-bg px-4 py-3 sm:px-6">
        <Link
          to="/"
          aria-label="返回計數機"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-ink transition-[background-color] duration-(--motion-quick) ease-(--ease-smooth-out) hover:bg-surface-2"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="flex h-10 items-center text-lg leading-none font-semibold tracking-tight text-ink">關於</h1>
      </header>

      <img src="/about-banner.jpg" alt="" className="block h-auto w-full max-w-full shrink-0" />

      <div className="flex flex-col gap-12 px-4 pt-6 pb-8 sm:px-6">

      <section className="stagger-in overflow-visible text-center">
        <h2 className="mt-4 font-sans text-[1.65rem] font-bold tracking-tight text-ink">郵票組合計數機</h2>
        <p className="mt-3 flex max-w-full flex-wrap items-center justify-center gap-2.5 px-1 font-display text-[0.625rem] font-semibold tracking-[0.08em] text-primary">
          <span className="h-px w-7 bg-primary/45" aria-hidden />
          STAMP COMBINATION CALCULATOR
          <span className="h-px w-7 bg-primary/45" aria-hidden />
        </p>
      </section>

      <section className="stagger-in" style={{ animationDelay: "60ms" }}>
        <SectionTitle>關於本程式</SectionTitle>
        <p className="mt-5 text-[0.9375rem] leading-[1.9] text-muted">
          這是一個郵票組合的智能計算工具。當您手邊有多種不同面值的郵票，卻不知道如何組合成目標郵費時，本程式能即時為您運算最理想的貼法。
        </p>
      </section>

      <section className="stagger-in" style={{ animationDelay: "110ms" }}>
        <SectionTitle>計算邏輯與演算法</SectionTitle>
        <div className="mt-5 overflow-hidden rounded-2xl bg-surface px-4 shadow-(--shadow-border)">
          <div className="flex items-start gap-3.5 py-5">
            <span className="w-8 shrink-0 text-center text-lg leading-7" aria-hidden>
              🔢
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-7 text-[#009247]">最少郵票</p>
              <p className="mt-1.5 text-sm leading-[1.8] text-muted">優先尋找「最少郵票總數」的方案，節省信封空間。</p>
            </div>
          </div>
          <div className="h-px bg-border/80" />
          <div className="flex items-start gap-3.5 py-5">
            <span className="w-8 shrink-0 text-center text-lg leading-7" aria-hidden>
              💲
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-7 text-[#7c3aed]">減少種類</p>
              <p className="mt-1.5 text-sm leading-[1.8] text-muted">
                減少面值種類，以減少撕下郵票次數。但郵票數量會有所增加。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stagger-in" style={{ animationDelay: "160ms" }}>
        <SectionTitle>核心功能</SectionTitle>
        <ul className="mt-5 flex flex-col gap-3.5">
          {FEATURES.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-surface px-4 py-5 shadow-(--shadow-border)"
            >
              <span className="w-8 shrink-0 text-center text-xl leading-7" aria-hidden>
                {item.icon}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-semibold leading-snug text-ink">{item.title}</p>
                <p className="mt-1.5 text-sm leading-[1.8] text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="stagger-in" style={{ animationDelay: "200ms" }}>
        <SectionTitle>提供意見</SectionTitle>
        <p className="mt-5 text-sm leading-[1.8] text-muted">寫低短評，會用電郵寄出。唔使上網都可以開電郵程式。</p>
        {feedbackOpen ? (
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendFeedback();
            }}
          >
            <textarea
              value={feedback}
              maxLength={500}
              rows={4}
              placeholder="有咩想講？"
              aria-label="意見內容"
              onChange={(event) => {
                setFeedback(event.target.value);
                if (feedbackNote) setFeedbackNote("");
              }}
              className="w-full resize-none rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm leading-[1.8] text-ink shadow-(--shadow-border) outline-none placeholder:text-subtle"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFeedbackOpen(false);
                  setFeedbackNote("");
                }}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-ink"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg"
              >
                送出
              </button>
            </div>
            {feedbackNote ? <p className="text-sm text-muted">{feedbackNote}</p> : null}
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-surface text-sm font-semibold text-ink shadow-(--shadow-border)"
          >
            <MessageSquare className="size-4" aria-hidden />
            提供意見
          </button>
        )}
      </section>

      <footer className="stagger-in flex flex-col items-center gap-4 pb-6 text-center" style={{ animationDelay: "250ms" }}>
        <a
          href="https://grok.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-surface py-1.5 pr-2.5 pl-2.5 no-underline shadow-(--shadow-border) transition-[transform,background-color] duration-(--motion-quick) ease-(--ease-smooth-out) hover:bg-surface-2"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/12 text-primary">
            <GrokMark className="size-3.5" />
          </span>
          <span className="flex items-center gap-1.5 pr-0.5">
            <span className="text-[0.625rem] font-semibold tracking-[0.16em] text-subtle">BUILT WITH</span>
            <span className="font-display text-[0.95rem] font-semibold tracking-tight text-ink">Grok</span>
            <span className="rounded-md bg-primary/12 px-1.5 py-0.5 font-display text-[0.625rem] font-bold tracking-wide text-primary">
              AI
            </span>
          </span>
        </a>
        <p className="max-w-[22rem] px-1 text-[0.875rem] leading-[1.85] text-subtle">
          本應用程式之介面及運算由Grok協助開發而成。
        </p>
        <div className="mt-1 flex w-full gap-3">
          <button
            type="button"
            onClick={() => void share()}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-surface-2 text-sm font-semibold text-ink transition-[background-color] duration-(--motion-quick) ease-(--ease-smooth-out) hover:bg-border"
          >
            <Share className="size-4" aria-hidden />
            {copied ? "已複製連結" : "分享程式"}
          </button>
          <Link
            to="/"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg transition-[opacity] duration-(--motion-quick) ease-(--ease-smooth-out) hover:opacity-90"
          >
            返回首頁
          </Link>
        </div>
      </footer>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-3 font-sans text-[1.0625rem] leading-none font-bold tracking-tight text-ink">
      <span className="h-[1.05em] w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
      {children}
    </h2>
  );
}

function GrokMark({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 11.5714" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4.63453 7.42767L8.62395 4.46607C8.81953 4.32088 9.09907 4.37752 9.19225 4.60303C9.68274 5.79241 9.46361 7.22172 8.48776 8.20308C7.5119 9.18444 6.15411 9.39966 4.91305 8.9095L3.5573 9.54074C5.50184 10.8774 7.86313 10.5468 9.33868 9.0619C10.5091 7.88488 10.8716 6.28051 10.5326 4.8337L10.5357 4.83679C10.0442 2.71136 10.6565 1.86181 11.9109 0.124601C11.9406 0.0834107 11.9703 0.0422202 12 0L10.3493 1.65998V1.65483L4.6335 7.4287"
      />
      <path
        fill="currentColor"
        d="M3.81125 8.14747C2.41556 6.80672 2.6562 4.73175 3.84709 3.53517C4.72771 2.64958 6.17049 2.28813 7.42999 2.81949L8.78266 2.19133C8.53895 2.01421 8.22664 1.82371 7.86825 1.68984C6.24832 1.01946 4.3089 1.35311 2.99206 2.67635C1.7254 3.95016 1.32708 5.90877 2.01109 7.58007C2.52206 8.82917 1.68444 9.71271 0.840686 10.6045C0.541684 10.9206 0.241659 11.2368 0 11.5714L3.81022 8.1485"
      />
    </svg>
  );
}
