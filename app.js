const INSTAGRAM_URL = "https://www.instagram.com/519yuu.k?igsh=MTIzMm5xeGZzMTk4dQ==";

// ======= カテゴリ（greenagentの導線を参考） =======
// テルペン / 原料販売 / 全ての商品 / 大口注文 / FAQ のような“迷子にさせない導線”をLP向けに簡略化
const CATEGORIES = [
  { key: "all", label: "全て" },
  { key: "vape", label: "Vapeリキッド" },
  { key: "terpene", label: "テルペン" },
  { key: "gear", label: "備品" },
  { key: "raw", label: "原料（準備中）" },
];

// ======= 商品（例：15個） =======
// ※ greenagentの価格帯・容量表示の“見せ方”を参考にしたサンプルです。
// ※ 実運用では、あなたの商品の実データに差し替えてください。
const PRODUCTS = [
  // --- Vape（例：greenagentに1.0ml/¥2,500 の記載がある商品） ---
  {
    id: "vape-chill",
    category: "vape",
    name: "Chill Vape リキッド（1.0ml）",
    priceJPY: 2500,
    volumeMl: 1.0,
    image: "assets/S__17571846_0.jpg",
    tags: ["1.0ml", "Vape"],
    ingredients: [
      "CBD 25%", "CBG 25%", "CBN Distillate 40%", "テルペン 10%",
      "増粘剤・希釈剤不使用（設計例）"
    ],
    desc: "商品説明は準備中。香り・配合・使用方法・注意事項をここに追記。",
  },

  // --- Vape（残りは“差し替え前提”の仮データ） ---
  ...Array.from({ length: 7 }, (_, i) => {
    const n = String(i + 2).padStart(2, "0");
    const img = (i % 2 === 0) ? "assets/S__17571844_0.jpg" : "assets/S__17571846_0.jpg";
    const priceList = [6500, 8500, 9800, 11000, 16000, 9800, 3800]; // 価格帯の見せ方例
    return {
      id: `vape-${n}`,
      category: "vape",
      name: `Vapeリキッド（仮）${n}`,
      priceJPY: priceList[i] ?? 9900,
      volumeMl: 1.0,
      image: img,
      tags: ["1.0ml", "Vape", "準備中"],
      ingredients: ["CBD/CBG/CBN など（準備中）", "テルペン（準備中）"],
      desc: "成分・フレーバー・特徴は後で差し替え。",
    };
  }),

  // --- テルペン（greenagentの“EYBNA 1ml ¥3,000”などを参考） ---
  {
    id: "terp-01",
    category: "terpene",
    name: "テルペン（例）EYBNA系 - Blueberry -（1ml）",
    priceJPY: 3000,
    volumeMl: 1.0,
    image: "assets/S__17571844_0.jpg",
    tags: ["テルペン", "1ml"],
    ingredients: ["テルペン"],
    desc: "香りの設計用（商品説明はあなたの運用に合わせて調整）。",
  },
  ...Array.from({ length: 4 }, (_, i) => {
    const names = ["Hindu Kush", "Tahoe OG", "Banana Kush", "Strawberry Diesel"];
    const img = (i % 2 === 0) ? "assets/S__17571846_0.jpg" : "assets/S__17571844_0.jpg";
    return {
      id: `terp-0${i + 2}`,
      category: "terpene",
      name: `テルペン（例）EYBNA系 - ${names[i]} -（1ml）`,
      priceJPY: 3000,
      volumeMl: 1.0,
      image: img,
      tags: ["テルペン", "1ml"],
      ingredients: ["テルペン"],
      desc: "商品説明は準備中（香りの特徴などを後で追記）。",
    };
  }),

  // --- 備品（例：510バッテリー） ---
  {
    id: "gear-01",
    category: "gear",
    name: "510規格 バッテリー（備品）",
    priceJPY: 2300,
    volumeMl: null,
    image: "assets/S__17571846_0.jpg",
    tags: ["備品", "510"],
    ingredients: [],
    desc: "備品説明は準備中（互換性・充電方式・注意事項など）。",
  },

  // --- 原料（準備中） ---
  {
    id: "raw-01",
    category: "raw",
    name: "原料（準備中）",
    priceJPY: null,
    volumeMl: null,
    image: "assets/S__17571844_0.jpg",
    tags: ["原料", "準備中"],
    ingredients: [],
    desc: "原料販売をする場合の説明枠（法令・運用に合わせて慎重に）。",
  },
];

// ======= FAQ（greenagentの運用項目を“要点だけ”参考にしたテンプレ） =======
// ※あなたの運用に合わせて文言は調整してください。
const FAQS = [
  {
    q: "送料はかかりますか？",
    a: "送料無料運用を想定（後で変更可）。",
  },
  {
    q: "発送までどれくらい？",
    a: "入金確認後、2日以内発送を目安（運用に合わせて調整）。",
  },
  {
    q: "配送は国内のみ？",
    a: "国内配送のみの運用を想定。",
  },
  {
    q: "支払い方法は？",
    a: "銀行振込 / PayPay を想定（後で変更可）。",
  },
  {
    q: "梱包はどんな形？",
    a: "クリックポスト等の配送・品名は雑貨表記など、運用例があります（あなたの運用に合わせて調整）。",
  },
  {
    q: "返品・返金はできますか？",
    a: "原則不可、初期不良のみ期限付き対応などの運用例があります（あなたの運用に合わせて調整）。",
  },
  {
    q: "問い合わせ先は？",
    a: "Instagram DMで対応します。",
  },
];

