const defaultConfig = {
  bannerText: "Sichtbarkeit starten: Nur heute 15 % Rabatt mit Code START15",
  couponCode: "START15",
  couponRate: 0.15,
  countdownLabel: "Kurzfristiger Aktionscode",
  reviewMode: "empty"
};

const baseProducts = {
  "instagram-follower-kaufen": {
    platform: "Instagram",
    type: "Follower",
    keyword: "Instagram Follower kaufen",
    title: "Instagram Follower kaufen",
    headline: "Instagram Follower kaufen und dein Profil stärker sichtbar machen",
    short: "Follower-Pakete für einen professionelleren ersten Eindruck auf deinem Profil.",
    badge: "Beliebt",
    quantities: [[100, 2.99], [250, 5.99], [500, 9.99], [1000, 16.99], [2500, 34.99], [5000, 59.99], [10000, 99.99]]
  },
  "instagram-likes-kaufen": {
    platform: "Instagram",
    type: "Likes",
    keyword: "Instagram Likes kaufen",
    title: "Instagram Likes kaufen",
    headline: "Instagram Likes kaufen und Beiträge sichtbarer wirken lassen",
    short: "Like-Pakete für Posts, Kampagnen und neue Inhalte.",
    badge: "Schnellstart",
    quantities: [[100, 1.99], [250, 3.99], [500, 6.99], [1000, 11.99], [2500, 24.99], [5000, 44.99]]
  },
  "instagram-views-kaufen": {
    platform: "Instagram",
    type: "Views",
    keyword: "Instagram Views kaufen",
    title: "Instagram Views kaufen",
    headline: "Instagram Views kaufen für Reels, Stories und Video-Inhalte",
    short: "View-Pakete für Inhalte, die mehr erste Sichtbarkeit erhalten sollen.",
    badge: "Video",
    quantities: [[500, 2.99], [1000, 4.99], [2500, 9.99], [5000, 17.99], [10000, 29.99]]
  },
  "tiktok-follower-kaufen": {
    platform: "TikTok",
    type: "Follower",
    keyword: "TikTok Follower kaufen",
    title: "TikTok Follower kaufen",
    headline: "TikTok Follower kaufen und deinem Profil mehr Gewicht geben",
    short: "Follower-Pakete für Creator, Marken und neue TikTok-Projekte.",
    badge: "Trend",
    quantities: [[100, 3.99], [250, 7.99], [500, 13.99], [1000, 24.99], [2500, 54.99], [5000, 99.99]]
  },
  "tiktok-likes-kaufen": {
    platform: "TikTok",
    type: "Likes",
    keyword: "TikTok Likes kaufen",
    title: "TikTok Likes kaufen",
    headline: "TikTok Likes kaufen für mehr Social-Proof auf Clips",
    short: "Like-Pakete für einzelne Videos und laufende TikTok-Aktionen.",
    badge: "Clip-Boost",
    quantities: [[100, 2.49], [250, 4.99], [500, 8.99], [1000, 14.99], [2500, 32.99], [5000, 59.99]]
  },
  "tiktok-views-kaufen": {
    platform: "TikTok",
    type: "Views",
    keyword: "TikTok Views kaufen",
    title: "TikTok Views kaufen",
    headline: "TikTok Views kaufen und neue Videos sichtbarer starten",
    short: "View-Pakete für Clips, die einen klaren Startimpuls bekommen sollen.",
    badge: "Reichweite",
    quantities: [[1000, 3.99], [2500, 8.99], [5000, 14.99], [10000, 24.99], [25000, 49.99]]
  },
  "youtube-abonnenten-kaufen": {
    platform: "YouTube",
    type: "Abonnenten",
    keyword: "YouTube Abonnenten kaufen",
    title: "YouTube Abonnenten kaufen",
    headline: "YouTube Abonnenten kaufen und deinen Kanal professioneller positionieren",
    short: "Abo-Pakete für Kanäle, die ihren ersten Eindruck stärken wollen.",
    badge: "Kanalaufbau",
    quantities: [[100, 8.99], [250, 19.99], [500, 34.99], [1000, 59.99], [2500, 129.99]]
  },
  "youtube-views-kaufen": {
    platform: "YouTube",
    type: "Views",
    keyword: "YouTube Views kaufen",
    title: "YouTube Views kaufen",
    headline: "YouTube Views kaufen für Videos mit stärkerem Startsignal",
    short: "View-Pakete für Videos, Shorts und Kampagnen.",
    badge: "Bestseller",
    quantities: [[1000, 7.99], [2500, 16.99], [5000, 29.99], [10000, 49.99], [25000, 99.99]]
  },
  "twitch-follower-kaufen": {
    platform: "Twitch",
    type: "Follower",
    keyword: "Twitch Follower kaufen",
    title: "Twitch Follower kaufen",
    headline: "Twitch Follower kaufen und deinem Kanal mehr Profil geben",
    short: "Follower-Pakete für Streamer, Events und neue Kanalauftritte.",
    badge: "Stream",
    quantities: [[100, 4.99], [250, 9.99], [500, 17.99], [1000, 29.99], [2500, 69.99]]
  },
  "facebook-likes-kaufen": {
    platform: "Facebook",
    type: "Likes",
    keyword: "Facebook Likes kaufen",
    title: "Facebook Likes kaufen",
    headline: "Facebook Likes kaufen für Seiten und Beiträge",
    short: "Like-Pakete für Seiten, Posts und lokale Unternehmen.",
    badge: "Business",
    quantities: [[100, 3.49], [250, 6.99], [500, 11.99], [1000, 19.99], [2500, 44.99]]
  }
};

const platformMeta = {
  Instagram: { slug: "instagram", accent: "#e44d9a", accent2: "#ff9d4d", accent3: "#7a5cff" },
  TikTok: { slug: "tiktok", accent: "#00f2ea", accent2: "#ff3b68", accent3: "#111827" },
  YouTube: { slug: "youtube", accent: "#ff0033", accent2: "#ff7b7b", accent3: "#151b2d" },
  Twitch: { slug: "twitch", accent: "#9146ff", accent2: "#b98cff", accent3: "#24153f" },
  Facebook: { slug: "facebook", accent: "#1877f2", accent2: "#6cb4ff", accent3: "#0b2d66" }
};

const categoryLinks = {
  Instagram: [
    ["Instagram Follower", "/instagram-follower-kaufen/"],
    ["Instagram Likes", "/instagram-likes-kaufen/"],
    ["Instagram Views", "/instagram-views-kaufen/"],
    ["Instagram Kommentare", "/instagram/"],
    ["Instagram Saves", "/instagram/"],
    ["Instagram Story Views", "/instagram/"],
    ["Deutsche Instagram Follower", "/instagram-follower-kaufen/"],
    ["Internationale Instagram Follower", "/instagram-follower-kaufen/"]
  ],
  TikTok: [
    ["TikTok Follower", "/tiktok-follower-kaufen/"],
    ["TikTok Likes", "/tiktok-likes-kaufen/"],
    ["TikTok Views", "/tiktok-views-kaufen/"],
    ["TikTok Kommentare", "/tiktok/"],
    ["TikTok Shares", "/tiktok/"],
    ["TikTok Saves", "/tiktok/"],
    ["TikTok Live Zuschauer", "/tiktok/"]
  ],
  YouTube: [
    ["YouTube Abonnenten", "/youtube-abonnenten-kaufen/"],
    ["YouTube Views", "/youtube-views-kaufen/"],
    ["YouTube Likes", "/youtube/"],
    ["YouTube Kommentare", "/youtube/"],
    ["YouTube Watchtime", "/youtube/"]
  ],
  Twitch: [
    ["Twitch Follower", "/twitch-follower-kaufen/"],
    ["Twitch Live Zuschauer", "/twitch/"],
    ["Twitch Video Views", "/twitch/"]
  ],
  Facebook: [
    ["Facebook Seitenlikes", "/facebook-likes-kaufen/"],
    ["Facebook Follower", "/facebook/"],
    ["Facebook Beitragslikes", "/facebook-likes-kaufen/"],
    ["Facebook Kommentare", "/facebook/"]
  ]
};

function platformInfo(platform) {
  return platformMeta[platform] || { slug: "social", accent: "#22a7ff", accent2: "#22d6b5", accent3: "#101a32" };
}

function platformStyle(platform) {
  const meta = platformInfo(platform);
  return `--platform-1:${meta.accent};--platform-2:${meta.accent2};--platform-3:${meta.accent3}`;
}

function platformSvg(slug) {
  const icons = {
    instagram: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="igInline" cx="18%" cy="96%" r="85%"><stop offset="0" stop-color="#ffd776"/><stop offset=".28" stop-color="#f56040"/><stop offset=".58" stop-color="#c13584"/><stop offset="1" stop-color="#405de6"/></radialGradient></defs><rect width="64" height="64" rx="18" fill="url(#igInline)"/><rect x="17" y="17" width="30" height="30" rx="10" fill="none" stroke="#fff" stroke-width="5"/><circle cx="32" cy="32" r="8" fill="none" stroke="#fff" stroke-width="5"/><circle cx="43" cy="21" r="3.4" fill="#fff"/></svg>`,
    tiktok: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#05070b"/><path d="M36 12c1.1 8.2 5.4 13.1 13.2 14.2v9.2c-4.6.2-8.7-1.1-12.5-3.7v13.6c0 9.2-6.2 15.2-15.1 15.2-7.2 0-13-5.2-13-12.2 0-8 6.4-13.1 14.6-12.5v9.4c-3.2-.7-5.7.5-5.7 3.1 0 2.1 1.7 3.5 4.1 3.5 3 0 4.9-1.9 4.9-5.8V12h9.5Z" fill="#25f4ee"/><path d="M39.3 14.5c1.6 6.1 5.6 9.9 12.1 10.8v8.4c-4.5.2-8.7-1.1-12.5-3.7v13.6c0 9.2-6.2 15.2-15.1 15.2-5 0-9.3-2.5-11.5-6.3 2.4 1.7 5.3 2.6 8.4 2.6 8.9 0 15.1-6 15.1-15.2V26.3c3.8 2.6 8 3.9 12.5 3.7v-2.1c-5.2-1.4-8.3-5.2-9-13.4Z" fill="#fe2c55"/><path d="M33.1 12v34c0 3.9-1.9 5.8-4.9 5.8-2.4 0-4.1-1.4-4.1-3.5 0-2.6 2.5-3.8 5.7-3.1v-9.4c-8.2-.6-14.6 4.5-14.6 12.5 0 .8.1 1.6.3 2.4-4.1-2.1-6.9-6.3-6.9-11.4 0-8 6.4-13.1 14.6-12.5v9.4c-3.2-.7-5.7.5-5.7 3.1 0 2.1 1.7 3.5 4.1 3.5 3 0 4.9-1.9 4.9-5.8V12h6.6Z" fill="#fff"/></svg>`,
    youtube: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#ff0033"/><path d="M52.8 22.6c-.5-2-2.1-3.5-4.1-4.1C45.1 17.5 32 17.5 32 17.5s-13.1 0-16.7 1c-2 .6-3.6 2.1-4.1 4.1-1 3.7-1 9.4-1 9.4s0 5.7 1 9.4c.5 2 2.1 3.5 4.1 4.1 3.6 1 16.7 1 16.7 1s13.1 0 16.7-1c2-.6 3.6-2.1 4.1-4.1 1-3.7 1-9.4 1-9.4s0-5.7-1-9.4Z" fill="#fff"/><path d="M27.6 39.2V24.8L40 32l-12.4 7.2Z" fill="#ff0033"/></svg>`,
    twitch: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#9146ff"/><path d="M17 12h36v25.5L42.5 48H34l-6 6h-7v-6h-9V21l5-9Z" fill="#fff"/><path d="M22 18v25h9v6l6-6h8l5-5V18H22Z" fill="#5a24b8"/><path d="M35 25h5v12h-5V25Zm-10 0h5v12h-5V25Z" fill="#fff"/></svg>`,
    facebook: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#1877f2"/><path d="M37.7 20.2h6.1V11h-7.9c-8.7 0-13.1 5.2-13.1 12.7v6.2h-7.1v9.9h7.1V64h10.6V39.8h8.2l1.6-9.9h-9.8v-5.2c0-2.9 1.4-4.5 4.3-4.5Z" fill="#fff"/></svg>`
  };
  return icons[slug] || icons.instagram;
}

function platformLogo(platform, withLabel = false) {
  const meta = platformInfo(platform);
  return `<span class="platform-lockup"><span class="platform-logo platform-logo-inline platform-logo-${meta.slug}" aria-hidden="true">${platformSvg(meta.slug)}</span>${withLabel ? `<span>${platform}</span>` : ""}</span>`;
}

function brandLogo() {
  return `<span class="brand-logo-inline" aria-label="FameBoost.de">
    <svg viewBox="0 0 320 80" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="fbMark" x1="8" y1="70" x2="72" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#22d6b5"/><stop offset=".46" stop-color="#22a7ff"/><stop offset="1" stop-color="#8057ff"/>
        </linearGradient>
        <linearGradient id="fbText" x1="90" y1="58" x2="282" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#d9f6ff"/><stop offset="1" stop-color="#8df4dc"/>
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="64" height="64" rx="18" fill="#07111f"/>
      <rect x="10" y="10" width="60" height="60" rx="16" fill="url(#fbMark)"/>
      <path d="M28 56V25h24v8H38v7h12v8H38v8H28Z" fill="#06111f"/>
      <path d="M45 53 58 40h-8V30h18v18H58v-8L45 53Z" fill="#fff"/>
      <circle cx="24" cy="23" r="4" fill="#fff" opacity=".9"/>
      <text x="88" y="48" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="31" font-weight="900" letter-spacing="-.5" fill="url(#fbText)">FameBoost</text>
      <text x="266" y="48" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="24" font-weight="850" fill="#8df4dc">.de</text>
    </svg>
  </span>`;
}

