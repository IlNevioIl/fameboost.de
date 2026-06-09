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

const seoKeywordGroups = [
  {
    title: "Instagram Keywords",
    url: "/instagram-follower-kaufen/",
    terms: [
      "Instagram Follower kaufen", "Instagram Follower kaufen deutsch", "Instagram Follower Deutschland kaufen", "deutsche Instagram Follower kaufen", "Instagram Follower kaufen ohne Passwort", "Instagram Follower sicher kaufen", "Instagram Follower schnell kaufen", "Instagram Follower günstig kaufen", "Instagram Follower Paket", "Instagram Follower Shop", "Instagram Follower bestellen", "Instagram Wachstum kaufen", "Instagram Reichweite kaufen", "Instagram Profil pushen", "Instagram Social Proof", "mehr Instagram Follower bekommen", "Instagram Likes kaufen", "Instagram Likes kaufen deutsch", "Instagram Likes ohne Passwort", "Instagram Likes schnell kaufen", "Instagram Likes günstig kaufen", "Instagram Likes bestellen", "Instagram Beitragslikes kaufen", "Instagram Post Likes kaufen", "Instagram Reels Likes kaufen", "Instagram Views kaufen", "Instagram Reels Views kaufen", "Instagram Story Views kaufen", "Instagram Video Views kaufen", "Instagram Kommentare kaufen", "Instagram Saves kaufen", "Instagram Impressionen kaufen", "Instagram Engagement kaufen", "buy Instagram followers", "buy Instagram followers Germany", "buy German Instagram followers", "buy Instagram followers no password", "buy Instagram followers fast", "buy Instagram followers cheap", "buy Instagram likes", "buy Instagram likes Germany", "buy Instagram likes no password", "buy Instagram views", "buy Instagram reel views", "buy Instagram story views", "Instagram growth service", "Instagram social proof package"
    ]
  },
  {
    title: "TikTok Keywords",
    url: "/tiktok-follower-kaufen/",
    terms: [
      "TikTok Follower kaufen", "TikTok Follower kaufen deutsch", "TikTok Follower Deutschland kaufen", "deutsche TikTok Follower kaufen", "TikTok Follower ohne Passwort", "TikTok Follower schnell kaufen", "TikTok Follower günstig kaufen", "TikTok Follower bestellen", "TikTok Follower Paket", "TikTok Wachstum kaufen", "TikTok Reichweite kaufen", "TikTok Profil pushen", "TikTok Social Proof", "TikTok Likes kaufen", "TikTok Likes kaufen deutsch", "TikTok Likes schnell kaufen", "TikTok Likes ohne Passwort", "TikTok Video Likes kaufen", "TikTok Views kaufen", "TikTok Views kaufen deutsch", "TikTok Views schnell kaufen", "TikTok Video Views kaufen", "TikTok Aufrufe kaufen", "TikTok Kommentare kaufen", "TikTok Shares kaufen", "TikTok Saves kaufen", "TikTok Live Zuschauer kaufen", "TikTok Engagement kaufen", "TikTok Algorithmus push", "mehr TikTok Follower", "buy TikTok followers", "buy TikTok followers Germany", "buy German TikTok followers", "buy TikTok followers no password", "buy TikTok followers fast", "buy TikTok followers cheap", "buy TikTok likes", "buy TikTok views", "buy TikTok video views", "buy TikTok shares", "buy TikTok comments", "TikTok growth service", "TikTok engagement package"
    ]
  },
  {
    title: "YouTube Keywords",
    url: "/youtube-abonnenten-kaufen/",
    terms: [
      "YouTube Abonnenten kaufen", "YouTube Abos kaufen", "YouTube Abonnenten kaufen deutsch", "deutsche YouTube Abonnenten kaufen", "YouTube Abonnenten ohne Passwort", "YouTube Abonnenten schnell kaufen", "YouTube Abonnenten günstig kaufen", "YouTube Abonnenten bestellen", "YouTube Kanal pushen", "YouTube Kanal Wachstum", "YouTube Social Proof", "YouTube Views kaufen", "YouTube Views kaufen deutsch", "YouTube Aufrufe kaufen", "YouTube Video Views kaufen", "YouTube Shorts Views kaufen", "YouTube Views schnell kaufen", "YouTube Views günstig kaufen", "YouTube Likes kaufen", "YouTube Kommentare kaufen", "YouTube Watchtime kaufen", "YouTube Wiedergabezeit kaufen", "YouTube Reichweite kaufen", "YouTube Monetarisierung Start", "mehr YouTube Abonnenten", "buy YouTube subscribers", "buy YouTube subscribers Germany", "buy German YouTube subscribers", "buy YouTube subscribers no password", "buy YouTube subscribers fast", "buy YouTube views", "buy YouTube views Germany", "buy YouTube video views", "buy YouTube Shorts views", "buy YouTube likes", "buy YouTube comments", "buy YouTube watch time", "YouTube growth service", "YouTube channel growth"
    ]
  },
  {
    title: "Twitch Keywords",
    url: "/twitch-follower-kaufen/",
    terms: [
      "Twitch Follower kaufen", "Twitch Follower kaufen deutsch", "deutsche Twitch Follower kaufen", "Twitch Follower ohne Passwort", "Twitch Follower schnell kaufen", "Twitch Follower günstig kaufen", "Twitch Follower bestellen", "Twitch Kanal pushen", "Twitch Stream pushen", "Twitch Wachstum kaufen", "Twitch Social Proof", "Twitch Zuschauer kaufen", "Twitch Live Zuschauer kaufen", "Twitch Viewer kaufen", "Twitch Views kaufen", "Twitch Video Views kaufen", "Twitch Clips Views kaufen", "Twitch Engagement kaufen", "mehr Twitch Follower", "buy Twitch followers", "buy Twitch followers Germany", "buy Twitch followers no password", "buy Twitch followers fast", "buy Twitch viewers", "buy Twitch live viewers", "buy Twitch views", "Twitch growth service", "Twitch streamer growth", "Twitch social proof"
    ]
  },
  {
    title: "Facebook Keywords",
    url: "/facebook-likes-kaufen/",
    terms: [
      "Facebook Likes kaufen", "Facebook Likes kaufen deutsch", "Facebook Seitenlikes kaufen", "Facebook Page Likes kaufen", "Facebook Follower kaufen", "Facebook Beitragslikes kaufen", "Facebook Post Likes kaufen", "Facebook Kommentare kaufen", "Facebook Reichweite kaufen", "Facebook Seite pushen", "Facebook Business Seite Likes", "Facebook Social Proof", "Facebook Engagement kaufen", "Facebook Likes ohne Passwort", "Facebook Likes schnell kaufen", "Facebook Likes günstig kaufen", "buy Facebook likes", "buy Facebook page likes", "buy Facebook followers", "buy Facebook post likes", "buy Facebook comments", "buy Facebook engagement", "Facebook growth service", "Facebook social proof"
    ]
  },
  {
    title: "Allgemeine Suchanfragen",
    url: "/#produkte",
    terms: [
      "Follower kaufen", "Follower kaufen deutsch", "Follower kaufen Deutschland", "Follower kaufen ohne Passwort", "Follower kaufen sicher", "Follower kaufen günstig", "Follower kaufen schnell", "Follower bestellen", "Follower Shop", "Social Media Follower kaufen", "Social Media Wachstum kaufen", "Social Media Pakete kaufen", "Social Media Boost kaufen", "Social Media Reichweite kaufen", "Social Proof kaufen", "Likes kaufen", "Likes kaufen deutsch", "Likes kaufen ohne Passwort", "Views kaufen", "Views kaufen deutsch", "Aufrufe kaufen", "Kommentare kaufen", "Engagement kaufen", "Profil pushen", "Creator Wachstum", "Influencer Wachstum", "mehr Sichtbarkeit Social Media", "SMM Shop Deutschland", "Social Growth Shop", "Follower Paket kaufen", "Refill Follower kaufen", "Follower mit Refill", "buy followers", "buy followers Germany", "buy followers no password", "buy followers fast", "buy followers cheap", "buy social media followers", "buy social media likes", "buy social media views", "buy engagement", "buy social proof", "social media growth service", "social media boost", "creator growth service", "influencer growth package", "SMM services Germany"
    ]
  }
];