// ======= 表示ロジック =======
const $ = (q) => document.querySelector(q);

let activeCategory = "all";
let keyword = "";

function formatJPY(v){
  if (v === null || v === undefined) return "価格未定";
  try {
    return new Intl.NumberFormat("ja-JP", { style:"currency", currency:"JPY" }).format(v);
  } catch {
    return `¥${v}`;
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function setInstaLinks(){
  ["navInsta","drawerInsta","heroInsta","footerInsta"].forEach((id) => {
    const el = document.getElementById(id);
    if(el){
      el.href = INSTAGRAM_URL;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });
}

function renderCategoryChips(){
  const wrap = $("#catChips");
  if(!wrap) return;

  wrap.innerHTML = CATEGORIES.map(c => `
    <button class="chip ${c.key===activeCategory ? "is-active":""}"
            type="button" data-cat="${c.key}">
      ${escapeHtml(c.label)}
    </button>
  `).join("");

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if(!btn) return;
    activeCategory = btn.dataset.cat;
    renderCategoryChips();
    renderProducts();
  });
}

function getFiltered(){
  const k = keyword.trim().toLowerCase();
  return PRODUCTS.filter(p => {
    const catOk = (activeCategory === "all") || (p.category === activeCategory);
    if(!catOk) return false;
    if(!k) return true;

    const hay = [
      p.name,
      ...(p.tags || []),
      ...(p.ingredients || [])
    ].join(" ").toLowerCase();
    return hay.includes(k);
  });
}

function renderProducts(){
  const grid = $("#productGrid");
  if (!grid) return;

  const list = getFiltered();

  grid.innerHTML = list.map((p) => {
    const metaParts = [];
    if (p.volumeMl) metaParts.push(`${p.volumeMl}ml`);
    const meta = metaParts.join(" / ");

    const tags = (p.tags || []).slice(0,4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    const imgStyle = p.image ? `style="background-image:url('${encodeURI(p.image)}')"` : "";

    // 原材料は詳細ページじゃなくても軽く見せる（コンパクト表示では隠れる）
    const ing = (p.ingredients || []).slice(0,3).join(" / ");

    return `
      <article class="pcard">
        <div class="pcard__img" ${imgStyle}></div>
        <div class="pcard__body">
          <div class="pcard__top">
            <div class="pcard__name">${escapeHtml(p.name)}</div>
            <div class="pcard__price">${formatJPY(p.priceJPY)}</div>
          </div>

          ${meta ? `<div class="pcard__meta">${escapeHtml(meta)}</div>` : ""}
          ${ing ? `<div class="pcard__meta">原材料：${escapeHtml(ing)}${(p.ingredients||[]).length>3 ? "…" : ""}</div>` : ""}

          <div class="pcard__tags">${tags}</div>

          <div class="pcard__actions">
            <a class="btn btn--primary" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Instagramで相談</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderFaq(){
  const wrap = $("#faqList");
  if(!wrap) return;

  wrap.innerHTML = FAQS.map(item => `
    <details class="faq__item">
      <summary>${escapeHtml(item.q)}</summary>
      <p class="muted">${escapeHtml(item.a)}</p>
    </details>
  `).join("");
}

function setupSearch(){
  const input = $("#searchInput");
  if(!input) return;
  input.addEventListener("input", () => {
    keyword = input.value || "";
    renderProducts();
  });
}

function setupDensity(){
  const btn = $("#densityBtn");
  const key = "density_v1";
  const saved = localStorage.getItem(key);

  // スマホは最初から“コンパクト寄り”に（表示数を増やす）
  const isMobile = window.matchMedia("(max-width: 520px)").matches;
  const shouldDense = saved ? (saved === "1") : isMobile;
  document.body.classList.toggle("dense", shouldDense);

  if(btn){
    btn.addEventListener("click", () => {
      const next = !document.body.classList.contains("dense");
      document.body.classList.toggle("dense", next);
      localStorage.setItem(key, next ? "1" : "0");
    });
  }
}

function setupMobileMenu(){
  const btn = $("#menuBtn");
  const drawer = $("#drawer");
  if(!btn || !drawer) return;

  btn.addEventListener("click", () => {
    const open = !drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  drawer.addEventListener("click", (e) => {
    if(e.target && e.target.matches("a")) drawer.classList.remove("is-open");
  });
}

function setupToTop(){
  const btn = $("#toTop");
  if(!btn) return;

  const onScroll = () => btn.classList.toggle("is-show", window.scrollY > 600);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
}

function setYear(){
  const y = $("#year");
  if(y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setInstaLinks();
  renderCategoryChips();
  setupSearch();
  setupDensity();
  renderProducts();
  renderFaq();
  setupMobileMenu();
  setupToTop();
  setYear();
});