function brandAvatarMark() {
  return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect x="8" y="8" width="48" height="48" rx="15" fill="#06111f"/>
    <rect x="10" y="10" width="44" height="44" rx="13" fill="url(#avatarBoostGradient)"/>
    <path d="M23 45V20h20v7H31v5h10v7H31v6h-8Z" fill="#06111f"/>
    <path d="M38 44 50 32h-7v-9h16v16h-9v-7L38 44Z" fill="#fff"/>
    <circle cx="20" cy="19" r="3.2" fill="#fff" opacity=".92"/>
    <defs>
      <linearGradient id="avatarBoostGradient" x1="10" y1="54" x2="54" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#22d6b5"/>
        <stop offset=".48" stop-color="#22a7ff"/>
        <stop offset="1" stop-color="#8057ff"/>
      </linearGradient>
    </defs>
  </svg>`;
}

function cartIcon() {
  return `<span class="cart-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M7.2 8.5h13.1l-1.6 7.2a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.7L5.8 4.9H3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9.7" cy="20" r="1.2" fill="currentColor"/>
      <circle cx="17.1" cy="20" r="1.2" fill="currentColor"/>
    </svg>
  </span>`;
}

const productFaq = [
  ["Muss ich mein Passwort angeben?", "Nein. Für die Bestellung wird kein Passwort benötigt. Ein öffentlicher Profilname oder Link reicht aus."],
  ["Wann startet die Bearbeitung?", "Die Bearbeitung startet nach erfolgreicher Zahlung. Die genaue Startzeit hängt vom gewählten Paket und der aktuellen Auslastung ab."],
  ["Was passiert bei einem falschen Profilnamen?", "Kontaktiere den Support so schnell wie möglich. Solange die Bestellung noch nicht verarbeitet wurde, kann eine Korrektur eventuell vorgenommen werden."],
  ["Ist mein Profil geeignet?", "Dein Profil sollte öffentlich erreichbar sein. Private oder falsch geschriebene Profile können die Bearbeitung verzögern."],
  ["Gibt es eine Nachfüllung?", "Bei Paketen mit Refill-Option kann innerhalb des angegebenen Zeitraums eine Nachfüllung beantragt werden, sofern die Bedingungen erfüllt sind."]
];

const mainFaq = [
  ["Benötige ich ein Passwort?", "Nein. Für die Bestellung reicht dein öffentliches Profil oder ein Link."],
  ["Welche Zahlungsarten gibt es?", "Je nach Verfügbarkeit kannst du mit PayPal, Kreditkarte, Apple Pay, Google Pay, Klarna oder Sofort bezahlen."],
  ["Wann startet meine Bestellung?", "Nach erfolgreicher Zahlung wird deine Bestellung verarbeitet. Die genaue Startzeit hängt vom Produkt, der Menge und der aktuellen Auslastung ab."],
  ["Kann ich den Profilnamen nachträglich ändern?", "Bitte kontaktiere den Support so schnell wie möglich. Eine Änderung ist nur möglich, solange die Bearbeitung noch nicht begonnen hat."],
  ["Funktioniert das bei privaten Profilen?", "Für die meisten Pakete muss dein Profil öffentlich sichtbar sein."],
  ["Gibt es ein Abo?", "Nein. Die Pakete sind Einmalzahlungen, sofern auf der jeweiligen Produktseite nichts anderes angegeben ist."],
  ["Was ist eine Refill-Option?", "Die Refill-Option ermöglicht bei ausgewählten Paketen eine Nachfüllanfrage innerhalb des angegebenen Zeitraums."],
  ["Kann ich mehrere Pakete kombinieren?", "Ja. Du kannst mehrere Produkte in den Warenkorb legen und gemeinsam bestellen."]
];

let productLimits = {};
let adminAuthState = { loaded: false, loading: false, authenticated: false, setup_required: false, username: "", setup: null };

function getConfig() {
  return { ...defaultConfig, ...JSON.parse(localStorage.getItem("fk24_config") || "{}") };
}

function getProducts() {
  return JSON.parse(localStorage.getItem("fk24_products") || "null") || baseProducts;
}

function saveProducts(products) {
  localStorage.setItem("fk24_products", JSON.stringify(products));
}

function getCart() {
  return JSON.parse(localStorage.getItem("fk24_cart") || "[]");
}

function setCart(cart) {
  localStorage.setItem("fk24_cart", JSON.stringify(cart));
  updateCartCount();
}

function getOrders() {
  return JSON.parse(localStorage.getItem("fk24_orders") || "[]");
}

function setOrders(orders) {
  localStorage.setItem("fk24_orders", JSON.stringify(orders));
}

function eur(value) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function amountLabel(amount) {
  return Number(amount).toLocaleString("de-DE");
}

function packageValueLabel(product, quantity, price, index) {
  const base = product.quantities[0];
  const baseValue = Number(base?.[0] || 0) / Number(base?.[1] || 0);
  const currentValue = Number(quantity || 0) / Number(price || 0);
  if (!Number.isFinite(baseValue) || !Number.isFinite(currentValue) || baseValue <= 0 || index === 0) {
    return "Basis";
  }
  const bonus = Math.round(((currentValue / baseValue) - 1) * 100);
  return bonus > 0 ? `+${bonus} % mehr` : "Basis";
}

async function loadProductLimits() {
  try {
    const data = await apiJson("/api/product-limits.php");
    productLimits = data.limits || {};
  } catch {
    productLimits = {};
  }
}

function staticProductMax(product) {
  return Math.max(...product.quantities.map((row) => Number(row[0])));
}

function productMaxQuantity(slug, product) {
  const mappedMax = Number(productLimits[slug]?.max || 0);
  return Number.isFinite(mappedMax) && mappedMax > 0 ? mappedMax : staticProductMax(product);
}

function productLimitHint(slug, product) {
  const limit = productLimits[slug] || {};
  const max = productMaxQuantity(slug, product);
  if (limit.available === false) {
    return limit.availability_message || "Dieses Produkt ist aktuell kurzzeitig nicht verfügbar.";
  }
  if (limit.has_reseller_mapping && limit.max) {
    return `Die maximal mögliche Menge liegt aktuell bei: ${amountLabel(max)}.`;
  }
  return `Aktuell im Shop vorbereitet bis maximal ${amountLabel(max)}.`;
}

function productAvailabilityMessage(slug) {
  const limit = productLimits[slug] || {};
  return limit.available === false ? (limit.availability_message || "Dieses Produkt ist aktuell kurzzeitig nicht verfügbar.") : "";
}

function selectedConfiguratorQuantity(form, product) {
  const active = form.querySelector(".option.active");
  if (active?.matches("[data-custom]")) {
    return Number(form.querySelector("[data-custom-qty]")?.value || 0);
  }
  return Number(active?.dataset.qty || product.quantities[0][0]);
}

function pathTo(slug) {
  return `/${slug}/`;
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll("[data-cart-count]").forEach((node) => node.textContent = count);
}

function productMinPrice(product) {
  return Math.min(...product.quantities.map((row) => row[1]));
}

function navPlatformItem(platform) {
  const meta = platformInfo(platform);
  const products = getProducts();
  const links = categoryLinks[platform] || [];
  const dropLabel = (label) => platform === "Instagram" ? label.replace(/^Deutsche Instagram\s+/i, "Deutsche ").replace(/^Internationale Instagram\s+/i, "Internationale ") : label;
  return `<div class="nav-item nav-platform" style="${platformStyle(platform)}">
    <a class="nav-trigger" href="/${meta.slug}/" aria-haspopup="true">${platformLogo(platform, true)}</a>
    <div class="nav-dropdown">
      <div class="nav-dropdown-head">${platformLogo(platform)}<div><strong>${platform}</strong><span>Alle Pakete ansehen</span></div></div>
      <div class="nav-dropdown-grid">
        ${links.map(([label, url]) => {
          const slug = url.split("/").filter(Boolean)[0];
          const product = products[slug];
          return `<a class="nav-drop-link" href="${url}"><span>${dropLabel(label)}</span>${product ? `<small>ab ${eur(productMinPrice(product))}</small>` : "<small>Details</small>"}</a>`;
        }).join("")}
      </div>
    </div>
  </div>`;
}

function layout() {
  const config = getConfig();
  document.getElementById("promo").innerHTML = `
    <div class="container">
      <a href="/#produkte">${config.bannerText}</a>
      <button class="coupon-chip" data-copy-coupon="${config.couponCode}">${config.couponCode}</button>
    </div>`;
  document.getElementById("site-header").innerHTML = `
    <div class="container nav">
      <a class="brand" href="/" aria-label="FameBoost.de">${brandLogo()}</a>
      <nav class="nav-links" id="nav-links">
        ${["Instagram","TikTok","YouTube","Twitch","Facebook"].map(navPlatformItem).join("")}<a class="nav-plain" href="/#bewertungen">Bewertungen</a><a class="nav-plain" href="/faq/">FAQ</a><a class="nav-plain" href="/kontakt/">Kontakt</a>
      </nav>
      <div class="header-actions">
        <a class="cart-link" href="/warenkorb/" aria-label="Warenkorb">${cartIcon()}<span class="cart-label">Warenkorb</span><span class="cart-count" data-cart-count>0</span></a>
        <a class="btn btn-primary" href="/#produkte">Jetzt Paket wählen</a>
        <button class="burger" id="burger" aria-label="Menü"><span></span><span></span><span></span></button>
      </div>
    </div>`;
  document.getElementById("site-footer").innerHTML = footer();
  document.getElementById("mobile-sticky").innerHTML = `<a class="btn btn-primary" style="width:100%" href="/#produkte">Paket auswählen</a>`;
  updateCartCount();
  renderCookieNotice();
}

function renderCookieNotice() {
  let existing = document.getElementById("cookie-notice");
  if (localStorage.getItem("fb_cookie_notice_ok") === "1") {
    if (existing) existing.remove();
    return;
  }
  if (!existing) {
    existing = document.createElement("div");
    existing.id = "cookie-notice";
    document.body.appendChild(existing);
  }
  existing.className = "cookie-notice";
  existing.innerHTML = `<div class="cookie-card" role="region" aria-label="Cookie-Hinweis">
    <div class="cookie-icon" aria-hidden="true">i</div>
    <div class="cookie-copy">
      <strong>Cookie-Hinweis</strong>
      <p>Wir nutzen aktuell nur technisch notwendige Funktionen wie Warenkorb und Bestellstatus. Kein Tracking, keine Marketing-Cookies.</p>
    </div>
    <div class="cookie-actions">
      <a class="btn btn-light" href="/cookie-hinweise/">Details</a>
      <button class="btn btn-primary" type="button" data-cookie-ok>Verstanden</button>
    </div>
  </div>`;
}

function footer() {
  return `
    <div class="container">
      <div class="newsletter reveal">
        <div>
          <h2 style="margin-bottom:8px">Exklusive Rabatte erhalten</h2>
          <p class="muted" style="margin:0;color:rgba(255,255,255,.86)">Sichere dir neue Paket-Angebote und Rabattaktionen direkt per E-Mail.</p>
        </div>
        <form class="field" data-newsletter>
          <input class="input" type="email" name="email" required placeholder="deine@email.de">
          <input class="input" type="text" name="website" tabindex="-1" autocomplete="off" style="display:none">
          <label class="newsletter-consent"><input type="checkbox" name="consent" value="1" required> Ich möchte Paket-Angebote und Rabattaktionen per E-Mail erhalten.</label>
          <button class="btn btn-primary" type="submit">Rabatt sichern</button>
          <div class="form-status" data-form-status role="status"></div>
        </form>
      </div>
      <div class="footer-grid" style="margin-top:42px">
        <div>
          <h3>FameBoost.de</h3>
          <p>FameBoost.de ist dein Shop für einfache Social-Media-Wachstumspakete. Wähle dein Paket, bezahle sicher und starte deinen Boost.</p>
          <p><strong>Marken- und Rechtehinweis:</strong> Plattformnamen, Marken und Logo-Anmutungen zu Instagram, TikTok, YouTube, Twitch und Facebook dienen ausschließlich der Orientierung im Shop. FameBoost.de steht in keiner Verbindung zu Meta, ByteDance, Google, Twitch oder anderen genannten Plattformbetreibern. Alle Markenrechte liegen bei den jeweiligen Eigentümern.</p>
        </div>
        <div><h3 class="footer-platform-heading">${platformLogo("Instagram", true)}</h3><ul><li><a href="/instagram-follower-kaufen/">Instagram Follower kaufen</a></li><li><a href="/instagram-likes-kaufen/">Instagram Likes kaufen</a></li><li><a href="/instagram-views-kaufen/">Instagram Views kaufen</a></li><li><a href="/instagram/">Instagram Kommentare kaufen</a></li></ul></div>
        <div><h3 class="footer-platform-heading">${platformLogo("TikTok")} ${platformLogo("YouTube")}<span>TikTok & YouTube</span></h3><ul><li><a href="/tiktok-follower-kaufen/">TikTok Follower kaufen</a></li><li><a href="/tiktok-likes-kaufen/">TikTok Likes kaufen</a></li><li><a href="/tiktok-views-kaufen/">TikTok Views kaufen</a></li><li><a href="/youtube-abonnenten-kaufen/">YouTube Abonnenten kaufen</a></li><li><a href="/youtube-views-kaufen/">YouTube Views kaufen</a></li></ul></div>
        <div><h3>Service</h3><ul><li><a href="/faq/">FAQ</a></li><li><a href="/kontakt/">Kontakt</a></li><li><a href="/zahlungsarten/">Zahlungsarten</a></li><li><a href="/lieferbedingungen/">Lieferbedingungen</a></li><li><a href="/refill-anfrage/">Refill-Anfrage</a></li></ul></div>
        <div><h3>Rechtliches</h3><ul><li><a href="/impressum/">Impressum</a></li><li><a href="/datenschutz/">Datenschutz</a></li><li><a href="/cookie-hinweise/">Cookie-Hinweise</a></li><li><a href="/agb/">AGB</a></li><li><a href="/widerrufsbelehrung/">Widerrufsbelehrung</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 FameBoost.de. Alle Rechte vorbehalten.</span>
        <span>PayPal · Visa · Mastercard · Apple Pay · Google Pay · Klarna · Sofort</span>
      </div>
    </div>`;
}

function home() {
  const products = getProducts();
  const best = ["instagram-follower-kaufen", "tiktok-follower-kaufen", "instagram-likes-kaufen", "youtube-views-kaufen", "youtube-abonnenten-kaufen", "twitch-follower-kaufen"];
  return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">Premium Social Growth Shop</span>
          <h1>Follower kaufen und dein Profil sichtbar machen</h1>
          <p class="lead">Starte deinen Social-Media-Boost in wenigen Minuten. Wähle dein Paket, gib dein Profil an und erhalte eine schnelle, einfache und diskrete Abwicklung ohne Passwort.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="#produkte">Pakete ansehen</a><a class="btn btn-ghost" href="#ablauf">So funktioniert es</a></div>
          <div class="trust-row">${["Kein Passwort nötig","Schnelle Bearbeitung","Sichere Zahlung","Diskrete Abwicklung","Refill-Option","Einmalzahlung ohne Abo"].map((x) => `<span class="trust-pill">${x}</span>`).join("")}</div>
        </div>
        ${heroVisual()}
      </div>
    </section>
    <section class="section" id="produkte"><div class="container">
      <div class="section-head reveal"><h2>Beliebte Pakete</h2><p>Die wichtigsten Social-Media-Pakete mit klarer Mengenwahl, Profil-Eingabe und transparenter Bestellübersicht.</p></div>
      <div class="grid cards-3">${best.map((slug) => productCard(slug, products[slug])).join("")}</div>
    </div></section>
    ${categoryOverview()}
    ${stepsSection()}
    ${trustSection()}
    ${customerFeedbackSection()}
    <section class="section"><div class="container grid cards-3">
      ${infoCard("Mehr Sichtbarkeit für dein Profil", "Ein professioneller erster Eindruck kann entscheiden, ob neue Besucher deinem Profil vertrauen, deine Inhalte anschauen oder weiterklicken. Mit FameBoost.de kannst du gezielt Pakete auswählen, die zu deinem Profil und deiner Plattform passen.")}
      ${infoCard("Einfacher Ablauf", "Du brauchst keine technischen Kenntnisse. Wähle die Plattform, entscheide dich für eine Menge und gib deinen Profilnamen oder Link ein. Danach kannst du deine Bestellung sicher bezahlen.")}
      ${infoCard("Für Creator, Unternehmen und Marken", "Ob neues Projekt, lokales Unternehmen, Musiker, Creator oder Shop: Social-Media-Profile wirken stärker, wenn sie aktiv und professionell aufgebaut sind.")}
    </div></section>`;
}