function keywordTarget(term) {
  const lower = term.toLowerCase();
  if (lower.includes("instagram likes") || lower.includes("instagram beitrag") || lower.includes("instagram post") || lower.includes("reels likes")) return "/instagram-likes-kaufen/";
  if (lower.includes("instagram views") || lower.includes("reels views") || lower.includes("story views") || lower.includes("video views")) return "/instagram-views-kaufen/";
  if (lower.includes("instagram")) return "/instagram-follower-kaufen/";
  if (lower.includes("tiktok likes")) return "/tiktok-likes-kaufen/";
  if (lower.includes("tiktok views") || lower.includes("tiktok aufrufe") || lower.includes("video views")) return "/tiktok-views-kaufen/";
  if (lower.includes("tiktok")) return "/tiktok-follower-kaufen/";
  if (lower.includes("youtube views") || lower.includes("youtube aufrufe") || lower.includes("shorts")) return "/youtube-views-kaufen/";
  if (lower.includes("youtube")) return "/youtube-abonnenten-kaufen/";
  if (lower.includes("twitch")) return "/twitch-follower-kaufen/";
  if (lower.includes("facebook")) return "/facebook-likes-kaufen/";
  return "/#produkte";
}

function keywordChips(terms, limit = 200) {
  return terms.slice(0, limit).map((term) => `<a class="seo-chip" href="${keywordTarget(term)}">${term}</a>`).join("");
}

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
          <input class="input" type="email" required placeholder="deine@email.de">
          <button class="btn btn-primary" type="submit">Rabatt sichern</button>
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
        <div><h3>Service</h3><ul><li><a href="/faq/">FAQ</a></li><li><a href="/kontakt/">Kontakt</a></li><li><a href="/suchbegriffe/">Suchbegriffe</a></li><li><a href="/zahlungsarten/">Zahlungsarten</a></li><li><a href="/lieferbedingungen/">Lieferbedingungen</a></li><li><a href="/refill-anfrage/">Refill-Anfrage</a></li></ul></div>
        <div><h3>Rechtliches</h3><ul><li><a href="/impressum/">Impressum</a></li><li><a href="/datenschutz/">Datenschutz</a></li><li><a href="/agb/">AGB</a></li><li><a href="/widerrufsbelehrung/">Widerrufsbelehrung</a></li></ul></div>
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
    <section class="section" id="bewertungen"><div class="container">
      <div class="content-block reveal">
        <h2>Kundenfeedback</h2>
        <p class="muted">Kundenbewertungen werden hier angezeigt, sobald verifizierte Bewertungen vorliegen. Es werden keine Platzhalterstimmen als echte Bewertungen ausgegeben.</p>
      </div>
    </div></section>
    <section class="section"><div class="container grid cards-3">
      ${infoCard("Mehr Sichtbarkeit für dein Profil", "Ein professioneller erster Eindruck kann entscheiden, ob neue Besucher deinem Profil vertrauen, deine Inhalte anschauen oder weiterklicken. Mit FameBoost.de kannst du gezielt Pakete auswählen, die zu deinem Profil und deiner Plattform passen.")}
      ${infoCard("Einfacher Ablauf", "Du brauchst keine technischen Kenntnisse. Wähle die Plattform, entscheide dich für eine Menge und gib deinen Profilnamen oder Link ein. Danach kannst du deine Bestellung sicher bezahlen.")}
      ${infoCard("Für Creator, Unternehmen und Marken", "Ob neues Projekt, lokales Unternehmen, Musiker, Creator oder Shop: Social-Media-Profile wirken stärker, wenn sie aktiv und professionell aufgebaut sind.")}
    </div></section>
    ${seoKeywordHub()}`;
}

function seoKeywordHub() {
  return `<section class="section seo-keyword-section"><div class="container">
    <div class="section-head reveal"><h2>Suchbegriffe für Social-Media-Pakete</h2><p>Deutsch- und englischsprachige Suchanfragen, über die Nutzer passende Social-Media-Wachstumspakete finden. Die Tags führen direkt zu den relevanten Plattform- und Produktseiten.</p></div>
    <div class="seo-keyword-grid">
      ${seoKeywordGroups.map((group) => `<article class="seo-keyword-card reveal"><h3>${group.title}</h3><div class="seo-chip-cloud">${keywordChips(group.terms)}</div><a class="seo-card-link" href="${group.url}">Passende Pakete ansehen</a></article>`).join("")}
    </div>
  </div></section>`;
}

function keywordPage() {
  return `<section class="product-hero"><div class="container"><h1>Social-Media-Suchbegriffe</h1><p class="lead">Deutsch- und englischsprachige Keyword-Cluster für Instagram, TikTok, YouTube, Twitch, Facebook und allgemeine Social-Growth-Pakete.</p></div></section>${seoKeywordHub()}`;
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
            <div class="avatar"></div>
            <div class="profile-copy"><strong>fameboost.de</strong><span>Social Growth Dashboard</span></div>
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
        ${productKeywordBlock(product)}
        ${contentBlock(`${product.keyword}: Ratgeber und Hinweise`, seoText(product))}
      </div>
      <aside>${relatedProducts(slug)}</aside>
    </div></section>`;
}

