// ============================
// ここだけ編集すれば商品差し替えOK
// ============================
const PRODUCTS = [
  {
    name: "CBDリキッド（仮）Sativa / Citrus",
    priceJPY: null, // 未定なら null
    cbdMg: 300,
    volumeMl: 1.0,
    tags: ["フレーバー：シトラス", "濃度：後で設定", "限定：未定"],
    note: "発売日・在庫・詳細は準備中。後で差し替え可能。",
    buyUrl: "#contact"
  },
  {
    name: "CBDリキッド（仮）Hybrid / Berry",
    priceJPY: 9800,
    cbdMg: 500,
    volumeMl: 1.0,
    tags: ["フレーバー：ベリー", "吸い心地：マイルド", "第三者検査：予定"],
    note: "説明文をここに。効能ではなく特徴（香り/原料/検査など）を書くのが無難。",
    buyUrl: "#contact"
  },
  {
    name: "CBDリキッド（仮）Indica / Mint",
    priceJPY: 6500,
    cbdMg: 300,
    volumeMl: 0.8,
    tags: ["フレーバー：ミント", "持ち運び：軽量", "初心者向け：未定"],
    note: "商品詳細・価格・写真は後から差し替え。",
    buyUrl: "#contact"
  }
];

// ============================
// 表示ロジック（触らなくてOK）
// ============================
const $ = (q) => document.querySelector(q);

function formatJPY(v){
  if (v === null || v === undefined) return "価格未定";
  try {
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(v);
  } catch {
    return `¥${v}`;
  }
}

function renderProducts(){
  const grid = $("#productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const meta = [
      (p.volumeMl ? `${p.volumeMl}ml` : null),
      (p.cbdMg ? `CBD ${p.cbdMg}mg（表記は後で調整）` : null),
    ].filter(Boolean).join(" / ");

    const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    return `
      <article class="pcard">
        <div class="pcard__img" aria-hidden="true"></div>
        <div class="pcard__body">
          <div class="pcard__top">
            <div class="pcard__name">${escapeHtml(p.name)}</div>
            <div class="pcard__price">${formatJPY(p.priceJPY)}</div>
          </div>
          <div class="pcard__meta">${escapeHtml(meta)}</div>
          <div class="pcard__tags">${tags}</div>
          <div class="pcard__meta">${escapeHtml(p.note || "")}</div>
          <div class="pcard__actions">
            <a class="btn btn--primary" href="${p.buyUrl || "#contact"}">購入/相談する</a>
            <a class="btn btn--ghost" href="#quality">品質を見る</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function setupMobileMenu(){
  const btn = $("#menuBtn");
  const drawer = $("#drawer");
  if(!btn || !drawer) return;

  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const open = !drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  drawer.addEventListener("click", (e) => {
    if (e.target && e.target.matches("a")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setupToTop(){
  const btn = $("#toTop");
  if(!btn) return;

  const onScroll = () => {
    const show = window.scrollY > 600;
    btn.classList.toggle("is-show", show);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
}

function setupAgeGate(){
  const modal = $("#ageModal");
  const yes = $("#ageYes");
  const key = "age_ok_v1";

  if(!modal || !yes) return;

  const ok = localStorage.getItem(key) === "1";
  if(!ok){
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  yes.addEventListener("click", () => {
    localStorage.setItem(key, "1");
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  });
}

function setYear(){
  const y = $("#year");
  if(y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupMobileMenu();
  setupToTop();
  setupAgeGate();
  setYear();
});