function heroVisual() {
  return `<div class="visual-stage">
    <div class="phone iphone-mockup">
      <span class="phone-button phone-button-left"></span>
      <span class="phone-button phone-button-right"></span>
      <div class="phone-screen">
        <div class="dynamic-island"><span></span></div>
        <div class="phone-top">
          <span class="phone-time">09:41</span>
          <span class="phone-status"><span class="signal-bars"><i></i><i></i><i></i></span><span>5G</span><span class="battery"></span></span>
        </div>
        <div class="platform-strip">${["Instagram", "TikTok", "YouTube", "Twitch", "Facebook"].map((name) => platformLogo(name)).join("")}</div>
        <div class="profile-card">
          <div class="profile-head">
            <div class="avatar brand-avatar">${brandAvatarMark()}</div>
            <div class="profile-copy"><strong>fameboost.de</strong><span>Profil-Boost in Bearbeitung</span></div>
          </div>
          <div class="boost-status"><span class="pulse-dot"></span><span data-boost-label>Follower Boost läuft</span></div>
          <div class="metric-row">
            <div class="metric" data-boost-metric="0"><span class="trend-arrow">↑</span><strong data-boost-counter data-start="8200" data-target="12800">8.2k</strong><small>Follower</small></div>
            <div class="metric" data-boost-metric="1"><span class="trend-arrow">↑</span><strong data-boost-counter data-start="1700" data-target="4200">1.7k</strong><small>Likes</small></div>
            <div class="metric" data-boost-metric="2"><span class="trend-arrow">↑</span><strong data-boost-counter data-start="42000" data-target="98000">42k</strong><small>Views</small></div>
          </div>
        </div>
        <div class="feed-card"><strong>Live Wachstum</strong><div class="feed-graph"><i></i><i></i><i></i><i></i><i></i></div></div>
      </div>
    </div>
    <div class="float-card fc-1">+1.000 Follower<small>Profilpaket</small></div>
    <div class="float-card fc-2">Sichere Zahlung<small>verschlüsselt</small></div>
    <div class="float-card fc-3">24/7 Anfrage<small>Supportbereich</small></div>
  </div>`;
}

function productCard(slug, product) {
  return `<article class="card product-card reveal" style="${platformStyle(product.platform)}">
    <div class="card-top"><div class="platform-heading">${platformLogo(product.platform)}<div><div class="platform">${product.platform}</div><h3>${product.title}</h3></div></div><span class="badge">${product.badge}</span></div>
    <p class="muted">${product.short}</p>
    <div class="product-features"><span>Ohne Passwort</span><span>Flexible Menge</span><span>Sichere Kasse</span></div>
    <div class="price">ab ${eur(productMinPrice(product))}</div>
    <div class="section-actions"><a class="btn btn-dark" href="${pathTo(slug)}">Paket wählen</a></div>
  </article>`;
}

function categoryOverview(active) {
  return `<section class="section"><div class="container">
    <div class="section-head reveal"><h2>Wähle deine Plattform</h2><p>Saubere Produktgruppen für Instagram, TikTok, YouTube, Twitch und Facebook.</p></div>
    <div class="grid cards-3">${Object.entries(categoryLinks).map(([name, links]) => `<div class="category-panel reveal" style="${platformStyle(name)}"><div class="category-title">${platformLogo(name)}<h3>${name}</h3></div><ul class="link-list">${links.map(([label, url]) => `<li><a href="${url}">${label}<span>Details</span></a></li>`).join("")}</ul></div>`).join("")}</div>
  </div></section>`;
}

function stepsSection() {
  const steps = [
    ["Paket auswählen", "Wähle die Plattform, das Produkt und die gewünschte Menge aus."],
    ["Profil oder Link eintragen", "Gib deinen öffentlichen Profilnamen oder den passenden Link ein. Ein Passwort wird nicht benötigt."],
    ["Sicher bezahlen", "Bezahle bequem per PayPal, Kreditkarte, Apple Pay, Google Pay, Klarna oder weiteren verfügbaren Zahlungsarten."],
    ["Boost starten", "Nach erfolgreicher Bestellung wird dein Auftrag verarbeitet und der Boost startet je nach Paket innerhalb der angegebenen Bearbeitungszeit."]
  ];
  return `<section class="section" id="ablauf"><div class="container"><div class="section-head reveal"><h2>So funktioniert es</h2></div><div class="grid cards-4">${steps.map((s, i) => `<div class="card step reveal"><div class="step-number">${i + 1}</div><h3>${s[0]}</h3><p class="muted">${s[1]}</p></div>`).join("")}</div></div></section>`;
}

function trustSection() {
  const items = [
    ["Ohne Passwort", "Für die Bestellung reicht dein Profilname oder Link. Du musst keine Login-Daten weitergeben."],
    ["Sichere Zahlung", "Moderne Zahlungsanbieter sorgen für eine verschlüsselte und einfache Abwicklung."],
    ["Schneller Start", "Viele Pakete starten nach kurzer Bearbeitungszeit."],
    ["Diskrete Lieferung", "Die Bestellung wird unauffällig und ohne öffentliche Hinweise verarbeitet."],
    ["Refill-Option", "Bei ausgewählten Paketen kann eine Nachfülloption aktiviert werden."],
    ["Support", "Bei Fragen zur Bestellung steht ein Supportbereich zur Verfügung."]
  ];
  return `<section class="section section-dark"><div class="container"><div class="section-head reveal"><h2>Warum FameBoost.de?</h2><p>Premium-Gefühl, klare Prozesse und vorsichtige, belegbare Aussagen statt lauter Versprechen.</p></div><div class="grid cards-3">${items.map((x) => `<div class="card trust-card reveal"><div class="icon-box">${x[0].slice(0, 1)}</div><h3>${x[0]}</h3><p class="muted">${x[1]}</p></div>`).join("")}</div></div></section>`;
}

function customerFeedbackSection() {
  const placeholders = [
    ["Anonym", "Verifizierte Bewertung folgt", "Hier erscheint eine echte Kundenbewertung, sobald sie geprüft und freigegeben wurde."],
    ["Anonym", "Noch kein öffentliches Feedback", "Wir zeigen an dieser Stelle nur echte Rückmeldungen aus nachvollziehbaren Bestellungen."],
    ["Anonym", "Bewertung wird vorbereitet", "Sobald verifizierte Bewertungen vorliegen, werden sie hier transparent eingebunden."]
  ];
  return `<section class="section review-section" id="bewertungen"><div class="container">
    <div class="review-head reveal">
      <div>
        <span class="eyebrow">Kundenfeedback</span>
        <h2>Bewertungen von FameBoost.de</h2>
        <p>Kundenbewertungen werden hier angezeigt, sobald verifizierte Bewertungen vorliegen. Es werden keine erfundenen Stimmen als echte Bewertungen ausgegeben.</p>
      </div>
      <div class="review-summary" aria-label="Noch keine verifizierte Gesamtbewertung">
        <strong>Neu</strong>
        <span>Verifizierte Bewertungen folgen</span>
      </div>
    </div>
    <div class="review-grid">
      ${placeholders.map((review) => `<article class="review-card reveal">
        <div class="review-rating pending" aria-label="Noch keine verifizierte Sternebewertung"><span></span><span></span><span></span><span></span><span></span></div>
        <h3>${review[1]}</h3>
        <p>${review[2]}</p>
        <div class="review-footer"><strong>${review[0]}</strong><span>Noch nicht veröffentlicht</span></div>
      </article>`).join("")}
    </div>
  </div></section>`;
}

function infoCard(title, text) {
  return `<div class="card reveal"><h3>${title}</h3><p class="muted">${text}</p></div>`;
}

function renderProduct(slug) {
  const product = getProducts()[slug] || getProducts()["instagram-follower-kaufen"];
  return `
    <section class="product-hero platform-product-hero product-hero-clean" style="${platformStyle(product.platform)}"><div class="container product-grid">
      <div class="product-copy-panel product-showcase">
        <div class="product-platform-line">${platformLogo(product.platform, true)}<span>Home / ${product.platform} / ${product.title}</span></div>
        <div class="product-kicker">Service aktiv · Kein Passwort nötig</div>
        <h1>${product.headline}</h1>
        <p class="lead">Wähle eine Menge, trage deinen öffentlichen Profilnamen oder Link ein und schließe die Bestellung in wenigen Schritten ab.</p>
        <div class="product-hero-stats">
          <span><strong>ab ${eur(productMinPrice(product))}</strong><small>Startpreis</small></span>
          <span><strong>${amountLabel(product.quantities[0][0])}-${amountLabel(product.quantities.at(-1)[0])}</strong><small>Mengen</small></span>
          <span><strong>1x</strong><small>Einmalzahlung</small></span>
        </div>
        <div class="product-benefit-list">
          ${["Öffentliches Profil reicht aus","Bearbeitung nach Zahlungseingang","Refill-Option bei ausgewählten Paketen","Diskrete Bestellabwicklung"].map((x) => `<span>${x}</span>`).join("")}
        </div>
        <div class="product-note-card">
          <strong>Kundenfeedback</strong>
          <p>Kundenbewertungen werden angezeigt, sobald verifizierte Bewertungen vorliegen.</p>
        </div>
      </div>
      ${configurator(slug, product)}
    </div></section>
    <section class="product-quick-section" style="${platformStyle(product.platform)}"><div class="container product-quick-grid">
      ${quickProductInfo("1", "Paket wählen", `Wähle die passende ${product.type}-Menge für dein ${product.platform}-Ziel.`)}
      ${quickProductInfo("2", "Profil eintragen", "Gib einen öffentlichen Link oder Profilnamen ein. Login-Daten werden nicht benötigt.")}
      ${quickProductInfo("3", "Sicher bestellen", "Prüfe Warenkorb, Zahlungsart und Bestelldaten vor dem Abschluss.")}
    </div></section>
    <section class="section"><div class="container split">
      <div>
        ${contentBlock("Was du bei diesem Paket erhältst", `Dieses Paket ist für Nutzer gedacht, die ihrem Profil mehr Sichtbarkeit und einen stärkeren ersten Eindruck geben möchten. Wähle einfach die gewünschte Menge aus und trage dein öffentliches Profil ein. Die Bestellung wird anschließend verarbeitet.`)}
        ${contentBlock("Für wen eignet sich das Paket?", `<ul><li>Creator, die ihr Profil professioneller wirken lassen möchten</li><li>Unternehmen, die neue Social-Media-Auftritte sichtbarer machen wollen</li><li>Musiker, Coaches, lokale Dienstleister, Shops und Influencer</li><li>Profile, die ihre Social-Proof-Wirkung verbessern möchten</li></ul>`)}
        ${contentBlock("Wichtig vor der Bestellung", `<ul><li>Das Profil muss öffentlich sein</li><li>Der Profilname muss korrekt eingetragen werden</li><li>Während der Bearbeitung sollte der Nutzername nicht geändert werden</li><li>Es wird kein Passwort benötigt</li><li>Lieferzeiten können je nach Paket und Auslastung variieren</li></ul>`)}
        ${faqBlock(`FAQ zu ${product.type}`, productFaq)}
        ${contentBlock(`${product.keyword}: Ratgeber und Hinweise`, seoText(product))}
      </div>
      <aside>${relatedProducts(slug)}</aside>
    </div></section>`;
}

function quickProductInfo(number, title, text) {
  return `<article class="quick-info-card reveal"><span>${number}</span><h3>${title}</h3><p>${text}</p></article>`;
}

function configurator(slug, product) {
  const first = product.quantities[0];
  return `<form class="configurator product-buy-box reveal" style="${platformStyle(product.platform)}" data-configurator data-slug="${slug}">
    <div class="config-head">${platformLogo(product.platform)}<div><span>Direkt bestellen</span><h2>Paket konfigurieren</h2></div></div>
    <div class="field"><label>Wähle deine ${product.type}</label><div class="option-grid" data-qty-options>${product.quantities.map((q, i) => `<button class="option ${i === 0 ? "active" : ""}" type="button" data-qty="${q[0]}"><strong>${amountLabel(q[0])}</strong><small>${packageValueLabel(product, q[0], q[1], i)}</small></button>`).join("")}</div></div>
    <div class="field"><label>Wie lautet dein Profilname oder Link?</label><input class="input" required name="profile" placeholder="z. B. @deinprofil oder Profil-Link"><small>Bitte stelle sicher, dass dein Profil öffentlich erreichbar ist, damit die Bestellung korrekt verarbeitet werden kann.</small></div>
    <div class="price-box"><span>Gesamtpreis</span><strong data-total>${eur(first[1])}</strong></div>
    <button class="btn btn-primary" style="width:100%" type="submit">In den Warenkorb</button>
    <div class="form-status config-status" data-config-status role="status"></div>
    <div class="payment-row">${["PayPal","Visa","Mastercard","Apple Pay","Google Pay","Klarna","Sofort"].map((p) => `<span class="pay">${p}</span>`).join("")}</div>
    <div class="mini-trust"><span>Kein Passwort nötig</span><span>Sichere Zahlung</span><span>Schnelle Bearbeitung</span><span>Support bei Fragen</span></div>
  </form>`;
}

function contentBlock(title, body) {
  return `<section class="content-block reveal"><h2>${title}</h2>${body.startsWith("<") ? body : `<p>${body}</p>`}</section>`;
}

function faqBlock(title, items) {
  return `<section class="content-block reveal"><h2>${title}</h2><div class="accordion">${items.map((item) => `<div class="faq-item"><button type="button">${item[0]}<span>+</span></button><div class="faq-answer">${item[1]}</div></div>`).join("")}</div></section>`;
}