function productKeywordBlock(product) {
  const group = seoKeywordGroups.find((item) => item.title.startsWith(product.platform)) || seoKeywordGroups.at(-1);
  const platformTerms = group.terms.filter((term) => term.toLowerCase().includes(product.platform.toLowerCase())).slice(0, 36);
  const productTerms = platformTerms.filter((term) => term.toLowerCase().includes(product.type.toLowerCase().slice(0, 5)));
  const terms = [...new Set([product.keyword, product.title, ...productTerms, ...platformTerms])].slice(0, 42);
  return `<section class="content-block seo-product-keywords reveal"><h2>Ähnliche Suchbegriffe</h2><p>Diese Begriffe helfen bei der Orientierung, wenn du nach passenden ${product.platform}-Paketen suchst.</p><div class="seo-chip-cloud">${keywordChips(terms, 42)}</div></section>`;
}

function quickProductInfo(number, title, text) {
  return `<article class="quick-info-card reveal"><span>${number}</span><h3>${title}</h3><p>${text}</p></article>`;
}

function configurator(slug, product) {
  const first = product.quantities[0];
  return `<form class="configurator product-buy-box reveal" style="${platformStyle(product.platform)}" data-configurator data-slug="${slug}">
    <div class="config-head">${platformLogo(product.platform)}<div><span>Direkt bestellen</span><h2>Paket konfigurieren</h2></div></div>
    <div class="field"><label>Wähle deine ${product.type}</label><div class="option-grid" data-qty-options>${product.quantities.map((q, i) => `<button class="option ${i === 0 ? "active" : ""}" type="button" data-qty="${q[0]}"><strong>${amountLabel(q[0])}</strong><small>${eur(q[1])}</small></button>`).join("")}<button class="option" type="button" data-custom><strong>Eigene</strong><small>Menge</small></button></div></div>
    <div class="field" data-custom-row style="display:none"><label>Eigene Menge</label><input class="input" type="number" min="50" step="50" data-custom-qty placeholder="z. B. 1500"></div>
    <div class="field"><label>Wie lautet dein Profilname oder Link?</label><input class="input" required name="profile" placeholder="z. B. @deinprofil oder Profil-Link"><small>Bitte stelle sicher, dass dein Profil öffentlich erreichbar ist, damit die Bestellung korrekt verarbeitet werden kann.</small></div>
    <div class="field"><label>Liefergeschwindigkeit</label><select class="select" name="speed"><option value="Standard" data-price="0">Standard</option><option value="Schnellere Bearbeitung" data-price="3.99">Schnellere Bearbeitung (+3,99 €)</option><option value="Individuelle Geschwindigkeit" data-price="3.99">Individuelle Geschwindigkeit (+3,99 €)</option></select></div>
    <div class="field"><label>Refill-Option</label><select class="select" name="refill"><option value="Ohne Refill" data-price="0">Ohne Refill</option><option value="30 Tage Refill-Schutz" data-price="4.99">30 Tage Refill-Schutz (+4,99 €)</option><option value="60 Tage Refill-Schutz" data-price="7.99">60 Tage Refill-Schutz (+7,99 €)</option></select><small>Mit Refill-Schutz kannst du bei ausgewählten Paketen eine Nachfüllung beantragen, falls innerhalb des Schutzzeitraums ein Teil der gelieferten Menge sinkt.</small></div>
    <div class="price-box"><span>Gesamtpreis</span><strong data-total>${eur(first[1])}</strong></div>
    <button class="btn btn-primary" style="width:100%" type="submit">In den Warenkorb</button>
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
  return `<section class="section"><div class="container split"><div class="content-block reveal"><h1 style="color:var(--ink);font-size:48px">Warenkorb</h1><div>${cart.map((item, i) => cartItem(item, i)).join("")}</div></div>${summaryBox("/kasse/", "Zur Kasse")}</div></section><section class="section"><div class="container"><div class="section-head"><h2>Noch mehr Sichtbarkeit?</h2></div><div class="grid cards-4">${["instagram-likes-kaufen","tiktok-views-kaufen","instagram-views-kaufen","youtube-views-kaufen"].map((slug) => productCard(slug, getProducts()[slug])).join("")}</div></div></section>`;
}

function cartItem(item, index) {
  return `<div class="cart-item"><div><h3>${item.title}</h3><div class="line-meta"><span>${item.platform}</span><span>${amountLabel(item.quantity)} ${item.type}</span><span>${item.profile}</span><span>${item.speed}</span><span>${item.refill}</span></div></div><div style="text-align:right"><strong>${eur(item.price)}</strong><br><button class="remove" data-remove="${index}">Entfernen</button></div></div>`;
}

function summaryBox(target, label) {
  const config = getConfig();
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const hasCoupon = localStorage.getItem("fk24_coupon") === config.couponCode;
  const discount = hasCoupon ? subtotal * config.couponRate : 0;
  const total = subtotal - discount;
  return `<aside class="checkout-box reveal"><h2 style="font-size:28px">Bestellübersicht</h2><div class="summary-row"><span>Zwischensumme</span><strong>${eur(subtotal)}</strong></div><div class="summary-row"><span>Coupon</span><strong>${discount ? `-${eur(discount)}` : "Noch keiner"}</strong></div><div class="summary-row total"><span>Gesamtpreis</span><strong>${eur(total)}</strong></div><div class="field"><label>Rabattcode eingeben</label><input class="input" data-coupon-input placeholder="${config.couponCode}"><button class="btn btn-light" data-apply-coupon>Code anwenden</button></div><a class="btn btn-primary" style="width:100%" href="${target}">${label}</a></aside>`;
}

function checkoutPage() {
  const cart = getCart();
  if (!cart.length) return cartPage();
  return `<section class="section"><div class="container"><div class="section-head reveal"><h1 style="color:var(--ink);font-size:48px">Sichere Kasse</h1><p>Deine Bestellung wird verschlüsselt übertragen. Nach erfolgreicher Zahlung erhältst du eine Bestellbestätigung per E-Mail.</p></div><div class="split"><form class="content-block reveal" data-checkout><div class="form-grid"><div class="field"><label>Vorname</label><input class="input" name="firstName" required></div><div class="field"><label>Nachname</label><input class="input" name="lastName" required></div><div class="field full"><label>E-Mail-Adresse</label><input class="input" type="email" name="email" required></div><div class="field full"><label>Rechnungsadresse</label><input class="input" name="address" required></div><div class="field full"><label>Zahlungsart</label><select class="select" name="payment"><option>PayPal</option><option>Kreditkarte</option><option>Apple Pay</option><option>Google Pay</option><option>Klarna</option><option>Sofort</option></select><small>Demo-Checkout: Live-Zahlungen werden über Stripe, PayPal oder Klarna serverseitig angeschlossen.</small></div><label class="field full"><span><input type="checkbox" required> Ich akzeptiere die AGB.</span></label><label class="field full"><span><input type="checkbox" required> Ich habe die Datenschutzhinweise gelesen.</span></label></div><button class="btn btn-primary" type="submit" style="width:100%">Jetzt zahlungspflichtig bestellen</button></form><aside>${summaryBox("#", "Bestellung prüfen")}<div class="checkout-box reveal" style="margin-top:18px"><h3>Trust-Box</h3><ul><li>Sichere SSL-Verschlüsselung</li><li>Kein Passwort erforderlich</li><li>Einmalzahlung ohne Abo</li><li>Support bei Fragen</li><li>Schnelle Bearbeitung</li></ul></div></aside></div></div></section>`;
}

function faqPage() {
  return `<section class="product-hero"><div class="container"><h1>FAQ</h1><p class="lead">Antworten auf die wichtigsten Fragen zu Bestellung, Zahlung, Profilangaben, Refill und Bearbeitung.</p></div></section><section class="section"><div class="container">${faqBlock("Häufige Fragen", mainFaq)}</div></section>`;
}

function contactPage(kind = "contact") {
  const refill = kind === "refill";
  return `<section class="product-hero"><div class="container"><h1>${refill ? "Refill anfragen" : "Kontakt zu FameBoost.de"}</h1><p class="lead">${refill ? "Wenn du ein Paket mit Refill-Option gekauft hast und innerhalb des Schutzzeitraums ein Teil der Menge gesunken ist, kannst du hier eine Prüfung anfragen." : "Du hast eine Frage zu deiner Bestellung oder möchtest wissen, welches Paket am besten passt? Schreibe uns über das Kontaktformular."}</p></div></section><section class="section"><div class="container split"><form class="content-block reveal" data-generic-form><div class="form-grid"><div class="field"><label>Name</label><input class="input" required></div><div class="field"><label>E-Mail</label><input class="input" type="email" required></div><div class="field"><label>Bestellnummer ${refill ? "" : "optional"}</label><input class="input" ${refill ? "required" : ""}></div><div class="field"><label>${refill ? "Produkt" : "Thema"}</label>${refill ? `<input class="input" required>` : `<select class="select"><option>Frage vor dem Kauf</option><option>Frage zu einer Bestellung</option><option>Zahlungsproblem</option><option>Refill-Anfrage</option><option>Sonstiges</option></select>`}</div>${refill ? `<div class="field full"><label>Profilname/Link</label><input class="input" required></div>` : ""}<div class="field full"><label>Nachricht</label><textarea required></textarea></div>${refill ? `<div class="field full"><label>Screenshot Upload optional</label><input class="input" type="file"></div>` : ""}</div><button class="btn btn-primary" type="submit">${refill ? "Refill prüfen lassen" : "Nachricht senden"}</button></form><div class="checkout-box reveal"><h2>Support-Hinweis</h2><p class="muted">Bitte gib bei Fragen zu einer Bestellung immer deine Bestellnummer und den verwendeten Profilnamen an.</p></div></div></section>`;
}

function categoryPage(platform) {
  const products = getProducts();
  const entries = Object.entries(products).filter(([, p]) => p.platform.toLowerCase() === platform.toLowerCase());
  return `<section class="product-hero"><div class="container"><h1>${platform} Pakete</h1><p class="lead">Wähle ein ${platform}-Produkt, konfiguriere die Menge und lege dein Paket direkt in den Warenkorb.</p></div></section><section class="section"><div class="container"><div class="grid cards-3">${entries.map(([slug, product]) => productCard(slug, product)).join("")}</div></div></section>${categoryOverview(platform)}`;
}

function agbPage() {
  return `<section class="product-hero"><div class="container"><h1>Allgemeine Geschäftsbedingungen</h1><p class="lead">AGB-Entwurf für FameBoost.de. Die finale Live-Version muss rechtlich geprüft und mit den vollständigen Betreiberangaben ergänzt werden.</p></div></section>
  <section class="section"><div class="container"><article class="content-block legal-doc reveal">
    <div class="notice">Wichtig: Diese AGB sind ein eigenständiger Entwurf für die Website-Struktur. Vor Veröffentlichung müssen sie durch einen Anwalt oder einen spezialisierten Rechtstext-Anbieter geprüft und an Betreiber, Zahlungsanbieter, Widerrufsprozess, Steuerangaben und reale Lieferbedingungen angepasst werden.</div>
    <p><strong>Stand:</strong> [Datum einsetzen]</p>
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
  const trademarkNotice = title === "Impressum" ? `<div class="notice trademark-notice"><strong>Marken- und Logohinweis:</strong> Instagram, TikTok, YouTube, Twitch, Facebook sowie die dazugehörigen Logos und Markenkennzeichen sind Marken beziehungsweise geschützte Kennzeichen der jeweiligen Rechteinhaber. Die Darstellung auf fameboost.de dient ausschließlich der eindeutigen Plattform-Zuordnung im Shop. FameBoost.de steht in keiner Verbindung zu Meta, ByteDance, Google, Twitch oder anderen Plattformbetreibern und ist kein offizieller Partner dieser Unternehmen.</div>` : "";
  return `<section class="product-hero"><div class="container"><h1>${title}</h1><p class="lead">Platzhalterseite für die rechtliche Live-Version von fameboost.de.</p></div></section><section class="section"><div class="container"><div class="content-block reveal"><div class="notice">Wichtig: Die finalen Rechtstexte müssen von einem Anwalt oder einem spezialisierten Generator wie Händlerbund, eRecht24, IT-Recht Kanzlei oder Trusted Shops erstellt und geprüft werden.</div>${trademarkNotice}<h2 style="margin-top:24px">${title}</h2><p>Dieser Bereich ist als struktureller Platzhalter vorbereitet. Vor dem Livegang müssen Anbieterinformationen, gesetzliche Pflichtangaben, Widerrufsregeln, Zahlungsbedingungen, Lieferbedingungen, Datenschutzprozesse und Cookie-Hinweise vollständig ergänzt und geprüft werden.</p><p>Es werden keine unbelegten Garantien, keine fremden Bewertungen und keine Aussagen zu offiziellen Plattformpartnerschaften verwendet.</p></div></div></section>`;
}

