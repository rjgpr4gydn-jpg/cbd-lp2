// ============================
// ここだけ編集すれば商品差し替えOK
// ============================
const INSTAGRAM_URL = "https://www.instagram.com/519yuu.k?igsh=MTIzMm5xeGZzMTk4dQ==";

const PRODUCTS = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const flavorList = [
    "Citrus", "Berry", "Mint", "Grape", "Mango",
    "Peach", "Cola", "Apple", "Lemon", "Pine",
    "Vanilla", "Coffee", "Melon", "Lychee", "Tropical"
  ];
  const flavor = flavorList[i] || "Flavor";

  // 2枚の画像を交互に使う
  const img = (i % 2 === 0)
    ? "assets/S__17571846_0.jpg"
    : "assets/S__17571844_0.jpg";

  return {
    name: `CBDリキッド（仮）${n} / ${flavor}`,
    priceJPY: 9900,           // 9900円統一（仮）
    cbdMg: null,              // 未定なら null（表示しない）
    volumeMl: 1.0,            // 仮
    image: img,               // 商品画像
    tags: [
      `フレーバー：${flavor}`,
      "成分：準備中",
      "検査：準備中"
    ],
    note: "※商品詳細・成分・検査情報・在庫は準備中（後で差し替え）",
    buyUrl: INSTAGRAM_URL
  };
});

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
    const metaParts = [];
    if (p.volumeMl) metaParts.push(`${p.volumeMl}ml`);
    if (p.cbdMg) metaParts.push(`CBD ${p.cbdMg}mg`);
    const meta = metaParts.join(" / ");

    const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    const bgStyle = p.image
      ? `style="background-image:url('${encodeURI(p.image)}')"`
      : "";

    return `
      <article class="pcard">
        <div class="pcard__img" ${bgStyle} aria-hidden="true"></div>
        <div class="pcard__body">
          <div class="pcard__top">
            <div class="pcard__name">${escapeHtml(p.name)}</div>
            <div class="pcard__price">${formatJPY(p.priceJPY)}</div>
          </div>

          ${meta ? `<div class="pcard__meta">${escapeHtml(meta)}</div>` : ""}

          <div class="pcard__tags">${tags}</div>

          <div class="pcard__meta">${escapeHtml(p.note || "")}</div>

          <div class="pcard__actions">
            <a class="btn btn--primary"
               href="${p.buyUrl || "#contact"}"
               target="_blank" rel="noopener">
              Instagramで相談する
            </a>
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