function seoText(product) {
  return `<p>${product.keyword} kann für Creator, Unternehmen und neue Projekte interessant sein, wenn ein Profil einen professionelleren ersten Eindruck vermitteln soll. Wichtig ist dabei eine klare Erwartung: Ein Paket ersetzt keine gute Content-Strategie, keine Community-Arbeit und keine langfristige Markenentwicklung. Es kann aber dabei helfen, den sichtbaren Startpunkt eines Profils bewusster zu gestalten und Social-Proof-Signale zu ergänzen.</p>
  <p>Bei FameBoost.de ist der Ablauf bewusst einfach gehalten. Du wählst zuerst ${product.platform} als Plattform, entscheidest dich für ${product.type} und legst die passende Menge fest. Danach trägst du deinen Profilnamen oder den Link ein. Ein Passwort wird nicht abgefragt. Diese Trennung ist wichtig, weil Login-Daten privat bleiben sollen und für die Verarbeitung der Bestellung nicht benötigt werden.</p>
  <p>Vor jeder Bestellung solltest du prüfen, ob dein Profil öffentlich sichtbar ist und ob der angegebene Name exakt stimmt. Schreibfehler, private Profile oder geänderte Nutzernamen können die Bearbeitung verzögern. Auch die Lieferzeit kann variieren, etwa durch Paketgröße, Auslastung oder technische Prüfungen. Deshalb werden Lieferzeiten als bearbeitbare Angaben geführt und nicht als starres Versprechen dargestellt.</p>
  <p>Das Paket eignet sich besonders für Profile, die bereits Inhalte veröffentlichen und ihren Auftritt strukturierter wirken lassen möchten. Dazu gehören Creator, Musiker, lokale Dienstleister, Shops, Coaches, Streamer und Marken. Entscheidend bleibt, dass neue Besucher auf ein gepflegtes Profil treffen: klares Profilbild, verständliche Bio, aktive Inhalte und ein Angebot, das zur Zielgruppe passt.</p>
  <p>Die Refill-Option ist für ausgewählte Pakete vorgesehen. Wenn sie aktiviert ist, kann innerhalb des angegebenen Schutzzeitraums eine Prüfung angefragt werden, falls ein Teil der Menge sinkt. Ob und wie eine Nachfüllung möglich ist, hängt von den Bedingungen des jeweiligen Pakets ab. Diese Angaben sind im Adminbereich anpassbar, damit der Betreiber nur belegbare Zusagen macht.</p>
  <p>Aus SEO-Sicht ist eine saubere Seitenstruktur wichtig. Deshalb hat jedes Hauptprodukt eine eigene URL, eine eigene H1, interne Links zu verwandten Produkten, FAQ-Inhalte und Meta-Daten. So können Nutzer und Suchmaschinen leichter verstehen, welches Paket für welche Plattform gedacht ist. Gleichzeitig bleibt die Seite transparent und vermeidet Aussagen wie garantierte Reichweite, offizielle Partnerschaften oder risikofreie Ergebnisse.</p>
  <p>Wenn du ${product.keyword} nutzt, kombiniere das Paket am besten mit einer realen Content-Planung. Verzeichnisse, Highlights, klare Beschreibungen, gute Vorschaubilder und regelmäßige Inhalte wirken zusammen stärker als einzelne Signale. FameBoost.de positioniert sich deshalb als Shop für einfache Social-Media-Wachstumspakete, nicht als Ersatz für organische Arbeit oder Plattformstrategie.</p>
  <p>Verwandte Pakete können sinnvoll sein, wenn du mehrere Signale gleichzeitig aufbauen möchtest. Für ${product.platform} können je nach Ziel auch Likes, Views, Kommentare oder andere Interaktionen passen. Lege nur die Produkte in den Warenkorb, die zu deinem aktuellen Profilziel passen, und achte darauf, dass alle Links korrekt eingetragen sind.</p>`;
}

function relatedProducts(currentSlug) {
  const products = getProducts();
  return `<div class="content-block related-products reveal"><h2>Passende Produkte</h2><div class="related-list">${Object.entries(products).filter(([slug]) => slug !== currentSlug).slice(0, 6).map(([slug, product]) => `<a class="related-card" style="${platformStyle(product.platform)}" href="${pathTo(slug)}">
    ${platformLogo(product.platform)}
    <span class="related-copy"><strong>${product.title}</strong><small>${product.platform} · ${product.type}</small></span>
    <span class="related-price">ab ${eur(productMinPrice(product))}</span>
    <span class="related-arrow">→</span>
  </a>`).join("")}</div></div>`;
}

function cartPage() {
  const cart = getCart();
  if (!cart.length) {
    return `<section class="section"><div class="container"><div class="content-block reveal" style="text-align:center"><h1 style="color:var(--ink);font-size:48px">Dein Warenkorb ist noch leer</h1><p class="muted">Wähle ein Social-Media-Paket aus und starte deinen Boost in wenigen Schritten.</p><a class="btn btn-primary" href="/#produkte">Pakete ansehen</a></div></div></section>`;
  }
  const multiCartNotice = cart.length > 1 ? `<div class="cart-notice"><strong>Hinweis zu mehreren Produkten</strong><p>Aktuell arbeiten wir daran, mehrere Pakete in einer gemeinsamen Zahlung noch einfacher zu machen. Bitte kaufe die Produkte vorübergehend einzeln nacheinander, damit jedes Paket korrekt zugeordnet und verarbeitet werden kann.</p></div>` : "";
  return `<section class="section"><div class="container split"><div class="content-block reveal"><h1 style="color:var(--ink);font-size:48px">Warenkorb</h1>${multiCartNotice}<div>${cart.map((item, i) => cartItem(item, i)).join("")}</div></div>${summaryBox("/kasse/", "Zur Kasse")}</div></section><section class="section"><div class="container"><div class="section-head"><h2>Noch mehr Sichtbarkeit?</h2></div><div class="grid cards-4">${["instagram-likes-kaufen","tiktok-views-kaufen","instagram-views-kaufen","youtube-views-kaufen"].map((slug) => productCard(slug, getProducts()[slug])).join("")}</div></div></section>`;
}

function cartItem(item, index) {
  return `<div class="cart-item"><div><h3>${item.title}</h3><div class="line-meta"><span>${item.platform}</span><span>${amountLabel(item.quantity)} ${item.type}</span><span>${item.profile}</span></div></div><div style="text-align:right"><strong>${eur(item.price)}</strong><br><button class="remove" data-remove="${index}">Entfernen</button></div></div>`;
}

function summaryBox(target, label) {
  const config = getConfig();
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const multi = cart.length > 1;
  return `<aside class="checkout-box reveal"><h2 style="font-size:28px">Bestellübersicht</h2><div class="summary-row"><span>Zwischensumme</span><strong>${eur(subtotal)}</strong></div><div class="coupon-box"><strong>Aktionscode vorhanden?</strong><small>Den Code kannst du später auf der sicheren Zahlungsseite eingeben. Der Rabatt wird dort berechnet und angewendet.</small></div><div class="summary-row total"><span>Gesamtpreis</span><strong>${eur(subtotal)}</strong></div>${multi ? `<button class="btn btn-light" type="button" style="width:100%" disabled>Bitte einzeln kaufen</button>` : `<a class="btn btn-primary" style="width:100%" href="${target}">${label}</a>`}</aside>`;
}

function checkoutPage() {
  const cart = getCart();
  if (!cart.length) return cartPage();
  if (cart.length > 1) {
    return `<section class="section"><div class="container"><div class="content-block reveal"><h1 style="color:var(--ink);font-size:46px">Ein Produkt pro Zahlung</h1><p class="muted">Aktuell sind deine Stripe-Zahlungslinks pro Paket einzeln angelegt. Bitte entferne alle bis auf ein Produkt und kaufe die Pakete nacheinander, damit jedes Paket korrekt zugeordnet wird.</p><a class="btn btn-primary" href="/warenkorb/">Zurück zum Warenkorb</a></div></div></section>`;
  }
  const item = cart[0];
  return `<section class="section"><div class="container"><div class="section-head reveal"><h1 style="color:var(--ink);font-size:48px">Sichere Kasse</h1><p>Deine Bestellung wird vorbereitet. Danach wirst du zur sicheren Stripe-Zahlungsseite weitergeleitet.</p></div><div class="split"><form class="content-block reveal" data-checkout><div class="form-grid"><div class="field"><label>Vorname</label><input class="input" name="firstName" required autocomplete="given-name"></div><div class="field"><label>Nachname</label><input class="input" name="lastName" required autocomplete="family-name"></div><div class="field full"><label>E-Mail-Adresse</label><input class="input" type="email" name="email" required autocomplete="email"></div><div class="field full"><label>Rechnungsadresse</label><input class="input" name="address" required autocomplete="street-address"></div><div class="field full"><label>Zahlungsart</label><input class="input" value="Stripe Zahlungsseite: PayPal, Karte, Apple Pay, Google Pay und weitere aktivierte Methoden" disabled><small>Der Rabattcode wird später direkt auf der Stripe-Zahlungsseite eingegeben.</small></div><label class="field full"><span><input type="checkbox" required> Ich akzeptiere die AGB.</span></label><label class="field full"><span><input type="checkbox" required> Ich habe die Datenschutzhinweise gelesen.</span></label></div><button class="btn btn-primary" type="submit" style="width:100%">Weiter zur sicheren Zahlung</button><div class="form-status" data-form-status role="status"></div></form><aside>${summaryBox("#", "Bestellung vorbereiten")}<div class="checkout-box reveal" style="margin-top:18px"><h3>Trust-Box</h3><ul><li>Sichere Stripe-Zahlungsseite</li><li>Kein Passwort erforderlich</li><li>Einmalzahlung ohne Abo</li><li>Support bei Fragen</li><li>Manuelle Prüfung nach Zahlung in Phase 1</li></ul></div></aside></div></div></section>`;
}

function faqPage() {
  return `<section class="product-hero"><div class="container"><h1>FAQ</h1><p class="lead">Antworten auf die wichtigsten Fragen zu Bestellung, Zahlung, Profilangaben, Refill und Bearbeitung.</p></div></section><section class="section"><div class="container">${faqBlock("Häufige Fragen", mainFaq)}</div></section>`;
}

function contactPage(kind = "contact") {
  const refill = kind === "refill";
  return `<section class="product-hero"><div class="container"><h1>${refill ? "Refill anfragen" : "Kontakt zu FameBoost.de"}</h1><p class="lead">${refill ? "Wenn du ein Paket mit Refill-Option gekauft hast und innerhalb des Schutzzeitraums ein Teil der Menge gesunken ist, kannst du hier eine Prüfung anfragen." : "Du hast eine Frage zu deiner Bestellung oder möchtest wissen, welches Paket am besten passt? Schreibe uns über das Kontaktformular."}</p></div></section><section class="section"><div class="container split"><form class="content-block reveal" data-contact-form><input type="hidden" name="formType" value="${refill ? "Refill-Anfrage" : "Kontaktanfrage"}"><div class="field" style="display:none"><label>Website</label><input class="input" name="website" tabindex="-1" autocomplete="off"></div><div class="form-grid"><div class="field"><label>Name</label><input class="input" name="name" required autocomplete="name"></div><div class="field"><label>E-Mail</label><input class="input" name="email" type="email" required autocomplete="email"></div><div class="field"><label>Bestellnummer ${refill ? "" : "optional"}</label><input class="input" name="orderNumber" ${refill ? "required" : ""}></div><div class="field"><label>${refill ? "Produkt" : "Thema"}</label>${refill ? `<input class="input" name="topic" required>` : `<select class="select" name="topic"><option>Frage vor dem Kauf</option><option>Frage zu einer Bestellung</option><option>Zahlungsproblem</option><option>Refill-Anfrage</option><option>Sonstiges</option></select>`}</div>${refill ? `<div class="field full"><label>Profilname/Link</label><input class="input" name="profile" required></div>` : ""}<div class="field full"><label>Nachricht</label><textarea name="message" required></textarea></div>${refill ? `<div class="field full"><label>Screenshot Upload optional</label><input class="input" name="screenshot" type="file"><small>Dateianhänge werden im einfachen cPanel-Mailversand nicht mitgesendet. Bitte beschreibe den Fall zusätzlich in der Nachricht.</small></div>` : ""}</div><button class="btn btn-primary" type="submit">${refill ? "Refill prüfen lassen" : "Nachricht senden"}</button><div class="form-status" data-form-status role="status"></div></form><div class="checkout-box reveal"><h2>Support-Hinweis</h2><p class="muted">Bitte gib bei Fragen zu einer Bestellung immer deine Bestellnummer und den verwendeten Profilnamen an.</p></div></div></section>`;
}

function categoryPage(platform) {
  const products = getProducts();
  const entries = Object.entries(products).filter(([, p]) => p.platform.toLowerCase() === platform.toLowerCase());
  return `<section class="product-hero"><div class="container"><h1>${platform} Pakete</h1><p class="lead">Wähle ein ${platform}-Produkt, konfiguriere die Menge und lege dein Paket direkt in den Warenkorb.</p></div></section><section class="section"><div class="container"><div class="grid cards-3">${entries.map(([slug, product]) => productCard(slug, product)).join("")}</div></div></section>${categoryOverview(platform)}`;
}

