(function () {
  const LANG_KEY = "ze_lang";
  const SUPPORTED = ["en", "bem", "ny"];

  const STRINGS = {
    en: {
      home: "Home",
      my_shop: "My Shop",
      nav_download: "Download",
      nav_install: "Install",
      login_signup: "Login / Sign Up",
      search_placeholder: "Search catering, DJs, tents...",
      all: "All",
      nearby: "Nearby",
      loading_services: "Loading services…",
      no_services: "No services posted yet.",
      no_match: "No services match your search.",
      save_search: "Notify me of new matches",
      save_search_saved: "We'll notify you when something matches.",
      top_vendors: "Top vendors",
      verified: "Verified",
      boosted: "Boosted",
      share: "Share",
      copy_link: "Copy link",
      copied: "Link copied.",
      whatsapp: "WhatsApp",
      follow: "Follow",
      following: "Following",
      insights: "Insights",
      boost: "Boost",
      edit_shop: "Edit shop",
      view_shop: "View shop",
      referrals: "Referrals",
      saved_searches: "Saved searches",
      following_shops: "Following",
      privacy: "Privacy policy",
      terms: "Terms of use",
      language: "Language",
      report_user: "Report a user",
      download_app: "Download app",
      settings: "Settings",
      offline_title: "You're offline",
      offline_body: "Turn on mobile data or Wi‑Fi, then try again.",
      try_again: "Try again",
      lang_en: "English",
      lang_bem: "Bemba",
      lang_ny: "Nyanja",
      lang_pick: "Choose your language",
    },
    bem: {
      home: "Home",
      my_shop: "Shop Yandi",
      nav_download: "Download",
      nav_install: "Ikani",
      login_signup: "Ingila / Lembesha",
      search_placeholder: "Fwaya catering, DJ, tents...",
      all: "Fyonse",
      nearby: "Pepi",
      loading_services: "Ilesha services…",
      no_services: "Tapali services ifyo.",
      no_match: "Tapali ifikwata ifyo mufwaya.",
      save_search: "Ndengeko ifyapya ifikwata",
      save_search_saved: "Tukamweba nga cakwata.",
      top_vendors: "Abacita bwino",
      verified: "Yasuminishiwako",
      boosted: "Pali front",
      share: "Share",
      copy_link: "Kopanya link",
      copied: "Link yakopwa.",
      whatsapp: "WhatsApp",
      follow: "Konka",
      following: "Nakonka",
      insights: "Amashiwi",
      boost: "Boost",
      edit_shop: "Alula shop",
      view_shop: "Lolesha shop",
      referrals: "Referrals",
      saved_searches: "Ifyo nafwaya",
      following_shops: "Nakonka",
      privacy: "Privacy",
      terms: "Amateka",
      language: "Ululimi",
      report_user: "Lumbula umuntu",
      download_app: "Download app",
      settings: "Settings",
      offline_title: "Tauli pa line",
      offline_body: "Funguleni data nangu Wi‑Fi, kenako mweshe kabili.",
      try_again: "Wesha kabili",
      lang_en: "English",
      lang_bem: "Bemba",
      lang_ny: "Nyanja",
      lang_pick: "Saleni ululimi",
    },
    ny: {
      home: "Home",
      my_shop: "Shop Yanga",
      nav_download: "Download",
      nav_install: "Ikani",
      login_signup: "Lowani / Lembetsani",
      search_placeholder: "Fufuzani catering, DJ, tents...",
      all: "Zonse",
      nearby: "Pafupi",
      loading_services: "Zikutsika services…",
      no_services: "Palibe services pano.",
      no_match: "Palibe zomwe mukufuna.",
      save_search: "Ndiudzeni zatsopano zofananira",
      save_search_saved: "Tidzakudziwani ngati zafanana.",
      top_vendors: "Ma vendor abwino",
      verified: "Yatsimikizidwa",
      boosted: "Pa tsogolo",
      share: "Gawani",
      copy_link: "Kopani link",
      copied: "Link yakopedwa.",
      whatsapp: "WhatsApp",
      follow: "Tsatirani",
      following: "Mukutsatira",
      insights: "Zowerengera",
      boost: "Boost",
      edit_shop: "Sinthani shop",
      view_shop: "Onani shop",
      referrals: "Referrals",
      saved_searches: "Zosungidwa",
      following_shops: "Mukutsatira",
      privacy: "Privacy",
      terms: "Malamulo",
      language: "Chilankhulo",
      report_user: "Nenani munthu",
      download_app: "Download app",
      settings: "Settings",
      offline_title: "Simuli pa line",
      offline_body: "Yatsani data kapena Wi‑Fi, kenako yesaninso.",
      try_again: "Yesaninso",
      lang_en: "English",
      lang_bem: "Bemba",
      lang_ny: "Nyanja",
      lang_pick: "Sankhani chilankhulo",
    },
  };

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    return SUPPORTED.includes(saved) ? saved : "en";
  }

  function t(key, fallback) {
    const table = STRINGS[getLang()] || STRINGS.en;
    const text = table[key] || STRINGS.en[key] || fallback || key;
    return text;
  }

  function applyTranslations(root) {
    const el = root || document;
    el.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    el.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
    });
  }

  function setLangAndApply(code) {
    const lang = SUPPORTED.includes(code) ? code : "en";
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations(document);
    window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function hasLang() {
    return SUPPORTED.includes(localStorage.getItem(LANG_KEY));
  }

  window.t = t;
  window.getLang = getLang;
  window.applyTranslations = applyTranslations;
  window.setLangAndApply = setLangAndApply;
  window.hasLang = hasLang;
  window.ZE_LANGS = SUPPORTED;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyTranslations(document));
  } else {
    applyTranslations(document);
  }
})();
