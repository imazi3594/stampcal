import { useEffect, useState } from "react";
import { Copy, Download, Share, Smartphone } from "lucide-react";
import { CARD_COUNT, DATA_META } from "@/data/catalog";
import { deviceKind, isStandalone, subscribeInstall, type BeforeInstall } from "@/lib/install";

const PAGE_URL = "https://imazi3594.github.io/ek-scout/";

export function AboutPage() {
  const [installEvent, setInstallEvent] = useState<BeforeInstall | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [iosChrome, setIosChrome] = useState(false);
  const [android, setAndroid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    setInstalled(isStandalone());
    const kind = deviceKind();
    setIos(kind.ios);
    setIosChrome(kind.iosChrome);
    setAndroid(kind.android);
    return subscribeInstall(setInstallEvent);
  }, []);

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      return;
    }
    if (iosChrome) {
      setHint("iPhone 的 Chrome 安裝後仍會顯示地址欄。若要隱藏 toolbar，請以 Safari 開啟並加到主畫面。");
      return;
    }
    if (ios) {
      setHint("按底欄分享鍵，再選「加到主畫面」。請勿使用 Chrome。");
      return;
    }
    if (android) {
      setHint("Chrome 右上 ⋮ → 選「安裝應用程式」。請勿選「加到主畫面」，該選項會保留地址欄。");
      return;
    }
    setHint("用 Chrome 右上 ⋮ →「安裝應用程式」。");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(PAGE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setHint(PAGE_URL);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <img
          src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
          alt=""
          width={96}
          height={96}
          className="size-24 rounded-3xl shadow-[var(--shadow-border)]"
        />
        <div className="mt-4 flex items-center gap-2">
          <h2 className="font-display text-2xl tracking-tight">英傑大戦⚡️速查</h2>
        </div>
        <p className="mt-2 text-sm text-muted">對戰用口袋手冊　·　{CARD_COUNT} 張</p>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-pretty text-fg">
        對戰時輸入名稱、卡號或計略，即可查看時長（C）、武力／回血、渾身三欄、琥煌 0–6 劍。專為單手速查而設。
      </p>

      <section className="mt-6 rounded-lg border border-white/10 bg-black/35 p-4">
        <p className="flex items-center gap-2 text-xs text-faint">
          <Smartphone className="size-3.5" />
          安裝為獨立 App（無地址欄）
        </p>
        {installed ? (
          <p className="mt-3 text-sm text-fg">目前已是獨立畫面。之後由主畫面閃電圖示開啟即可。</p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void install()}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-black bg-cost font-medium text-black"
            >
              <Download className="size-4" />
              安裝到手機
            </button>
            {hint ? <p className="mt-3 text-sm leading-relaxed text-pretty text-fg">{hint}</p> : null}

            {iosChrome ? (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <p className="text-fg">iPhone Chrome 無法隱藏 toolbar。請改用 Safari：</p>
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-surface-2 text-fg"
                >
                  <Copy className="size-4" />
                  {copied ? "已複製網址" : "複製網址"}
                </button>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>打開 Safari，貼上網址</li>
                  <li>
                    按底欄
                    <Share className="mx-1 inline size-3.5 align-[-2px]" />
                    分享
                  </li>
                  <li>選「加到主畫面」→「加入」</li>
                </ol>
              </div>
            ) : ios ? (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                <li>
                  按 Safari 底欄
                  <Share className="mx-1 inline size-3.5 align-[-2px]" />
                  分享
                </li>
                <li>向上滑，選「加到主畫面」</li>
                <li>右上角「加入」。由主畫面閃電圖示開啟即無地址欄。</li>
              </ol>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Android Chrome 須選「安裝應用程式」，請勿選「加到主畫面」——後者會保留 browser toolbar。
              </p>
            )}
          </>
        )}
      </section>

      <section className="mt-4 rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-relaxed text-pretty text-muted">
        <p className="text-xs text-faint">資料版本</p>
        <p className="mt-2 text-fg">英傑大戦 Ver.{DATA_META.gameVer}</p>
        <p className="mt-1">{DATA_META.pack}</p>
        <p className="mt-1 tabular-nums">遊戲更新 {DATA_META.gameDate.replaceAll("-", "/")}　資料擷取 {DATA_META.dataDate.replaceAll("-", "/")}</p>
        <p className="mt-3">
          數值整理自{" "}
          <a className="text-fg underline decoration-border underline-offset-2" href="https://eiketsudb.com/" target="_blank" rel="noreferrer">
            eiketsudb.com
          </a>
          ，對戰時不必另開官網翻查。
        </p>
        <p className="mt-3">英傑大戦為 SEGA 的遊戲。此為玩家自用速查，與官方無關。</p>
      </section>

      <section className="mt-4 rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-relaxed text-pretty text-muted">
        <p className="text-xs text-faint">Credit</p>
        <p className="mt-2 text-fg">Grok（xAI）設計與製作</p>
        <p className="mt-1">
          開源：{" "}
          <a
            className="text-fg underline decoration-border underline-offset-2"
            href="https://github.com/imazi3594/ek-scout"
            target="_blank"
            rel="noreferrer"
          >
            github.com/imazi3594/ek-scout
          </a>
        </p>
      </section>
    </div>
  );
}