function agbPage() {
  return `<section class="product-hero"><div class="container"><h1>Allgemeine Geschäftsbedingungen</h1><p class="lead">AGB-Entwurf für FameBoost.de. Die finale Live-Version muss rechtlich geprüft und mit den vollständigen Betreiberangaben ergänzt werden.</p></div></section>
  <section class="section"><div class="container"><article class="content-block legal-doc reveal">
    <p><strong>Stand:</strong> 11.06.2026</p>
    <h2>1. Anbieter und Geltungsbereich</h2>
    <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über FameBoost.de. Vertragspartner ist der im Impressum genannte Betreiber. Abweichende Bedingungen von Kunden gelten nur, wenn sie ausdrücklich schriftlich bestätigt wurden.</p>
    <h2>2. Leistungsbeschreibung</h2>
    <p>FameBoost.de bietet digitale Social-Media-Wachstumspakete an, zum Beispiel Follower-, Like-, View-, Kommentar- oder vergleichbare Sichtbarkeitspakete für ausgewählte Plattformen. Die konkrete Leistung, Menge, Plattform, Bearbeitungszeit und mögliche Zusatzoptionen ergeben sich aus der jeweiligen Produktseite und der Bestellübersicht.</p>
    <h2>3. Keine Verbindung zu Plattformbetreibern</h2>
    <p>FameBoost.de steht in keiner Verbindung zu Instagram, TikTok, YouTube, Twitch, Facebook, Meta, ByteDance, Google oder anderen genannten Plattformen. Alle Marken, Namen und Logos gehören den jeweiligen Rechteinhabern und dienen ausschließlich der Zuordnung der angebotenen Kategorien.</p>
    <h2>4. Bestellung und Vertragsschluss</h2>
    <p>Der Kunde wählt ein Paket aus, trägt die erforderlichen Bestellangaben ein und legt das Produkt in den Warenkorb. Vor Absenden der Bestellung können Eingaben geprüft und korrigiert werden. Ein Vertrag kommt zustande, wenn die Bestellung angenommen beziehungsweise bestätigt wurde.</p>
    <h2>5. Pflichtangaben des Kunden</h2>
    <p>Der Kunde ist dafür verantwortlich, dass Profilname, Link, Plattform, Menge und Zusatzoptionen korrekt angegeben werden. Das Profil oder der Inhalt muss während der Bearbeitung öffentlich erreichbar sein. Änderungen am Profilnamen, private Profile, gelöschte Inhalte oder falsche Links können die Bearbeitung verzögern oder verhindern.</p>
    <h2>6. Preise, Zahlung und Fälligkeit</h2>
    <p>Alle Preise werden im Shop angezeigt. Die verfügbaren Zahlungsarten ergeben sich aus der Kasse. Die Bearbeitung einer Bestellung beginnt grundsätzlich erst nach erfolgreicher Zahlungsbestätigung. Preisänderungen bleiben für zukünftige Bestellungen vorbehalten.</p>
    <h2>7. Bearbeitung und Lieferzeiten</h2>
    <p>Bearbeitungs- und Lieferzeiten sind Richtwerte und können je nach Produkt, Menge, technischer Verfügbarkeit, Auslastung oder Plattformänderungen variieren. Eine bestimmte Reichweite, Interaktionsrate, Umsatzsteigerung oder ein dauerhaftes Ergebnis wird nicht zugesichert.</p>
    <h2>8. Zulässige Nutzung</h2>
    <p>Der Kunde verpflichtet sich, die Dienste nicht für rechtswidrige, irreführende, betrügerische, beleidigende, diskriminierende, jugendgefährdende oder sonst unzulässige Inhalte zu verwenden. FameBoost.de kann Bestellungen ablehnen oder abbrechen, wenn ein begründeter Verdacht auf Missbrauch besteht.</p>
    <h2>9. Plattformrichtlinien und Kundenverantwortung</h2>
    <p>Der Kunde bleibt selbst dafür verantwortlich, die Nutzungsbedingungen der jeweiligen Social-Media-Plattform zu prüfen und einzuhalten. FameBoost.de kann nicht gewährleisten, dass Plattformen Inhalte, Profile oder Interaktionen dauerhaft unverändert anzeigen.</p>
    <h2>10. Refill-Option</h2>
    <p>Eine Nachfülloption besteht nur, wenn sie auf der Produktseite oder in der Bestellung ausdrücklich ausgewählt oder genannt wird. Umfang, Zeitraum und Bedingungen richten sich nach dem jeweiligen Paket. Eine Prüfung kann abgelehnt werden, wenn der Link falsch war, das Profil privat ist, Inhalte gelöscht wurden oder die Voraussetzungen des Pakets nicht erfüllt sind.</p>
    <h2>11. Widerruf bei digitalen Leistungen</h2>
    <p>Für Verbraucher gelten die gesetzlichen Widerrufsrechte. Bei digitalen Leistungen kann das Widerrufsrecht unter bestimmten Voraussetzungen erlöschen, wenn der Kunde ausdrücklich zustimmt, dass mit der Leistung vor Ablauf der Widerrufsfrist begonnen wird, und seine Kenntnis vom möglichen Erlöschen bestätigt. Die konkrete Widerrufsbelehrung ist auf der Seite Widerrufsbelehrung zu hinterlegen.</p>
    <h2>12. Rückerstattungen und Korrekturen</h2>
    <p>Bei fehlerhafter, nicht begonnener oder nicht vollständig erbrachter Leistung kann eine Prüfung über den Support angefragt werden. Je nach Fall kommen Korrektur, Nachbearbeitung, Teilgutschrift oder Rückerstattung in Betracht. Rückerstattungen sind ausgeschlossen, soweit die Leistung korrekt erbracht wurde oder die Nichtausführung auf falschen Kundenangaben beruht.</p>
    <h2>13. Support und Kommunikation</h2>
    <p>Supportanfragen sollen über die Kontaktseite gestellt werden. Bei Bestellungen sind Bestellnummer, E-Mail-Adresse, Produkt und verwendeter Profilname beziehungsweise Link anzugeben, damit die Anfrage zugeordnet werden kann.</p>
    <h2>14. Haftung</h2>
    <p>FameBoost.de haftet nach den gesetzlichen Vorschriften für Vorsatz, grobe Fahrlässigkeit sowie für Schäden aus Verletzung von Leben, Körper oder Gesundheit. Für mittelbare Schäden, entgangenen Gewinn, Plattformmaßnahmen oder Folgen fehlerhafter Kundenangaben wird nur gehaftet, soweit gesetzlich zwingend vorgeschrieben.</p>
    <h2>15. Änderungen dieser AGB</h2>
    <p>FameBoost.de kann diese AGB für zukünftige Bestellungen anpassen. Für bereits abgeschlossene Bestellungen gilt grundsätzlich die zum Zeitpunkt der Bestellung verfügbare Fassung, sofern keine zwingenden gesetzlichen Regelungen entgegenstehen.</p>
    <h2>16. Schlussbestimmungen</h2>
    <p>Es gilt das Recht der Bundesrepublik Deutschland, soweit keine zwingenden Verbraucherschutzvorschriften entgegenstehen. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Regelungen unberührt.</p>
  </article></div></section>`;
}

function legalPage(title) {
  if (title === "AGB") return agbPage();
  if (title === "Impressum") return impressumPage();
  if (title === "Datenschutz") return datenschutzPage();
  if (title === "Cookie-Hinweise") return cookiePage();
  if (title === "Widerrufsbelehrung") return widerrufPage();
  const trademarkNotice = title === "Impressum" ? `<div class="notice trademark-notice"><strong>Marken- und Logohinweis:</strong> Instagram, TikTok, YouTube, Twitch, Facebook sowie die dazugehörigen Logos und Markenkennzeichen sind Marken beziehungsweise geschützte Kennzeichen der jeweiligen Rechteinhaber. Die Darstellung auf fameboost.de dient ausschließlich der eindeutigen Plattform-Zuordnung im Shop. FameBoost.de steht in keiner Verbindung zu Meta, ByteDance, Google, Twitch oder anderen Plattformbetreibern und ist kein offizieller Partner dieser Unternehmen.</div>` : "";
  return `<section class="product-hero"><div class="container"><h1>${title}</h1><p class="lead">Platzhalterseite für die rechtliche Live-Version von fameboost.de.</p></div></section><section class="section"><div class="container"><div class="content-block reveal"><div class="notice">Wichtig: Die finalen Rechtstexte müssen von einem Anwalt oder einem spezialisierten Generator wie Händlerbund, eRecht24, IT-Recht Kanzlei oder Trusted Shops erstellt und geprüft werden.</div>${trademarkNotice}<h2 style="margin-top:24px">${title}</h2><p>Dieser Bereich ist als struktureller Platzhalter vorbereitet. Vor dem Livegang müssen Anbieterinformationen, gesetzliche Pflichtangaben, Widerrufsregeln, Zahlungsbedingungen, Lieferbedingungen, Datenschutzprozesse und Cookie-Hinweise vollständig ergänzt und geprüft werden.</p><p>Es werden keine unbelegten Garantien, keine fremden Bewertungen und keine Aussagen zu offiziellen Plattformpartnerschaften verwendet.</p></div></div></section>`;
}

function datenschutzPage() {
  return `<section class="product-hero"><div class="container"><h1>Datenschutzerklärung</h1><p class="lead">Datenschutzhinweise für FameBoost.de auf Basis der aktuell eingebauten Funktionen.</p></div></section>
  <section class="section"><div class="container"><article class="content-block legal-doc reveal">
    <p><strong>Stand:</strong> 11.06.2026</p>
    <div class="notice">Diese Datenschutzerklärung muss vor dem Livegang final rechtlich geprüft und an die tatsächlich genutzten Dienstleister angepasst werden.</div>
    <h2>1. Verantwortlicher</h2>
    <p>Oiven Games GmbH, Elmeloher Straße 17a, 27777 Ganderkesee, Deutschland. E-Mail: <a href="mailto:nevio@oivengames.com">nevio@oivengames.com</a>.</p>
    <h2>2. Hosting und Server-Logs</h2>
    <p>Die Website wird über ein cPanel-Hosting betrieben. Beim Aufruf werden technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt, angeforderte URL, Browserinformationen und Statuscodes verarbeitet, um die Website auszuliefern und Missbrauch zu erkennen.</p>
    <h2>3. Bestellungen</h2>
    <p>Für Bestellungen verarbeiten wir Name, E-Mail-Adresse, Rechnungsadresse, Produkt, Menge, Profilname oder Link, interne Order-ID, Zahlungsstatus, Bestellstatus und technische Statusdaten. Diese Daten werden zur Vertragsabwicklung, Zahlungszuordnung, Supportbearbeitung und Betrugsprävention benötigt.</p>
    <h2>4. Zahlungsabwicklung über Stripe</h2>
    <p>Die Zahlung erfolgt über Stripe Payment Links beziehungsweise Stripe Checkout. Zahlungsdaten werden direkt bei Stripe verarbeitet. FameBoost.de speichert den Zahlungsstatus, die Zuordnung zur Bestellung und technische Webhook-Daten.</p>
    <h2>5. Reseller-Panel</h2>
    <p>Nach bestätigter Zahlung können produktbezogene Daten wie Service-ID, Menge und Profilname oder Link an das angebundene Reseller-Panel übermittelt werden, sofern die Bestellung nicht manuell gehalten wird.</p>
    <h2>6. Kontaktformular und Refill-Anfragen</h2>
    <p>Bei Kontakt- und Refill-Formularen verarbeiten wir die eingegebenen Angaben, um die Anfrage zu beantworten. Zusätzlich kann eine automatische Eingangsbestätigung per E-Mail versendet werden.</p>
    <h2>7. Newsletter</h2>
    <p>Wenn du dich aktiv anmeldest, speichern wir deine E-Mail-Adresse, Zeitpunkt und Einwilligung. Vor regelmäßigem Newsletter-Versand sollten Double-Opt-In und Abmeldelink final umgesetzt oder rechtlich geprüft werden.</p>
    <h2>8. Cookies und lokale Speicherung</h2>
    <p>Aktuell nutzt die Website technisch notwendige lokale Speicherung für Warenkorb, Bestellstatus, Cookie-Hinweis und Admin-Sitzung. Tracking- oder Marketing-Cookies sind aktuell nicht aktiv.</p>
    <h2>9. Speicherdauer und Rechte</h2>
    <p>Daten werden nur so lange gespeichert, wie sie für den jeweiligen Zweck, gesetzliche Pflichten, Support oder Missbrauchsabwehr erforderlich sind. Betroffene Personen haben je nach Voraussetzung Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit.</p>
  </article></div></section>`;
}

function cookiePage() {
  return `<section class="product-hero"><div class="container"><h1>Cookie-Hinweise</h1><p class="lead">Transparenz zu technisch notwendigen Funktionen auf FameBoost.de.</p></div></section>
  <section class="section"><div class="container"><article class="content-block legal-doc reveal">
    <p><strong>Stand:</strong> 11.06.2026</p>
    <h2>Aktueller Stand</h2>
    <p>FameBoost.de nutzt aktuell keine Analytics- oder Marketing-Cookies. Der Cookie-Hinweis dient als Transparenzhinweis für technisch notwendige Funktionen.</p>
    <h2>Technisch notwendige Speicherung</h2>
    <p>Der Warenkorb, der letzte Bestellstatus, die Bestätigung des Cookie-Hinweises und die Admin-Sitzung können lokal beziehungsweise serverseitig gespeichert werden, damit die Website funktioniert.</p>
    <h2>Spätere Erweiterungen</h2>
    <p>Wenn später Analytics, Pixel oder Marketingdienste eingebunden werden, muss vor dem Laden dieser Dienste ein echter Consent-Banner mit Auswahlmöglichkeiten, Ablehnen-Funktion und Widerrufsmöglichkeit eingebaut werden.</p>
  </article></div></section>`;
}

function widerrufPage() {
  return `<section class="product-hero"><div class="container"><h1>Widerrufsbelehrung</h1><p class="lead">Widerrufsinformationen für digitale Leistungen auf FameBoost.de.</p></div></section>
  <section class="section"><div class="container"><article class="content-block legal-doc reveal">
    <p><strong>Stand:</strong> 11.06.2026</p>
    <p>Die Oiven Games GmbH, im Folgenden als FameBoost.de bezeichnet, legt die nachfolgende Widerrufsbelehrung für die Nutzung der auf dieser Plattform angebotenen Dienstleistungen fest.</p>
    <p>Ihr Widerrufsrecht kann gemäß den gesetzlichen Regelungen für digitale Dienstleistungen mit dem Beginn der Ausführung des Auftrags erlöschen, wenn Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und Sie Ihre Kenntnis vom möglichen Erlöschen des Widerrufsrechts bestätigt haben.</p>
    <p>Eine Bestellung kann nur widerrufen werden, wenn die Durchführung des Auftrags noch nicht begonnen hat und der Auftrag sich noch nicht im internen Verarbeitungssystem befindet.</p>
    <h2>Muster-Widerrufsformular</h2>
    <div class="withdrawal-form">
      <p>An Oiven Games GmbH<br>[Anschrift der Oiven Games GmbH ergänzen]<br>E-Mail: nevio@oivengames.com</p>
      <p>Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Dienstleistung:</p>
      <p>Bestellt am:</p>
      <p>Name des/der Verbraucher(s):</p>
      <p>Anschrift des/der Verbraucher(s):</p>
      <p>Bestellnummer, falls vorhanden:</p>
      <p>Datum:</p>
    </div>
  </article></div></section>`;
}

function impressumPage() {
  return `<section class="product-hero"><div class="container"><h1>Impressum</h1><p class="lead">Anbieterkennzeichnung gemäß § 5 DDG und § 35a GmbHG.</p></div></section>
  <section class="section"><div class="container"><article class="content-block legal-doc reveal">
    <p><strong>Stand des Impressums:</strong> 11.06.2026</p>

    <h2>Impressum / Anbieterkennzeichnung</h2>
    <div class="imprint-address-card">
      <img class="imprint-address-image" src="/assets/img/imprint.png" alt="Oiven Games GmbH, Elmeloher Straße 17a, 27777 Ganderkesee, Deutschland" loading="lazy">
    </div>
    <p>E-Mail: <a href="mailto:nevio@oivengames.com">nevio@oivengames.com</a></p>

    <h2>Vertreten durch</h2>
    <p>Geschäftsführer: Nevio Alexander Vogt</p>

    <h2>Sitz der Gesellschaft</h2>
    <p>Ganderkesee, Deutschland</p>

    <h2>Registereintrag</h2>
    <p>Registergericht: Amtsgericht Oldenburg<br>
    Handelsregister: HRB 222916</p>

    <h2>Umsatzsteuer-Identifikationsnummer</h2>
    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br>
    DE458833644</p>

    <div class="notice trademark-notice"><strong>Marken- und Logohinweis:</strong> Instagram, TikTok, YouTube, Twitch, Facebook sowie die dazugehörigen Logos und Markenkennzeichen sind Marken beziehungsweise geschützte Kennzeichen der jeweiligen Rechteinhaber. Die Darstellung auf fameboost.de dient ausschließlich der eindeutigen Plattform-Zuordnung im Shop. FameBoost.de steht in keiner Verbindung zu Meta, ByteDance, Google, Twitch oder anderen Plattformbetreibern und ist kein offizieller Partner dieser Unternehmen.</div>
  </article></div></section>`;
}

function adminMailTestBlock() {
  return `<div class="content-block reveal"><div class="admin-toolbar"><div><h2>E-Mail-Test</h2><p class="muted">Sende eine kurze Testmail, um den Mailversand auf dem Server zu prüfen.</p></div></div><form class="admin-test-mail" data-admin-test-mail><input class="input" type="email" name="email" placeholder="test@example.com" required><button class="btn btn-primary" type="submit">Testmail senden</button><div class="form-status" data-form-status role="status"></div></form></div>`;
}

