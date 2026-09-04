(function () {
  const DARK_KEY = "ze_dark_mode";
  const LOW_KEY = "ze_low_data";
  const STYLE_ID = "ze-prefs-css";

  function isDark() {
    try { return localStorage.getItem(DARK_KEY) === "true"; } catch { return false; }
  }

  function isLowData() {
    try { return localStorage.getItem(LOW_KEY) === "true"; } catch { return false; }
  }

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html.dark, html.dark body, body.dark {
        --bg: #1A1614;
        --card: #2A2420;
        --border: #4A403A;
        --text: #F4F1EC;
        --subtext: #C4B8B0;
        --cream: #3A2A22;
        --peach: #E8B896;
        --black: #0B0B0B;
      }
      html.dark body, body.dark { background: var(--bg); color: var(--text); }
      html.dark .bottom-nav { background: #0B0B0B; border-top-color: #2A2420; }
      body.low-data img { image-rendering: auto; }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function applyTheme() {
    injectCss();
    const dark = isDark();
    document.documentElement.classList.toggle("dark", dark);
    if (document.body) document.body.classList.toggle("dark", dark);
    if (document.body) document.body.classList.toggle("low-data", isLowData());
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#1A1614" : "#C2410C");
  }

  function setDark(enabled) {
    localStorage.setItem(DARK_KEY, enabled ? "true" : "false");
    applyTheme();
  }

  function setLowData(enabled) {
    localStorage.setItem(LOW_KEY, enabled ? "true" : "false");
    applyTheme();
    window.dispatchEvent(new Event("lowdatachange"));
  }

  function optimizeImageUrl(url, preset) {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
    const sizes = { thumb: 240, card: 360, hero: 640, chat: 280, avatar: 64, full: 960 };
    const w = sizes[preset] || sizes.card;
    const q = isLowData() ? "q_auto:low" : "q_auto:good";
    const transform = `w_${w},c_limit,${q},f_auto`;
    if (url.includes(`/upload/${transform}/`)) return url;
    return url.replace("/upload/", `/upload/${transform}/`);
  }

  function patchFirstPhoto() {
    if (!window.ZE || ZE._imgPatched) return;
    ZE._imgPatched = true;
    const orig = ZE.firstPhoto.bind(ZE);
    ZE.firstPhoto = function (photos) {
      return optimizeImageUrl(orig(photos), "card");
    };
  }

  applyTheme();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { applyTheme(); patchFirstPhoto(); });
  } else {
    applyTheme();
    patchFirstPhoto();
  }
  window.addEventListener("pageshow", applyTheme);

  window.ZEPrefs = { isDark, isLowData, setDark, setLowData, applyTheme, optimizeImageUrl };
})();