function adminPage() {
  const products = getProducts();
  const config = getConfig();
  const orders = getOrders();
  return `<section class="product-hero"><div class="container"><h1>Admin</h1><p class="lead">Lokale Verwaltungsoberfläche für Produkte, Preise, Coupon, Banner und Bestellungen. Für den Livebetrieb sollte diese Ebene in WordPress/WooCommerce oder ein abgesichertes Backend übertragen werden.</p></div></section><section class="section"><div class="container"><div class="content-block reveal"><h2>Shop-Einstellungen</h2><form data-admin-config class="form-grid"><div class="field"><label>Banner-Text</label><input class="input" name="bannerText" value="${config.bannerText}"></div><div class="field"><label>Coupon-Code</label><input class="input" name="couponCode" value="${config.couponCode}"></div><div class="field"><label>Coupon-Rabatt</label><input class="input" name="couponRate" type="number" step="0.01" value="${config.couponRate}"></div><div class="field"><label>Countdown/Label</label><input class="input" name="countdownLabel" value="${config.countdownLabel}"></div><div class="full"><button class="btn btn-primary">Einstellungen speichern</button></div></form></div><div class="content-block reveal"><h2>Produkte und Mengenstaffeln</h2><div style="overflow:auto"><table class="admin-table"><thead><tr><th>Produkt</th><th>Staffeln</th></tr></thead><tbody>${Object.entries(products).map(([slug, p]) => `<tr><td><strong>${p.title}</strong><br><span class="muted">${slug}</span></td><td>${p.quantities.map((q, i) => `<label>${amountLabel(q[0])}: <input data-admin-price data-slug="${slug}" data-index="${i}" type="number" step="0.01" value="${q[1]}"></label>`).join(" ")}</td></tr>`).join("")}</tbody></table></div><button class="btn btn-primary" data-save-prices style="margin-top:18px">Preise speichern</button></div><div class="content-block reveal"><h2>Bestellungen</h2>${orders.length ? `<table class="admin-table"><thead><tr><th>Nr.</th><th>Kunde</th><th>Produkt</th><th>Status</th></tr></thead><tbody>${orders.map((o) => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.items.map((i) => i.title).join(", ")}</td><td><select class="select" data-order-status="${o.id}">${["Offen","Bezahlt","In Bearbeitung","Teilweise abgeschlossen","Abgeschlossen","Refill angefragt","Storniert","Rückerstattet"].map((s) => `<option ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>` : `<p class="muted">Noch keine Demo-Bestellungen vorhanden.</p>`}</div></div></section>`;
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
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      const cart = getCart();
      cart.splice(Number(remove.dataset.remove), 1);
      setCart(cart);
      route();
    }
    const apply = event.target.closest("[data-apply-coupon]");
    if (apply) {
      const input = document.querySelector("[data-coupon-input]");
      if (input?.value.trim().toUpperCase() === getConfig().couponCode.toUpperCase()) localStorage.setItem("fk24_coupon", getConfig().couponCode);
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
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (form.matches("[data-configurator]")) {
      event.preventDefault();
      const slug = form.dataset.slug;
      const product = getProducts()[slug];
      const active = form.querySelector(".option.active");
      const qty = Number(active?.dataset.qty || form.querySelector("[data-custom-qty]").value || product.quantities[0][0]);
      const base = priceFor(product, qty);
      const speed = form.speed;
      const refill = form.refill;
      const price = base + Number(speed.selectedOptions[0].dataset.price) + Number(refill.selectedOptions[0].dataset.price);
      setCart([...getCart(), { slug, title: product.title, platform: product.platform, type: product.type, quantity: qty, profile: form.profile.value, speed: speed.value, refill: refill.value, price }]);
      location.href = "/warenkorb/";
    }
    if (form.matches("[data-checkout]")) {
      event.preventDefault();
      const data = new FormData(form);
      const order = { id: `FK24-${Date.now().toString().slice(-8)}`, customer: `${data.get("firstName")} ${data.get("lastName")}`, email: data.get("email"), status: "Offen", items: getCart(), createdAt: new Date().toISOString() };
      setOrders([order, ...getOrders()]);
      setCart([]);
      document.getElementById("app").innerHTML = `<section class="section"><div class="container"><div class="content-block reveal in"><h1 style="color:var(--ink);font-size:46px">Bestellung eingegangen</h1><p>Vielen Dank. Deine Demo-Bestellung ${order.id} wurde gespeichert. Die E-Mail-Bestätigung ist als Vorlage in der Seite vorbereitet und kann im Livebetrieb serverseitig versendet werden.</p><a class="btn btn-primary" href="/admin/">Bestellung im Admin ansehen</a></div></div></section>`;
    }
    if (form.matches("[data-generic-form], [data-newsletter]")) {
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
    if (event.target.closest("[data-configurator]")) updateConfigurator(event.target.closest("[data-configurator]"));
  });

  document.addEventListener("click", (event) => {
    const option = event.target.closest("[data-configurator] .option");
    if (!option) return;
    const form = option.closest("[data-configurator]");
    form.querySelectorAll(".option").forEach((node) => node.classList.remove("active"));
    option.classList.add("active");
    form.querySelector("[data-custom-row]").style.display = option.matches("[data-custom]") ? "grid" : "none";
    updateConfigurator(form);
  });
}

function priceFor(product, qty) {
  const exact = product.quantities.find((q) => q[0] === qty);
  if (exact) return exact[1];
  const sorted = [...product.quantities].sort((a, b) => a[0] - b[0]);
  const nearest = sorted.reduce((best, row) => Math.abs(row[0] - qty) < Math.abs(best[0] - qty) ? row : best, sorted[0]);
  return Math.max(productMinPrice(product), (nearest[1] / nearest[0]) * qty);
}

function updateConfigurator(form) {
  const product = getProducts()[form.dataset.slug];
  const active = form.querySelector(".option.active");
  const qty = Number(active?.dataset.qty || form.querySelector("[data-custom-qty]").value || product.quantities[0][0]);
  const extra = Number(form.speed.selectedOptions[0].dataset.price) + Number(form.refill.selectedOptions[0].dataset.price);
  form.querySelector("[data-total]").textContent = eur(priceFor(product, qty) + extra);
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
  else if (page === "keywords") app.innerHTML = keywordPage();
  else if (page === "category") app.innerHTML = categoryPage(platform);
  else if (page === "admin") app.innerHTML = adminPage();
  else if (page === "legal") app.innerHTML = legalPage(legal || "Rechtliche Hinweise");
  reveal();
  animatePhoneBoost();
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

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  route();
});