function adminPage() {
  if (adminAuthState.loading || !adminAuthState.loaded) {
    return `<section class="product-hero"><div class="container"><h1>Admin</h1><p class="lead">Admin-Status wird geprüft...</p></div></section><section class="section"><div class="container"><div class="content-block admin-auth-card reveal"><div class="notice">Admin-Login wird geladen...</div></div></div></section>`;
  }
  if (adminAuthState.setup_required) {
    if (adminAuthState.setup?.otpauth_uri) {
      return `<section class="product-hero"><div class="container"><h1>Admin einrichten</h1><p class="lead">Scanne den QR-Code mit Google Authenticator und bestätige den 6-stelligen Code.</p></div></section><section class="section"><div class="container"><div class="content-block admin-auth-card reveal"><div class="admin-qr-box"><div data-admin-qr data-qr="${adminAuthState.setup.otpauth_uri}"></div><div class="notice">Falls der QR-Code nicht scanbar ist, nutze den Secret Key: <code>${adminAuthState.setup.secret}</code></div></div><form class="form-grid" data-admin-setup-verify><div class="field full"><label>Google-Authenticator-Code</label><input class="input" name="code" inputmode="numeric" autocomplete="one-time-code" required></div><button class="btn btn-primary" type="submit">Einrichtung abschließen</button><div class="form-status full" data-form-status role="status"></div></form></div></div></section>`;
    }
    return `<section class="product-hero"><div class="container"><h1>Admin einrichten</h1><p class="lead">Lege den ersten Admin-Zugang mit Passwort und Google Authenticator an.</p></div></section><section class="section"><div class="container"><form class="content-block admin-auth-card reveal" data-admin-setup-start><div class="form-grid"><div class="field"><label>Benutzername</label><input class="input" name="username" required autocomplete="username"></div><div class="field"><label>Passwort</label><input class="input" name="password" type="password" minlength="12" required autocomplete="new-password"></div></div><button class="btn btn-primary" type="submit">QR-Code erzeugen</button><div class="form-status" data-form-status role="status"></div></form></div></section>`;
  }
  if (!adminAuthState.authenticated) {
    return `<section class="product-hero"><div class="container"><h1>Admin Login</h1><p class="lead">Melde dich mit Benutzername, Passwort und Google-Authenticator-Code an.</p></div></section><section class="section"><div class="container"><form class="content-block admin-auth-card reveal" data-admin-login><div class="form-grid"><div class="field"><label>Benutzername</label><input class="input" name="username" required autocomplete="username"></div><div class="field"><label>Passwort</label><input class="input" name="password" type="password" required autocomplete="current-password"></div><div class="field full"><label>Google-Authenticator-Code</label><input class="input" name="code" inputmode="numeric" required autocomplete="one-time-code"></div></div><button class="btn btn-primary" type="submit">Einloggen</button><div class="form-status" data-form-status role="status"></div></form></div></section>`;
  }
  return `<section class="product-hero"><div class="container"><h1>Admin</h1><p class="lead">Backend-Übersicht für Bestellungen, Zahlungsprüfung, Reseller-Mapping, Status, Refill und Zählerstände.</p><button class="btn btn-light" type="button" data-admin-logout>Logout</button></div></section><section class="section"><div class="container"><div class="content-block reveal"><div class="admin-toolbar"><div><h2>Bestellungen</h2><p class="muted">Phase 1: Zahlung wird über Stripe Payment Links geprüft. Bei niedriger Reseller-Balance werden bezahlte Bestellungen automatisch pausiert.</p></div><div class="admin-actions"><button class="btn btn-light" type="button" data-release-holds>Alle Holds freigeben</button><button class="btn btn-light" type="button" data-admin-refresh>Aktualisieren</button></div></div><div data-admin-orders><div class="notice">Bestellungen werden geladen...</div></div></div><div class="content-block reveal"><div class="admin-toolbar"><div><h2>Reseller-Service-Mapping</h2><p class="muted">Suche Services aus dem Reseller-Panel und ordne sie unseren Produkten zu. Gespeichert wird nur die Service-ID und Metadaten, nicht dein API-Key.</p></div><button class="btn btn-light" type="button" data-services-refresh>Services neu laden</button></div><div data-reseller-health><div class="notice">Service-Verfügbarkeit wird geprüft...</div></div><div data-service-mapping><div class="notice">Services werden geladen...</div></div></div>${adminMailTestBlock()}</div></section>`;
}

async function loadAdminAuth(force = false) {
  if (adminAuthState.loading || (adminAuthState.loaded && !force)) return;
  adminAuthState.loading = true;
  try {
    const data = await apiJson("/api/admin-auth.php?action=state");
    adminAuthState = { loaded: true, loading: false, authenticated: !!data.authenticated, setup_required: !!data.setup_required, username: data.username || "", setup: adminAuthState.setup };
  } catch {
    adminAuthState = { loaded: true, loading: false, authenticated: false, setup_required: false, username: "", setup: null };
  }
  route();
}

function renderAdminQrCode() {
  const node = document.querySelector("[data-admin-qr]");
  if (!node || node.dataset.rendered === "1") return;
  node.dataset.rendered = "1";
  if (window.QRCode?.toCanvas) {
    window.QRCode.toCanvas(node, node.dataset.qr, { width: 224, margin: 1 });
  } else {
    node.innerHTML = `<a href="${node.dataset.qr}">Authenticator öffnen</a>`;
  }
}

async function apiJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.message || "Die Anfrage konnte nicht verarbeitet werden.");
  return data;
}

function centsToEur(cents) {
  return eur(Number(cents || 0) / 100);
}

function orderSuccessPage() {
  return `<section class="product-hero"><div class="container"><h1>Bestellung erfolgreich vorbereitet</h1><p class="lead">Hier siehst du den aktuellen Status deiner Bestellung. Nach der Stripe-Zahlung wartet diese Seite auf die Webhook-Bestätigung und zeigt danach die nächsten Schritte.</p></div></section><section class="section"><div class="container split"><div class="content-block reveal" data-order-status-panel><div class="notice">Status wird geladen...</div></div><aside class="checkout-box reveal"><h2>Wichtig</h2><ul><li>Bitte ändere deinen Profilnamen während der Bearbeitung nicht.</li><li>Dein Profil oder Link sollte öffentlich erreichbar sein.</li><li>Diese Statusseite funktioniert in dem Browser, mit dem du bestellt hast.</li></ul></aside></div></div></section>`;
}

function getOrderLookupFromUrl() {
  if (location.search) {
    history.replaceState({}, "", location.pathname);
  }
  try {
    return JSON.parse(localStorage.getItem("fb_last_order") || "{}");
  } catch {
    return {};
  }
}

function renderOrderStatus(order, token) {
  const steps = order.steps || [];
  return `<h2>Status: ${order.status_label}</h2><p class="muted">${order.message}</p><div class="progress-shell"><div class="progress-bar" style="width:${order.progress || 20}%"></div></div><div class="order-detail-grid"><div><strong>Bestellnummer</strong><span>${order.order_number}</span></div><div><strong>Produkt</strong><span>${order.product}</span></div><div><strong>Menge</strong><span>${amountLabel(order.quantity)} ${order.type}</span></div><div><strong>Gesamt</strong><span>${centsToEur(order.amount_total_cents)}</span></div></div><div class="status-steps">${steps.map((step) => `<div class="status-step ${step.state}"><span></span><strong>${step.label}</strong></div>`).join("")}</div>${feedbackBlock(order, token)}`;
}

function feedbackBlock(order, token) {
  if (order.feedback_submitted) return `<div class="notice">Danke, dein Feedback wurde gespeichert.</div>`;
  return `<form class="feedback-box" data-feedback-form><h3>Feedback geben</h3><p class="muted">Wie zufrieden bist du bisher mit dem Ablauf?</p><input type="hidden" name="order_number" value="${order.order_number}"><input type="hidden" name="token" value="${token || ""}"><div class="stars" data-stars>${[1,2,3,4,5].map((n) => `<label><input type="radio" name="rating" value="${n}" ${n === 5 ? "checked" : ""}><span>★</span></label>`).join("")}</div><textarea name="message" placeholder="Optionales Feedback"></textarea><button class="btn btn-primary" type="submit">Feedback speichern</button><div class="form-status" data-form-status></div></form>`;
}

async function loadOrderStatus() {
  const panel = document.querySelector("[data-order-status-panel]");
  if (!panel) return;
  const lookup = getOrderLookupFromUrl();
  if (!lookup.order || !lookup.token) {
    panel.innerHTML = `<div class="notice">Keine Bestellung in diesem Browser gefunden. Öffne die Seite bitte direkt nach der Zahlung in demselben Browser.</div>`;
    return;
  }
  try {
    const data = await apiJson(`/api/order-status.php?order=${encodeURIComponent(lookup.order)}&token=${encodeURIComponent(lookup.token)}`);
    panel.innerHTML = renderOrderStatus(data.order, lookup.token);
  } catch (error) {
    panel.innerHTML = `<div class="notice">${error.message}</div>`;
  }
}

let orderStatusTimer = 0;

function startOrderStatusPolling() {
  clearInterval(orderStatusTimer);
  if (!document.querySelector("[data-order-status-panel]")) return;
  orderStatusTimer = setInterval(() => {
    if (!document.querySelector("[data-order-status-panel]")) {
      clearInterval(orderStatusTimer);
      return;
    }
    loadOrderStatus();
  }, 5000);
}

async function createBackendOrder(form) {
  const cart = getCart();
  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector("button[type='submit']");
  if (cart.length !== 1) {
    if (status) status.textContent = "Bitte kaufe aktuell genau ein Produkt pro Zahlung.";
    return;
  }
  const item = cart[0];
  const payload = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    address: form.address.value,
    items: [{
      slug: item.slug,
      quantity: item.quantity,
      profile: item.profile,
      speed: item.speed,
      refill: item.refill
    }]
  };
  if (button) {
    button.disabled = true;
    button.textContent = "Bestellung wird vorbereitet...";
  }
  if (status) status.textContent = "";
  try {
    const result = await apiJson("/api/create-order.php", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    localStorage.setItem("fb_last_order", JSON.stringify({ order: result.order_number, token: result.public_token, status_url: result.status_url }));
    setCart([]);
    location.href = result.redirect_url;
  } catch (error) {
    if (status) status.textContent = error.message;
    if (button) {
      button.disabled = false;
      button.textContent = "Weiter zur sicheren Zahlung";
    }
  }
}

function renderAdminOrders(orders, notice, meta = {}) {
  if (!orders.length) return `<div class="notice">${notice || "Noch keine Bestellungen vorhanden."}</div>`;
  const statuses = ["pending_external_payment", "payment_failed", "manual_payment_check", "paid", "fulfillment_queued", "fulfillment_hold", "sent_to_reseller", "in_progress", "partially_completed", "completed", "refill_requested", "needs_review", "canceled", "refunded"];
  const balance = meta.last_reseller_balance?.balance !== undefined ? `${meta.last_reseller_balance.balance} ${meta.last_reseller_balance.currency || ""}` : "noch nicht geprüft";
  const holdNotice = meta.hold_count ? `<div class="notice hold-notice"><strong>${meta.hold_count} Bestellung(en) auf Hold.</strong><br>Letzte Panel-Balance: ${balance}. Mindestwert: ${meta.min_reseller_balance ?? 20}. Lade Balance nach und klicke dann auf „Alle Holds freigeben“ oder gib einzelne Bestellungen frei.</div>` : "";
  return `${notice ? `<div class="notice">${notice}</div>` : ""}${holdNotice}<div class="admin-order-list">${orders.map((order) => {
    const resellerMeta = [
      order.reseller_service_id ? `Service #${order.reseller_service_id}` : "",
      order.reseller_service_name ? order.reseller_service_name : "",
      order.reseller_order_id ? `JAP-ID: ${order.reseller_order_id}` : "",
      order.reseller_status ? `JAP-Status: ${order.reseller_status}` : "",
      order.estimated_reseller_cost !== null && order.estimated_reseller_cost !== undefined ? `Kosten ca. ${Number(order.estimated_reseller_cost).toFixed(4)}` : "",
      order.status === "fulfillment_hold" && order.hold_email_sent_at ? `Kunden-Mail: ${new Date(order.hold_email_sent_at).toLocaleString("de-DE")}` : "",
      order.status === "fulfillment_hold" && order.admin_hold_email_sent_at ? `Admin-Mail: ${new Date(order.admin_hold_email_sent_at).toLocaleString("de-DE")}` : "",
      order.reseller_remains !== null && order.reseller_remains !== undefined ? `Rest: ${order.reseller_remains}` : ""
    ].filter(Boolean).join(" · ");
    return `<article class="admin-order-card">
      <div class="admin-order-head">
        <div><strong>${order.order_number}</strong><span>${order.status_label} · ${new Date(order.created_at).toLocaleString("de-DE")}</span></div>
        <span class="badge">${centsToEur(order.amount_total_cents)}</span>
      </div>
      <div class="order-detail-grid">
        <div><strong>Kunde</strong><span>${order.customer_name || "Unbekannt"}<br>${order.customer_email}</span></div>
        <div><strong>Produkt</strong><span>${order.product}<br>${amountLabel(order.quantity)} ${order.type}</span></div>
        <div><strong>Ziel</strong><a href="${order.target_url}" target="_blank" rel="noopener">${order.target}</a></div>
        <div><strong>Stripe</strong><a href="${order.payment_link_url}" target="_blank" rel="noopener">${order.payment_link_id}</a></div>
      </div>
      ${resellerMeta ? `<div class="admin-meta">${resellerMeta}</div>` : ""}
      <form class="admin-counts" data-admin-counts data-order="${order.order_number}">
        <label>Start-Zähler<input class="input" name="baseline_count" type="number" min="0" value="${order.baseline_count ?? ""}"></label>
        <label>Nach Lieferung<input class="input" name="completed_count" type="number" min="0" value="${order.completed_count ?? ""}"></label>
        <button class="btn btn-light" type="submit">Zähler speichern</button>
        ${order.lost_count !== null && order.lost_count !== undefined ? `<span class="lost-count">Möglicher Drop: ${amountLabel(order.lost_count)}</span>` : ""}
      </form>
      <div class="admin-actions">
        <select class="select" data-admin-status="${order.order_number}">${statuses.map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select>
        <button class="btn btn-light" type="button" data-admin-action="${order.status === "fulfillment_hold" ? "release_hold" : "send_reseller"}" data-order="${order.order_number}">${order.status === "fulfillment_hold" ? "Freigeben" : "An Reseller senden"}</button>
        <button class="btn btn-light" type="button" data-admin-action="poll_reseller" data-order="${order.order_number}">Status abfragen</button>
        <button class="btn btn-light" type="button" data-admin-action="request_refill" data-order="${order.order_number}">Refill vormerken</button>
      </div>
    </article>`;
  }).join("")}</div>`;
}

async function loadAdminOrders() {
  const root = document.querySelector("[data-admin-orders]");
  if (!root) return;
  root.innerHTML = `<div class="notice">Bestellungen werden geladen...</div>`;
  try {
    const data = await apiJson("/api/admin-orders.php");
    root.innerHTML = renderAdminOrders(data.orders || [], data.notice || "", data);
  } catch (error) {
    root.innerHTML = `<div class="notice">${error.message}</div>`;
  }
}

let resellerServicesState = { products: [], services: [], query: "", sort: "rate_asc", health: null };
let resellerHealthTimer = 0;

function serviceSearchText(service) {
  return [service.service, service.name, service.category, service.type, service.rate, service.min, service.max].join(" ").toLowerCase();
}

function numericServiceValue(value) {
  const normalized = String(value ?? "").replace(",", ".").replace(/[^0-9.\-]/g, "");
  return Number.isFinite(Number(normalized)) ? Number(normalized) : null;
}

function parseCompactNumber(value) {
  const text = String(value || "").trim().toLowerCase().replace(",", ".");
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)\s*([kmb])?/i);
  if (!match) return null;
  const base = Number(match[1]);
  const multiplier = match[2] === "k" ? 1000 : match[2] === "m" ? 1000000 : match[2] === "b" ? 1000000000 : 1;
  return base * multiplier;
}

function serviceTiming(service) {
  const text = `${service.name || ""} ${service.category || ""}`.toLowerCase();
  const startMatch = text.match(/start(?:\s*time)?[^0-9]*(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*(min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)/i)
    || text.match(/start(?:\s*time)?[^0-9]*(\d+(?:[.,]\d+)?)\s*(min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)/i);
  let startHours = null;
  if (startMatch) {
    const unit = startMatch[startMatch.length - 1].toLowerCase();
    const value = Number(String(startMatch[startMatch.length - 2]).replace(",", "."));
    startHours = unit.startsWith("min") ? value / 60 : unit.startsWith("d") ? value * 24 : value;
  }
  const speedMatch = text.match(/(?:speed|up to)[^0-9]*([0-9.,]+\s*[kmb]?)[^\w]*(?:\/|per\s*)(d|day|h|hour)/i);
  let speedPerDay = null;
  if (speedMatch) {
    const amount = parseCompactNumber(speedMatch[1]);
    if (amount !== null) speedPerDay = speedMatch[2].startsWith("h") ? amount * 24 : amount;
  }
  return { startHours, speedPerDay };
}

function serviceSortValue(service, sort) {
  const timing = serviceTiming(service);
  if (sort.startsWith("rate")) return numericServiceValue(service.rate) ?? Number.POSITIVE_INFINITY;
  if (sort.startsWith("min")) return numericServiceValue(service.min) ?? Number.POSITIVE_INFINITY;
  if (sort.startsWith("max")) return numericServiceValue(service.max) ?? 0;
  if (sort.startsWith("start")) return timing.startHours ?? Number.POSITIVE_INFINITY;
  if (sort.startsWith("speed")) return timing.speedPerDay ?? 0;
  return 0;
}

function getFilteredServices() {
  const query = resellerServicesState.query.trim().toLowerCase();
  const base = query ? resellerServicesState.services.filter((service) => serviceSearchText(service).includes(query)) : resellerServicesState.services.slice();
  const sort = resellerServicesState.sort || "rate_asc";
  const desc = sort.endsWith("_desc");
  return base.sort((a, b) => {
    const av = serviceSortValue(a, sort);
    const bv = serviceSortValue(b, sort);
    if (av === bv) return String(a.name || "").localeCompare(String(b.name || ""));
    return desc ? bv - av : av - bv;
  });
}

function adminProductBySlug(slug) {
  return resellerServicesState.products.find((product) => product.slug === slug) || null;
}

function adminProductOfferMax(slug) {
  const mappedProduct = adminProductBySlug(slug);
  const adminQuantities = (mappedProduct?.quantities || []).map(Number).filter(Number.isFinite);
  if (adminQuantities.length) return Math.max(...adminQuantities);
  const product = getProducts()[slug];
  return product ? staticProductMax(product) : 0;
}

function serviceMaxWarning(service, slug) {
  const serviceMax = numericServiceValue(service?.max);
  const offerMax = adminProductOfferMax(slug);
  if (!serviceMax || !offerMax || serviceMax >= offerMax) return "";
  return `Warnung: Dieser Reseller-Service erlaubt maximal ${amountLabel(serviceMax)}, wir bieten bei diesem Produkt aber bis ${amountLabel(offerMax)} an. Kunden könnten sonst größere Pakete kaufen, die nicht zum Service passen.`;
}

function renderServiceMapping(data) {
  resellerServicesState = { ...resellerServicesState, products: data.products || [], services: data.services || [], health: data.health || resellerServicesState.health };
  const products = resellerServicesState.products;
  const services = resellerServicesState.services;
  const filtered = getFilteredServices();
  const shown = filtered.slice(0, 120);
  return `${data.warning ? `<div class="notice">${data.warning}</div>` : ""}<div class="service-map-layout">
    <aside class="service-products">
      <h3>FameBoost-Produkte</h3>
      ${products.map((product, index) => `<button class="service-product ${index === 0 ? "active" : ""}" type="button" data-service-product="${product.slug}">
        <strong>${product.label}</strong>
        <span>${product.mapping?.service_id ? `Service #${product.mapping.service_id}` : "Noch nicht gemappt"}</span>
      </button>`).join("")}
    </aside>
    <div class="service-browser">
      <div class="service-search-row">
        <input class="input" data-service-search placeholder="Reseller-Service suchen, z. B. Instagram Followers refill" value="${resellerServicesState.query}">
        <select class="select" data-service-sort>
          <option value="rate_asc" ${resellerServicesState.sort === "rate_asc" ? "selected" : ""}>Rate: günstig zuerst</option>
          <option value="rate_desc" ${resellerServicesState.sort === "rate_desc" ? "selected" : ""}>Rate: teuer zuerst</option>
          <option value="start_asc" ${resellerServicesState.sort === "start_asc" ? "selected" : ""}>Startzeit: schnell zuerst</option>
          <option value="speed_desc" ${resellerServicesState.sort === "speed_desc" ? "selected" : ""}>Speed: schnell zuerst</option>
          <option value="min_asc" ${resellerServicesState.sort === "min_asc" ? "selected" : ""}>Min: klein zuerst</option>
          <option value="max_desc" ${resellerServicesState.sort === "max_desc" ? "selected" : ""}>Max: groß zuerst</option>
        </select>
        <span>${services.length} Services geladen${data.cached ? " · Cache" : ""}</span>
      </div>
      <div data-active-product-note>${products[0] ? renderActiveProductNote(products[0]) : ""}</div>
      <div class="service-list">
        ${shown.map((service) => renderServiceCard(service, products[0]?.slug || "")).join("") || `<div class="notice">Keine Services gefunden.</div>`}
      </div>
    </div>
  </div>`;
}

function renderActiveProductNote(product) {
  const maxNote = product.mapping?.max ? `<br><strong>Automatisches Max-Limit:</strong> ${amountLabel(product.mapping.max)} wird für eigene Mengen im Shop übernommen.` : "";
  const mappedServiceMax = numericServiceValue(product.mapping?.max);
  const offeredMax = adminProductOfferMax(product.slug);
  const maxWarning = mappedServiceMax && offeredMax && mappedServiceMax < offeredMax ? `<br><strong class="admin-danger-text">Max-Warnung:</strong> Der zugewiesene Service kann maximal ${amountLabel(mappedServiceMax)}, im Shop sind aber bis ${amountLabel(offeredMax)} angeboten.` : "";
  const health = resellerServicesState.health?.products?.[product.slug];
  const healthNote = health && health.available === false ? `<br><strong class="admin-danger-text">Warnung:</strong> Zugewiesener Service #${health.service_id} ist aktuell nicht verfügbar. Käufe für dieses Produkt werden blockiert, bis du neu zuweist.` : "";
  return `<div class="admin-meta ${health?.available === false || maxWarning ? "admin-meta-danger" : ""}"><strong>Aktives Produkt:</strong> ${product.label} · Mengen: ${(product.quantities || []).map(amountLabel).join(", ")}${product.mapping?.service_name ? `<br><strong>Aktuelles Mapping:</strong> #${product.mapping.service_id} · ${product.mapping.service_name}` : ""}${maxNote}${maxWarning}${healthNote}</div>`;
}

function renderServiceCard(service, activeSlug) {
  const timing = serviceTiming(service);
  const start = timing.startHours !== null ? `Start ca. ${timing.startHours < 1 ? Math.round(timing.startHours * 60) + " Min" : timing.startHours + " h"}` : "";
  const speed = timing.speedPerDay !== null ? `Speed ca. ${amountLabel(Math.round(timing.speedPerDay))}/Tag` : "";
  const meta = [`ID ${service.service}`, service.category, service.type, service.rate ? `Rate ${service.rate}` : "", service.min ? `Min ${service.min}` : "", service.max ? `Max ${service.max}` : "", start, speed].filter(Boolean).join(" · ");
  const warning = serviceMaxWarning(service, activeSlug);
  return `<article class="service-card ${warning ? "service-card-warning" : ""}">
    <div>
      <strong>${service.name || "Unbenannter Service"}</strong>
      <span>${meta}</span>
      ${warning ? `<em>${warning}</em>` : ""}
    </div>
    <button class="btn btn-light" type="button" data-map-service="${service.service}" data-active-slug="${activeSlug}">Auswählen</button>
  </article>`;
}

function updateServiceMappingView() {
  const root = document.querySelector("[data-service-mapping]");
  if (!root) return;
  const activeSlug = root.querySelector(".service-product.active")?.dataset.serviceProduct || resellerServicesState.products[0]?.slug || "";
  const activeProduct = resellerServicesState.products.find((product) => product.slug === activeSlug) || resellerServicesState.products[0];
  const filtered = getFilteredServices();
  const shown = filtered.slice(0, 120);
  const note = root.querySelector("[data-active-product-note]");
  const list = root.querySelector(".service-list");
  if (note && activeProduct) note.innerHTML = renderActiveProductNote(activeProduct);
  if (list) list.innerHTML = shown.map((service) => renderServiceCard(service, activeProduct?.slug || "")).join("") || `<div class="notice">Keine Services gefunden.</div>`;
}

async function loadServiceMapping(refresh = false) {
  const root = document.querySelector("[data-service-mapping]");
  if (!root) return;
  root.innerHTML = `<div class="notice">Services werden geladen...</div>`;
  try {
    const data = await apiJson(`/api/admin-reseller-services.php${refresh ? "?refresh=1" : ""}`);
    root.innerHTML = renderServiceMapping(data);
  } catch (error) {
    root.innerHTML = `<div class="notice">${error.message}<br>Trage zuerst den Reseller-API-Key in <code>frontend/api/_private/config.local.php</code> ein.</div>`;
  }
}

function renderResellerHealth(health) {
  if (!health) return `<div class="notice">Noch kein Service-Health-Check vorhanden.</div>`;
  const checked = health.checked_at ? new Date(health.checked_at).toLocaleString("de-DE") : "noch nicht geprüft";
  if (health.ok === false) {
    return `<div class="notice hold-notice"><strong>Service-Check fehlgeschlagen.</strong><br>${health.message || "Reseller-Services konnten nicht geprüft werden."}<br>Letzter Check: ${checked}</div>`;
  }
  const unavailable = health.unavailable || [];
  if (!unavailable.length) {
    return `<div class="notice service-health-ok"><strong>Alle gemappten Reseller-Services verfügbar.</strong><br>${health.mapped_count || 0} Mapping(s), ${health.service_count || 0} Services geprüft. Letzter Check: ${checked}</div>`;
  }
  return `<div class="notice service-health-danger"><strong>${unavailable.length} Mapping(s) müssen dringend gefixt werden.</strong><br>Käufe für diese Produkte werden blockiert, bis ein verfügbarer Service zugewiesen ist. Letzter Check: ${checked}<ul>${unavailable.map((item) => `<li>${item.label}: Service #${item.service_id} ${item.service_name ? `· ${item.service_name}` : ""}</li>`).join("")}</ul></div>`;
}

async function loadResellerHealth(refresh = false) {
  const root = document.querySelector("[data-reseller-health]");
  if (!root) return;
  try {
    const data = await apiJson(`/api/admin-reseller-health.php${refresh ? "?refresh=1" : ""}`);
    resellerServicesState.health = data.health || null;
    root.innerHTML = renderResellerHealth(resellerServicesState.health);
    await loadProductLimits();
    updateServiceMappingView();
  } catch (error) {
    root.innerHTML = `<div class="notice hold-notice">${error.message}</div>`;
  }
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const burger = event.target.closest("#burger");
    if (burger) document.getElementById("nav-links").classList.toggle("open");
    const faqBtn = event.target.closest(".faq-item button");
    if (faqBtn) faqBtn.closest(".faq-item").classList.toggle("open");
    const coupon = event.target.closest("[data-copy-coupon]");
    if (coupon) {
      localStorage.setItem("fk24_coupon", coupon.dataset.copyCoupon);
      navigator.clipboard?.writeText(coupon.dataset.copyCoupon);
      coupon.textContent = "Kopiert";
    }
    const cookieOk = event.target.closest("[data-cookie-ok]");
    if (cookieOk) {
      localStorage.setItem("fb_cookie_notice_ok", "1");
      document.getElementById("cookie-notice")?.remove();
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      const cart = getCart();
      cart.splice(Number(remove.dataset.remove), 1);
      setCart(cart);
      route();
    }
    const savePrices = event.target.closest("[data-save-prices]");
    if (savePrices) {
      const products = getProducts();
      document.querySelectorAll("[data-admin-price]").forEach((input) => {
        products[input.dataset.slug].quantities[input.dataset.index][1] = Number(input.value);
      });
      saveProducts(products);
      route();
    }
    const adminRefresh = event.target.closest("[data-admin-refresh]");
    if (adminRefresh) {
      loadAdminOrders();
      loadResellerHealth(true);
    }
    const releaseHolds = event.target.closest("[data-release-holds]");
    if (releaseHolds) {
      releaseHolds.disabled = true;
      releaseHolds.textContent = "Holds werden geprüft...";
      apiJson("/api/admin-bulk-action.php", {
        method: "POST",
        body: JSON.stringify({ action: "release_holds" })
      }).then((result) => {
        alert(`${result.message} Gesendet: ${result.stats?.sent ?? 0}, weiter auf Hold: ${result.stats?.still_on_hold ?? 0}, Fehler: ${result.stats?.failed ?? 0}`);
        loadAdminOrders();
      }).catch((error) => alert(error.message)).finally(() => {
        releaseHolds.disabled = false;
        releaseHolds.textContent = "Alle Holds freigeben";
      });
    }
    const servicesRefresh = event.target.closest("[data-services-refresh]");
    if (servicesRefresh) {
      loadResellerHealth(true);
      loadServiceMapping(true);
    }
    const serviceProduct = event.target.closest("[data-service-product]");
    if (serviceProduct) {
      document.querySelectorAll("[data-service-product]").forEach((node) => node.classList.remove("active"));
      serviceProduct.classList.add("active");
      updateServiceMappingView();
    }
    const mapService = event.target.closest("[data-map-service]");
    if (mapService) {
      const service = resellerServicesState.services.find((item) => item.service === mapService.dataset.mapService);
      const slug = mapService.dataset.activeSlug;
      if (service && slug) {
        const maxWarning = serviceMaxWarning(service, slug);
        if (maxWarning && !confirm(`${maxWarning}\n\nTrotzdem diesem Produkt zuweisen?`)) {
          return;
        }
        apiJson("/api/admin-reseller-mapping.php", {
          method: "POST",
          body: JSON.stringify({
            slug,
            service_id: service.service,
            service_name: service.name,
            category: service.category,
            type: service.type,
            rate: service.rate,
            min: service.min,
            max: service.max,
            refill: service.refill,
            cancel: service.cancel
          })
        }).then(async () => {
          await loadProductLimits();
          await loadResellerHealth(true);
          loadServiceMapping();
        }).catch((error) => alert(error.message));
      }
    }
    const adminAction = event.target.closest("[data-admin-action]");
    if (adminAction) {
      apiJson("/api/admin-order-action.php", {
        method: "POST",
        body: JSON.stringify({ order_number: adminAction.dataset.order, action: adminAction.dataset.adminAction })
      }).then(loadAdminOrders).catch((error) => alert(error.message));
    }
    const adminLogout = event.target.closest("[data-admin-logout]");
    if (adminLogout) {
      apiJson("/api/admin-auth.php", {
        method: "POST",
        body: JSON.stringify({ action: "logout" })
      }).then(() => {
        adminAuthState = { loaded: false, loading: false, authenticated: false, setup_required: false, username: "", setup: null };
        route();
      }).catch((error) => alert(error.message));
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (form.matches("[data-admin-setup-start]")) {
      event.preventDefault();
      submitAdminSetupStart(form);
    }
    if (form.matches("[data-admin-setup-verify]")) {
      event.preventDefault();
      submitAdminSetupVerify(form);
    }
    if (form.matches("[data-admin-login]")) {
      event.preventDefault();
      submitAdminLogin(form);
    }
    if (form.matches("[data-configurator]")) {
      event.preventDefault();
      const slug = form.dataset.slug;
      const product = getProducts()[slug];
      if (!validateConfigurator(form, { showEmpty: true })) return;
      const qty = selectedConfiguratorQuantity(form, product);
      const base = priceFor(product, qty);
      const price = base;
      setCart([...getCart(), { slug, title: product.title, platform: product.platform, type: product.type, quantity: qty, profile: form.profile.value, speed: "Standard", refill: "Ohne Refill", price }]);
      location.href = "/warenkorb/";
    }
    if (form.matches("[data-checkout]")) {
      event.preventDefault();
      createBackendOrder(form);
    }
    if (form.matches("[data-contact-form]")) {
      event.preventDefault();
      submitContactForm(form);
    }
    if (form.matches("[data-admin-test-mail]")) {
      event.preventDefault();
      submitAdminTestMail(form);
    }
    if (form.matches("[data-newsletter]")) {
      event.preventDefault();
      submitNewsletterForm(form);
    }
    if (form.matches("[data-feedback-form]")) {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      apiJson("/api/feedback.php", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
      }).then((result) => {
        form.outerHTML = `<div class="notice">${result.message}</div>`;
      }).catch((error) => {
        if (status) status.textContent = error.message;
      });
    }
    if (form.matches("[data-admin-counts]")) {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.order_number = form.dataset.order;
      payload.action = "save_counts";
      apiJson("/api/admin-order-action.php", {
        method: "POST",
        body: JSON.stringify(payload)
      }).then(loadAdminOrders).catch((error) => alert(error.message));
    }
    if (form.matches("[data-generic-form]")) {
      event.preventDefault();
      form.innerHTML = `<div class="notice">Danke, deine Anfrage wurde lokal vorgemerkt. Im Livebetrieb wird dieses Formular an ein Postfach oder CRM angebunden.</div>`;
    }
    if (form.matches("[data-admin-config]")) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.couponRate = Number(data.couponRate);
      localStorage.setItem("fk24_config", JSON.stringify(data));
      route();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-order-status]")) {
      const orders = getOrders().map((o) => o.id === event.target.dataset.orderStatus ? { ...o, status: event.target.value } : o);
      setOrders(orders);
    }
    if (event.target.matches("[data-admin-status]")) {
      apiJson("/api/admin-order-action.php", {
        method: "POST",
        body: JSON.stringify({ order_number: event.target.dataset.adminStatus, action: "set_status", status: event.target.value })
      }).then(loadAdminOrders).catch((error) => alert(error.message));
    }
    if (event.target.matches("[data-service-search]")) {
      resellerServicesState.query = event.target.value;
      updateServiceMappingView();
    }
    if (event.target.matches("[data-service-sort]")) {
      resellerServicesState.sort = event.target.value;
      updateServiceMappingView();
    }
    if (event.target.closest("[data-configurator]")) updateConfigurator(event.target.closest("[data-configurator]"));
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-service-search]")) {
      resellerServicesState.query = event.target.value;
      updateServiceMappingView();
    }
    if (event.target.closest("[data-configurator]")) updateConfigurator(event.target.closest("[data-configurator]"));
  });

  document.addEventListener("click", (event) => {
    const option = event.target.closest("[data-configurator] .option");
    if (!option) return;
    const form = option.closest("[data-configurator]");
    form.querySelectorAll(".option").forEach((node) => node.classList.remove("active"));
    option.classList.add("active");
    const customRow = form.querySelector("[data-custom-row]");
    if (customRow) customRow.style.display = option.matches("[data-custom]") ? "grid" : "none";
    updateConfigurator(form);
  });
}

function setFormBusy(form, busy, text = "") {
  const button = form.querySelector("button[type='submit']");
  if (!button) return;
  if (busy) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = text || "Wird verarbeitet...";
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

async function submitAdminSetupStart(form) {
  const status = form.querySelector("[data-form-status]");
  setFormBusy(form, true, "QR-Code wird erzeugt...");
  if (status) status.textContent = "";
  try {
    const result = await apiJson("/api/admin-auth.php", {
      method: "POST",
      body: JSON.stringify({ action: "setup_start", username: form.username.value.trim(), password: form.password.value })
    });
    adminAuthState = { ...adminAuthState, loaded: true, loading: false, setup_required: true, authenticated: false, setup: { secret: result.secret, otpauth_uri: result.otpauth_uri } };
    route();
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    setFormBusy(form, false);
  }
}

async function submitAdminSetupVerify(form) {
  const status = form.querySelector("[data-form-status]");
  setFormBusy(form, true, "Wird geprüft...");
  if (status) status.textContent = "";
  try {
    await apiJson("/api/admin-auth.php", {
      method: "POST",
      body: JSON.stringify({ action: "setup_verify", code: form.code.value.trim() })
    });
    adminAuthState = { loaded: false, loading: false, authenticated: false, setup_required: false, username: "", setup: null };
    await loadAdminAuth(true);
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    setFormBusy(form, false);
  }
}

async function submitAdminLogin(form) {
  const status = form.querySelector("[data-form-status]");
  setFormBusy(form, true, "Login läuft...");
  if (status) status.textContent = "";
  try {
    await apiJson("/api/admin-auth.php", {
      method: "POST",
      body: JSON.stringify({ action: "login", username: form.username.value.trim(), password: form.password.value, code: form.code.value.trim() })
    });
    adminAuthState = { loaded: false, loading: false, authenticated: false, setup_required: false, username: "", setup: null };
    await loadAdminAuth(true);
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    setFormBusy(form, false);
  }
}

async function submitNewsletterForm(form) {
  const status = form.querySelector("[data-form-status]");
  setFormBusy(form, true, "Wird gespeichert...");
  if (status) {
    status.classList.remove("success");
    status.textContent = "";
  }
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const result = await apiJson("/api/newsletter.php", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (status) {
      status.classList.add("success");
      status.textContent = result.message || "Danke, deine Anmeldung wurde gespeichert.";
    }
    form.reset();
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally {
    setFormBusy(form, false);
  }
}

async function submitAdminTestMail(form) {
  const button = form.querySelector("button[type='submit']");
  const status = form.querySelector("[data-form-status]");
  const email = form.email.value.trim();
  const originalText = button?.textContent || "Senden";

  if (button) {
    button.disabled = true;
    button.textContent = "Wird gesendet...";
  }
  if (status) status.textContent = "";

  try {
    const result = await apiJson("/api/admin-test-mail.php", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    if (status) {
      status.textContent = result.message || "Testmail wurde gesendet.";
      status.classList.add("success");
    }
  } catch (error) {
    if (status) {
      status.textContent = error.message;
      status.classList.remove("success");
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

async function submitContactForm(form) {
  const button = form.querySelector("button[type='submit']");
  const status = form.querySelector("[data-form-status]");
  const originalText = button?.textContent || "Senden";
  if (button) {
    button.disabled = true;
    button.textContent = "Wird gesendet...";
  }
  if (status) status.textContent = "";

  try {
    const response = await fetch("/api/contact.php", {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || "Die Nachricht konnte nicht gesendet werden.");
    form.innerHTML = `<div class="notice">Danke, deine Anfrage wurde gesendet. Du erhältst gleich eine Bestätigung per E-Mail.</div>`;
  } catch (error) {
    if (status) status.textContent = `${error.message} Bitte versuche es später erneut oder schreibe direkt an nevio@oivengames.com.`;
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

function priceFor(product, qty) {
  const exact = product.quantities.find((q) => q[0] === qty);
  if (exact) return exact[1];
  const sorted = [...product.quantities].sort((a, b) => a[0] - b[0]);
  const nearest = sorted.reduce((best, row) => Math.abs(row[0] - qty) < Math.abs(best[0] - qty) ? row : best, sorted[0]);
  return Math.max(productMinPrice(product), (nearest[1] / nearest[0]) * qty);
}

function validateConfigurator(form, { showEmpty = false } = {}) {
  const product = getProducts()[form.dataset.slug];
  if (!product) return false;
  const active = form.querySelector(".option.active");
  const isCustom = active?.matches("[data-custom]");
  const qty = selectedConfiguratorQuantity(form, product);
  const max = productMaxQuantity(form.dataset.slug, product);
  const status = form.querySelector("[data-config-status]");
  const submit = form.querySelector("button[type='submit']");
  const customInput = form.querySelector("[data-custom-qty]");
  let message = productAvailabilityMessage(form.dataset.slug);

  if (!message && isCustom && (!qty || qty < 1)) {
    message = showEmpty ? "Bitte gib eine eigene Menge ein." : "";
  } else if (!message && qty > max) {
    message = `Diese Menge ist aktuell zu hoch. Maximal möglich sind ${amountLabel(max)}.`;
  }

  if (customInput) {
    customInput.max = String(max);
    customInput.setCustomValidity(message);
  }
  if (status) status.textContent = message;
  if (submit) submit.disabled = Boolean(message);
  return !message;
}

function updateConfigurator(form) {
  const product = getProducts()[form.dataset.slug];
  const qty = selectedConfiguratorQuantity(form, product) || product.quantities[0][0];
  form.querySelector("[data-total]").textContent = eur(priceFor(product, qty));
  const limitHint = form.querySelector("[data-limit-hint]");
  if (limitHint) limitHint.textContent = productLimitHint(form.dataset.slug, product);
  validateConfigurator(form);
}

let phoneBoostTimer = 0;

function compactNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(".0", "")}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(".0", "")}k`;
  return String(Math.round(value));
}

function animatePhoneBoost() {
  clearTimeout(phoneBoostTimer);
  const counters = [...document.querySelectorAll("[data-boost-counter]")];
  const metrics = [...document.querySelectorAll("[data-boost-metric]")];
  const label = document.querySelector("[data-boost-label]");
  if (!counters.length) return;

  const labels = ["Follower Boost läuft", "Likes steigen", "Views ziehen an"];
  const runMetric = (index = 0) => {
    counters.forEach((counter, counterIndex) => {
      const value = counterIndex < index ? counter.dataset.target : counter.dataset.start;
      counter.textContent = compactNumber(Number(value));
    });
    metrics.forEach((metric) => metric.classList.remove("active", "done"));
    const metric = metrics[index];
    const counter = counters[index];
    if (!metric || !counter) {
      phoneBoostTimer = setTimeout(() => runMetric(0), 900);
      return;
    }

    metric.classList.add("active");
    if (label) label.textContent = labels[index] || labels[0];

    const start = Number(counter.dataset.start);
    const target = Number(counter.dataset.target);
    const duration = 1450;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = compactNumber(start + (target - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        metric.classList.remove("active");
        metric.classList.add("done");
        phoneBoostTimer = setTimeout(() => runMetric((index + 1) % counters.length), 650);
      }
    };

    requestAnimationFrame(tick);
  };

  runMetric(0);
}

function route() {
  layout();
  const app = document.getElementById("app");
  const page = document.body.dataset.page || "home";
  const product = document.body.dataset.product;
  const platform = document.body.dataset.platform;
  const legal = document.body.dataset.legal;
  if (product) app.innerHTML = renderProduct(product);
  else if (page === "home") app.innerHTML = home();
  else if (page === "cart") app.innerHTML = cartPage();
  else if (page === "checkout") app.innerHTML = checkoutPage();
  else if (page === "faq") app.innerHTML = faqPage();
  else if (page === "contact") app.innerHTML = contactPage();
  else if (page === "refill") app.innerHTML = contactPage("refill");
  else if (page === "category") app.innerHTML = categoryPage(platform);
  else if (page === "admin") app.innerHTML = adminPage();
  else if (page === "order-success") app.innerHTML = orderSuccessPage();
  else if (page === "legal") app.innerHTML = legalPage(legal || "Rechtliche Hinweise");
  reveal();
  document.querySelectorAll("[data-configurator]").forEach(updateConfigurator);
  animatePhoneBoost();
  if (page === "admin") renderAdminQrCode();
  if (page === "admin") {
    if (!adminAuthState.loaded && !adminAuthState.loading) {
      loadAdminAuth();
    }
    if (adminAuthState.authenticated) {
      loadAdminOrders();
      loadServiceMapping();
      loadResellerHealth(true);
      clearInterval(resellerHealthTimer);
      resellerHealthTimer = setInterval(() => loadResellerHealth(true), 60000);
    } else {
      clearInterval(resellerHealthTimer);
    }
  } else {
    clearInterval(resellerHealthTimer);
  }
  if (page === "order-success") {
    loadOrderStatus();
    startOrderStatusPolling();
  } else {
    clearInterval(orderStatusTimer);
  }
}

function reveal() {
  const nodes = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: .08 });
  nodes.forEach((node) => io.observe(node));
}

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await loadProductLimits();
  route();
});
